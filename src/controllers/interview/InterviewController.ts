import { inject, injectable } from "inversify";
import { IInterviewController } from "./IInterviewController";
import { DI_TOKENS } from "../../di/types";
import { IInterviewService } from "../../services/interview/IInterviewService";
import { Request,Response } from "express";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import { HttpStatus } from "../../config/HttpStatusCodes";
@injectable()
export class InterviewController implements IInterviewController {
  constructor(
  @inject(DI_TOKENS.SERVICES.INTERVIEW_SERVICE)
private readonly _interviewService: IInterviewService

  ) {}
 async updateAndSubmitFeedback(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      
      const interviewId = request.params.id;
      const {feedback}=request.body;
      
      
      await this._interviewService.updateAndSubmitFeedback(
        interviewId,
        feedback
      );
      return createResponse(response, HttpStatus.OK, true,"Feedback submitted")
    } catch (error) {
      
      errorResponse(response, error);
    }
  }
  async getScheduledInterviews(request: Request, response: Response): Promise<void> {
    const candidateId=request.params.id;
    try {
      
      const interviews = await this._interviewService.getScheduledInterviews(candidateId);
      return createResponse(response, HttpStatus.OK, true,"Interviews fetched successfully",interviews)
    } catch (error) {
      
      errorResponse(response, error);
    }
  }

 async getAllInterviewsByCandidateId(request: Request, response: Response): Promise<void> {
    const candidateId = request.params.candidateId;
    try {
      
      const interviews = await this._interviewService.getAllInterviewsByCandidateId(candidateId);
      return createResponse(response, HttpStatus.OK, true,"Interviews fetched successfully",interviews)
    } catch (error) {
      
      errorResponse(response, error);
    }
  }

  
}
