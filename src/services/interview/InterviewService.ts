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
import { InterviewResponseDTO } from "../../dto/response/interview/InterviewResponseDTO";
import { InterviewMapper } from "../../mapper/interview/InterviewMapper";
import { DelegatedCandidateMapper } from "../../mapper/candidate/DelegatedCandidateMapper";
import { DelegatedCandidateForCompanyDTO } from "../../dto/response/candidate/DelegatedCandidateResponseDTO";
import { Roles } from "../../constants/enums/roles";
import { sendEmail } from "../../helper/EmailService";
import { generateMockInterviewResultEmail } from "../../helper/htmlWrapper";
import { ICompany } from "../../models/company/Company";

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
      console.log("here", delegation);

      const { position, experienceRequired, requiredSkills, description } =
        delegation.job as IJob;
      if (!position || !requiredSkills || !description) {
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
      console.log(delegation);
      if (!delegation) {
        throw new CustomError("Delegation not found.", HttpStatus.NOT_FOUND);
      }

      const isPassed = resultPayload.percentage >= 80;

      const updatedDelegatedCandidate =
        await this._delegatedCandidateRepository.update(
          delegation._id.toString(),
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
      const candidate = delegation?.candidate as ICandidate;
      const company = delegation?.company as ICompany;
      const job = delegation?.job as IJob;
      const html = generateMockInterviewResultEmail({
        candidateName: candidate.name,
        companyName: company.name,
        jobTitle: job.position,
        aiMockResult: updatedDelegatedCandidate?.aiMockResult!,
      });
     

      await sendEmail(
        company.email,
        html,
        `Mock Interview Result of ${candidate.name} - ${job.position}`
      );

      return {
        passed: isPassed,
        message: isPassed
          ? "Candidate qualified for the Next Round of Interview."
          : "Candidate did not qualify for the Next round of Interview.",
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
        delegatedCandidate._id.toString(),
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

      await this._walletRepository.update(interviewerWallet._id.toString(), {
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

  async getScheduledInterviews(
    candidateId: string
  ): Promise<InterviewResponseDTO[]> {
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
  ): Promise<InterviewResponseDTO[]> {
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
  async completeCandidateInterviewProcess(
    delegatedCandidateId: string
  ): Promise<void> {
    try {
      const updatedDelegatedCandidate =
        await this._delegatedCandidateRepository.update(delegatedCandidateId, {
          status: "shortlisted",
        });
      if (!updatedDelegatedCandidate) {
        throw new CustomError(
          "Delegated candidate not found.",
          HttpStatus.NOT_FOUND
        );
      }
      // return DelegatedCandidateMapper.toShowCompany(
      //   updatedDelegatedCandidate,
      //   "",
      //   ""
      // );
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to complete candidate interview process.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async handleNoShowInterview(
    interviewId: string,
    noShowBy: string
  ): Promise<IInterview> {
    try {
      const interview = await this._interviewRepository.findById(interviewId);
      if (!interview) {
        throw new CustomError(
          "No Interview found with this id",
          HttpStatus.NOT_FOUND
        );
      }
      const updatedInterview = await this._interviewRepository.update(
        interviewId,
        {
          status: "no_show",
          noShowBy,
          noShowAt: new Date(),
        }
      );

      const delegatedCandidate =
        await this._delegatedCandidateRepository.findOne({
          candidate: interview.candidate,
          job: interview.job,
        });

      if (!delegatedCandidate) {
        throw new CustomError(
          "No Delegated Candidate found with this id",
          HttpStatus.NOT_FOUND
        );
      }
      const candidateInterviewRound = {
        roundNumber: delegatedCandidate.totalNumberOfRounds + 1,
        type: noShowBy === Roles.CANDIDATE ? "followup" : "final",
        status: "no_show",
        interviewer: interview.interviewer,
        isFollowUpScheduled: false,
      };

      if (noShowBy === Roles.CANDIDATE) {
        await this._delegatedCandidateRepository.update(
          delegatedCandidate._id.toString(),
          {
            isInterviewScheduled: false,
            totalNumberOfRounds: delegatedCandidate.totalNumberOfRounds + 1,
            $push: { interviewRounds: candidateInterviewRound },
          }
        );
      } else {
        await this._delegatedCandidateRepository.update(
          delegatedCandidate._id.toString(),
          {
            status: "disqualified",
            isInterviewScheduled: false,
            totalNumberOfRounds: delegatedCandidate.totalNumberOfRounds + 1,
            $push: { interviewRounds: candidateInterviewRound },
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

        await this._walletRepository.update(interviewerWallet._id.toString(), {
          balance: (interviewerWallet.balance ?? 0) + 1000,
          totalEarned: (interviewerWallet.totalEarned ?? 0) + 1000,
        });
      }
      return updatedInterview as IInterview;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to handle no show interview.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
