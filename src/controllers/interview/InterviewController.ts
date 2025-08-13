import { inject, injectable } from "inversify";
import { IInterviewController } from "./IInterviewController";
import { DiServices } from "../../di/types";
import { IInterviewService } from "../../services/interview/IInterviewService";
import { Request,Response } from "express";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import { HttpStatus } from "../../config/HttpStatusCodes";
@injectable()
export class InterviewController implements IInterviewController {
  constructor(
    @inject(DiServices.InterviewService)
    private readonly _interviewService: IInterviewService
  ) {}
 async updateAndSubmitFeedback(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      console.log("entered updateAndSubmitFeedback");
      const interviewId = request.params.id;
      const {feedback}=request.body;
      console.log("interviewId",interviewId);
      console.log("feedbackPayload",feedback);
      await this._interviewService.updateAndSubmitFeedback(
        interviewId,
        feedback
      );
      return createResponse(response, HttpStatus.OK, true,"Feedback submitted")
    } catch (error) {
      console.log(error);
      errorResponse(response, error);
    }
  }
  async getScheduledInterviews(request: Request, response: Response): Promise<void> {
    const candidateId=request.params.id;
    try {
      console.log("entered getScheduledInterviews");
      const interviews = await this._interviewService.getScheduledInterviews(candidateId);
      return createResponse(response, HttpStatus.OK, true,"Interviews fetched successfully",interviews)
    } catch (error) {
      console.log(error);
      errorResponse(response, error);
    }
  }
}
