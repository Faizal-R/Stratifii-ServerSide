import { Request, Response } from "express";
import { ICandidateController } from "./ICandidateController";
import { ICandidateService } from "../../services/candidate/ICandidateService";

import { createResponse, errorResponse } from "../../helper/responseHandler";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { AUTH_MESSAGES } from "../../constants/messages/AuthMessages";
import { ERROR_MESSAGES } from "../../constants/messages//ErrorMessages";
import { CANDIDATE_SUCCESS_MESSAGE } from "../../constants/messages/UserProfileMessages";
import { inject, injectable } from "inversify";
import { DI_TOKENS } from "../../di/types";
import { CANDIDATE_JOB_MESSAGE } from "../../constants/messages/CandidateMessages";

import { IInterviewService } from "../../services/interview/IInterviewService";

@injectable()
export class CandidateController implements ICandidateController {
  constructor(
    @inject(DI_TOKENS.SERVICES.CANDIDATE_SERVICE)
    private readonly _candidateService: ICandidateService,

    @inject(DI_TOKENS.SERVICES.INTERVIEW_SERVICE)
    private readonly _interviewService: IInterviewService
  ) {}
  async setupCandidateProfile(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const {
        candidatePassword: password,
        candidateConfirmPassword: confirmPassword,
        token,
      } = request.body;
      console.log(request.body);

      const avatar = request.file;
      console.log(avatar);

      if (!password || !confirmPassword || !token) {
        return createResponse(
          response,
          HttpStatus.BAD_REQUEST,
          false,
          ERROR_MESSAGES.INVALID_INPUT
        );
      }

      if (password !== confirmPassword) {
        return createResponse(
          response,
          HttpStatus.BAD_REQUEST,
          false,
          ERROR_MESSAGES.PASSWORD_MISMATCH
        );
      }
      console.log("all Cleared in setupCandidateProfile");

      const candidate = await this._candidateService.setupCandiateProfile(
        avatar!,
        password,
        token
      );
      console.log(candidate);
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_MESSAGES.CANDIDATE_SETUP_SUCCESS,
        candidate
      );
    } catch (error) {
      console.log("candidate error", error);
      errorResponse(response, error);
    }
  }
  async getCandidateProfile(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const candidateId = request.params.id;
      if (!candidateId) {
        return createResponse(
          response,
          HttpStatus.BAD_REQUEST,
          false,
          ERROR_MESSAGES.INVALID_INPUT
        );
      }
      const candidate = await this._candidateService.getCandidateProfile(
        candidateId
      );
      if (!candidate) {
        return createResponse(
          response,
          HttpStatus.NOT_FOUND,
          false,
          "Candidate not found"
          // ERROR_MESSAGES.CANDIDATE_NOT_FOUND
        );
      }
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        CANDIDATE_SUCCESS_MESSAGE.CANDIDATE_PROFILE_FETCHED,
        candidate
      );
    } catch (error) {
      console.log("Error in getCandidateProfile", error);
      errorResponse(response, error);
    }
  }

  async getDelegatedJobs(request: Request, response: Response): Promise<void> {
    try {
      console.log(request.user);
      const candidateId = request.user?.userId;
      const delegations = await this._candidateService.getDelegatedJobs(
        candidateId!
      );
      return createResponse(
        response,
        HttpStatus.CREATED,
        true,
        CANDIDATE_JOB_MESSAGE.FETCH_DELEGATED_JOBS,
        delegations
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
  async generateCandidateMockInterviewQuestions(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const delegationId = request.params.id;
      console.log("entered in this Controller GeneratedMockInterviewQuestions",delegationId)
      const questions =
        await this._interviewService.generateCandidateMockInterviewQuestions(
          delegationId
        );
        console.log("quest:",questions)
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        "Questions Generated Successfully",
        questions
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
 async finalizeAIMockInterview(request: Request, response: Response): Promise<void> {
  try {
    const { delegationId } = request.body;
    const { percentage, correct, total } = request.body.resultData;


    if (!delegationId || percentage == null || correct == null || total == null) {
      return createResponse(
        response,
        HttpStatus.BAD_REQUEST,
        false,
        ERROR_MESSAGES.INVALID_INPUT
      );
    }

    const {message,passed:isPassed} = await this._interviewService.finalizeAIMockInterview(delegationId, {
      percentage,
      correct,
      total,
    });

    return createResponse(
      response,
      HttpStatus.OK,
      true,
      message,
      isPassed
    );
  } catch (error) {
    console.log("Error in finalizeAIMockInterview:", error);
    errorResponse(response, error);
  }
}

}
