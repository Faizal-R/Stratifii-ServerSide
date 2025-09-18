import { inject, injectable } from "inversify";
import { IInterviewService } from "./IInterviewService";
import { DI_TOKENS } from "../../di/types";
import { IDelegatedCandidateRepository } from "../../repositories/candidate/candidateDelegation/IDelegatedCandidateRepository";
import {
  generateMockQuestions,
  IQuestion,
} from "../../helper/generateMockQuestions";

import { IJob } from "../../models/job/Job";
import { CustomError } from "../../error/CustomError";
import { HttpStatus } from "../../config/HttpStatusCodes";
import {
  IInterview,
  IInterviewFeedback,
} from "../../models/interview/Interview";
import { IInterviewRepository } from "../../repositories/interview/IInterviewRepository";
import { time } from "console";
import { IWalletRepository } from "../../repositories/wallet/IWalletRepository";
import { ITransactionRepository } from "../../repositories/transaction/ITransactionRepository";
import { Types } from "mongoose";
import { Roles } from "../../constants/enums/roles";

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
    console.log(
      "requirements for generate mock questions",
      position,
      experienceRequired,
      requiredSkills,
      description
    );
    const generatedQuestions =
      (await generateMockQuestions(
        position,
        experienceRequired,
        requiredSkills,
        description
      )) ?? [];

    return generatedQuestions;
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
        throw new Error("Delegation not found");
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
      throw error;
    }
  }

  async getUpcomingInterviews(interviewerId: string): Promise<IInterview[]> {
    try {
      const upcomingInterviews =
        await this._interviewRepository.getInterviewDetails({
          interviewer: interviewerId,
        });
      console.log(upcomingInterviews);

      return upcomingInterviews;
    } catch (error) {
      throw error;
    }
  }
  async updateAndSubmitFeedback(
    interviewId: string,
    feedback: IInterviewFeedback
  ): Promise<void> {
    console.log("feedback", feedback);
    try {
      const interview = await this._interviewRepository.update(interviewId, {
        feedback,
        status: "completed",
      });

      const delegatedCandidate =
        await this._delegatedCandidateRepository.findOne({
          candidate: interview?.candidate,
          job: interview?.job,
        });

      const interviewRound = {
        feedback,
        status: feedback.needsFollowUp ? "followup" : "completed",
        type: "followup",
        roundNumber: delegatedCandidate?.interviewRounds?.length || 1,
        timeZone: "UTC",
        interviewer: interview?.interviewer,
      };

      await this._delegatedCandidateRepository.update(
        delegatedCandidate?._id as string,
        {
          status: interviewRound.feedback.needsFollowUp
            ? "in_interview_process"
            : "interview_completed",
          $push: { interviewRounds: interviewRound },
          totalNumberOfRounds:
            (delegatedCandidate?.totalNumberOfRounds as number) + 1,
          isInterviewScheduled: false,
        }
      );
      const interviewerWallet = await this._walletRepository.findOne({
        userId: interview?.interviewer!,
      });
      await this._transactionRepository.create({
        walletId: interviewerWallet?._id as Types.ObjectId,
        type: "credit",
        amount: 1000,
        referenceType: "interview",
        referenceId: interview?._id as Types.ObjectId,
        description: "Interview Fee",
      });
      await this._walletRepository.update(interviewerWallet?._id as string, {
        balance: (interviewerWallet?.balance as number) + 1000,
        totalEarned: (interviewerWallet?.totalEarned as number) + 1000,
      });
    } catch (error) {
      throw error;
    }
  }
  async getScheduledInterviews(
    candidateId: string
  ): Promise<IInterview[] | []> {
    try {
      const interviews = await this._interviewRepository.getInterviewDetails({
        candidate: candidateId,
      });
      if (!interviews) {
        return [];
      }
      return interviews;
    } catch (error) {
      throw error;
    }
  }

  async getAllInterviewsByCandidateId(
    candidateId: string
  ): Promise<IInterview[] | []> {
    try {
      const interviews = await this._interviewRepository.getInterviewDetails({
        candidate: candidateId,
        status: { $eq: "completed" },
      });
      console.log("interviewsByCandidateId", interviews);
      if (!interviews) {
        return [];
      }
      return interviews;
    } catch (error) {
      throw error;
    }
  }
}
