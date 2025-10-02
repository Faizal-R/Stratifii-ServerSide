import { inject, injectable } from "inversify";
import { IInterviewService } from "./IInterviewService";
import { DI_TOKENS } from "../../di/types";
import { IDelegatedCandidateRepository } from "../../repositories/candidate/candidateDelegation/IDelegatedCandidateRepository";
import {
  generateMockQuestions,
  IQuestion,
} from "../../helper/generateMockQuestions";
import { CustomError } from "../../error/CustomError";
import { HttpStatus } from "../../config/HttpStatusCodes";
import {
  IInterview,
  IInterviewFeedback,
} from "../../models/interview/Interview";
import { IInterviewRepository } from "../../repositories/interview/IInterviewRepository";
import { IWalletRepository } from "../../repositories/wallet/IWalletRepository";
import { ITransactionRepository } from "../../repositories/transaction/ITransactionRepository";
import { Types } from "mongoose";
import { IJob } from "../../models/job/Job";
import { ICandidate } from "../../models/candidate/Candidate";
import { generateSignedUrl } from "../../helper/s3Helper";
import { CandidateMapper } from "../../mapper/candidate/CandidateMapper";
import { InterviewResponseDTO } from "../../dto/response/interview/InterviewResponseDTO";
import { InterviewMapper } from "../../mapper/interview/InterviewMapper";

@injectable()
export class InterviewService implements IInterviewService {
  constructor(
    @inject(DI_TOKENS.REPOSITORIES.DELEGATED_CANDIDATE_REPOSITORY)
    private readonly _delegatedCandidateRepository: IDelegatedCandidateRepository,
    @inject(DI_TOKENS.REPOSITORIES.INTERVIEW_REPOSITORY)
    private readonly _interviewRepository: IInterviewRepository,
    @inject(DI_TOKENS.REPOSITORIES.WALLET_REPOSITORY)
    private readonly _walletRepository: IWalletRepository,
    @inject(DI_TOKENS.REPOSITORIES.TRANSACTION_REPOSITORY)
    private readonly _transactionRepository: ITransactionRepository
  ) {}

