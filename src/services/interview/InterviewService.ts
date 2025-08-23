import { inject, injectable } from "inversify";
import { IInterviewService } from "./IInterviewService";
import { DiRepositories } from "../../di/types";
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

@injectable()
export class InterviewService implements IInterviewService {
  constructor(
    @inject(DiRepositories.DelegatedCandidateRepository)
    private readonly _delegatedCandidateRepository: IDelegatedCandidateRepository,
    @inject(DiRepositories.InterviewRepository)
    private readonly _interviewRepository: IInterviewRepository
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
      return upcomingInterviews;
    } catch (error) {
      throw error;
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
      const delegatedCandidate =
        await this._delegatedCandidateRepository.findOne({
          candidate: interview?.candidate,
          job: interview?.job,
        });
      await this._delegatedCandidateRepository.update(
        delegatedCandidate?._id as string,
        { status: "final_completed", finalInterviewFeedback: feedback }
      );

      console.log("Updatedinterview", interview);
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
        status:{$eq:"completed"}
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
