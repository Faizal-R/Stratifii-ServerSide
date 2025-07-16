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

@injectable()
export class InterviewService implements IInterviewService {
  constructor(
    @inject(DiRepositories.DelegatedCandidateRepository)
    private readonly _delegatedCandidateRepository: IDelegatedCandidateRepository
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
    const delegation =
      await this._delegatedCandidateRepository.getDelegationDetails({
        _id: delegationId,
      });

    if (!delegation) {
      throw new Error("Delegation not found");
    }

    const isPassed = resultPayload.percentage >= 80;

    await this._delegatedCandidateRepository.update(delegation._id as string, {
      aiMockResult: {
        correctAnswers: resultPayload.correct,
        totalQuestions: resultPayload.total,
        scoreInPercentage: resultPayload.percentage,
      },
      status: isPassed ? "mock_completed" : "mock_failed",
      isQualifiedForFinal: isPassed,
    });

    return {
      passed: isPassed,
      message: isPassed
        ? "Candidate qualified for the final interview."
        : "Candidate did not qualify for the final round.",
    };
  }
}