  async generateCandidateMockInterviewQuestions(
    delegationId: string
  ): Promise<IQuestion[]> {
    try {
      const delegation =
        await this._delegatedCandidateRepository.getDelegationDetails({
          _id: delegationId,
        });
      if (!delegation || !delegation.job) {
        throw new CustomError(
          "Delegation or associated job not found.",
          HttpStatus.NOT_FOUND
        );
      }

      const { position, experienceRequired, requiredSkills, description } =
        delegation.job as IJob;
      if (!position || !experienceRequired || !requiredSkills || !description) {
        throw new CustomError(
          "Incomplete job details for mock question generation.",
          HttpStatus.BAD_REQUEST
        );
      }

      const generatedQuestions =
        (await generateMockQuestions(
          position,
          experienceRequired,
          requiredSkills,
          description
        )) ?? [];

      return generatedQuestions;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "An error occurred while generating mock interview questions.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async finalizeAIMockInterview(
    delegationId: string,
    resultPayload: { percentage: number; correct: number; total: number }
  ): Promise<{ passed: boolean; message: string }> {
    try {
      const delegation =
        await this._delegatedCandidateRepository.getDelegationDetails({
          _id: delegationId,
        });
      if (!delegation) {
        throw new CustomError("Delegation not found.", HttpStatus.NOT_FOUND);
      }

      const isPassed = resultPayload.percentage >= 80;

      await this._delegatedCandidateRepository.update(
        delegation._id as string,
        {
          aiMockResult: {
            correctAnswers: resultPayload.correct,
            totalQuestions: resultPayload.total,
            scoreInPercentage: resultPayload.percentage,
          },
          status: isPassed ? "mock_completed" : "mock_failed",
          isQualifiedForFinal: isPassed,
        }
      );

      return {
        passed: isPassed,
        message: isPassed
          ? "Candidate qualified for the final interview."
          : "Candidate did not qualify for the final round.",
      };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "An error occurred while finalizing AI mock interview.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUpcomingInterviews(
    interviewerId: string
  ): Promise<InterviewResponseDTO[]> {
    try {
      const upcomingInterviews =
        await this._interviewRepository.getInterviewDetails({
          interviewer: interviewerId,
        });
      const mappedCandidatesInInterviews = await Promise.all(
        upcomingInterviews.map(async (interview: IInterview) => {
          const candidate = interview.candidate as ICandidate;
          const candidateAvatarUrl = await generateSignedUrl(
            candidate.avatarKey as string
          );
          const candidateResumeUrl = await generateSignedUrl(
            candidate.resumeKey
          );
          return InterviewMapper.toResponse(
            interview,
            candidateResumeUrl as string,
            candidateAvatarUrl as string
          );
        })
      );
      return mappedCandidatesInInterviews ?? [];
    } catch {
      throw new CustomError(
        "Failed to fetch upcoming interviews.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateAndSubmitFeedback(
    interviewId: string,
    feedback: IInterviewFeedback
  ): Promise<void> {
    try {
      const interview = await this._interviewRepository.update(interviewId, {
        feedback,
        status: "completed",
      });

      if (!interview) {
        throw new CustomError("Interview not found.", HttpStatus.NOT_FOUND);
      }

      const delegatedCandidate =
        await this._delegatedCandidateRepository.findOne({
          candidate: interview.candidate,
          job: interview.job,
        });

      if (!delegatedCandidate) {
        throw new CustomError(
          "Delegated candidate not found.",
          HttpStatus.NOT_FOUND
        );
      }

      const interviewRound = {
        feedback,
        status: feedback.needsFollowUp ? "followup" : "completed",
        type: "followup",
        roundNumber: delegatedCandidate.interviewRounds?.length || 1,
        timeZone: "UTC",
        interviewer: interview.interviewer,
      };

      await this._delegatedCandidateRepository.update(
        delegatedCandidate._id as string,
        {
          status: feedback.needsFollowUp
            ? "in_interview_process"
            : "interview_completed",
          $push: { interviewRounds: interviewRound },
          totalNumberOfRounds:
            (delegatedCandidate.totalNumberOfRounds ?? 0) + 1,
          isInterviewScheduled: false,
        }
      );

      const interviewerWallet = await this._walletRepository.findOne({
        userId: interview.interviewer,
      });
      if (!interviewerWallet) {
        throw new CustomError(
          "Interviewer wallet not found.",
          HttpStatus.NOT_FOUND
        );
      }

      await this._transactionRepository.create({
        walletId: interviewerWallet._id as Types.ObjectId,
        type: "credit",
        amount: 1000,
        referenceType: "interview",
        referenceId: interview._id as Types.ObjectId,
        description: "Interview Fee",
      });

      await this._walletRepository.update(interviewerWallet._id as string, {
        balance: (interviewerWallet.balance ?? 0) + 1000,
        totalEarned: (interviewerWallet.totalEarned ?? 0) + 1000,
      });
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to update and submit interview feedback.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getScheduledInterviews(candidateId: string): Promise<InterviewResponseDTO[]> {
    try {
      const interviews = await this._interviewRepository.getInterviewDetails({
        candidate: candidateId,
      });
       const mappedCandidatesInInterviews = await Promise.all(
        interviews.map(async (interview: IInterview) => {
          const candidate = interview.candidate as ICandidate;
          const candidateAvatarUrl = await generateSignedUrl(
            candidate.avatarKey as string
          );
          const candidateResumeUrl = await generateSignedUrl(
            candidate.resumeKey
          );
          return InterviewMapper.toResponse(
            interview,
            candidateResumeUrl as string,
            candidateAvatarUrl as string
          );
        })
      );
      return mappedCandidatesInInterviews ?? [];
    } catch {
      throw new CustomError(
        "Failed to fetch scheduled interviews.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllInterviewsByCandidateId(
    candidateId: string
  ): Promise<InterviewResponseDTO []> {
    try {
      const interviews = await this._interviewRepository.getInterviewDetails({
        candidate: candidateId,
        status: { $eq: "completed" },
      });
       const mappedCandidatesInInterviews = await Promise.all(
        interviews.map(async (interview: IInterview) => {
          const candidate = interview.candidate as ICandidate;
          const candidateAvatarUrl = await generateSignedUrl(
            candidate.avatarKey as string
          );
          const candidateResumeUrl = await generateSignedUrl(
            candidate.resumeKey
          );
          return InterviewMapper.toResponse(
            interview,
            candidateResumeUrl as string,
            candidateAvatarUrl as string
          );
        })
      );

      return mappedCandidatesInInterviews ?? [];
    } catch {
      throw new CustomError(
        "Failed to fetch completed interviews for the candidate.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
