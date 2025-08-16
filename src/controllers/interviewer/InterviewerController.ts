import { Request, Response } from "express";
import { IInterviewerService } from "../../services/interviewer/IInterviewerService";
import { IInterviewerController } from "./IInterviewerController";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import { HttpStatus } from "../../config/HttpStatusCodes";
import {
  INTERVIEWER__SUCCESS_MESSAGES,
  USER_COMMON_MESSAGES,
} from "../../constants/messages/UserProfileMessages";

import { ISlotService } from "../../services/slot/ISlotService";

import { inject, injectable } from "inversify";
import { DiServices } from "../../di/types";
import { IInterviewService } from "../../services/interview/IInterviewService";

@injectable()
export class InterviewerController implements IInterviewerController {
  constructor(
    @inject(DiServices.InterviewerService)
    private readonly _interviewerService: IInterviewerService,
    @inject(DiServices.SlotService)
    private readonly _slotService: ISlotService,
    @inject(DiServices.InterviewService)
    private readonly _interviewService: IInterviewService
  ) {}

  async getInterviewerProfile(request: Request, response: Response) {
    try {
      const interviewerId = request.user?.userId;
      const interviewer = await this._interviewerService.getInterviewerById(
        interviewerId!
      );
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        INTERVIEWER__SUCCESS_MESSAGES.INTERVIEWER_PROFILE_FETCHED,
        interviewer
      );
    } catch (error) {
      console.log("error while fetching", error);
      return errorResponse(response, error);
    }
  }
  async updateInterviewerProfile(request: Request, response: Response) {
    try {
      const interviewerId = request.user?.userId ?? request.body.interviewerId;
      const interviewer = JSON.parse(request.body.interviewer); //request.body
      console.log(interviewer);
      const avatar = request.file as Express.Multer.File;
      // if (!interviewer.success) {
      //   return createResponse(
      //     response,
      //     HttpStatus.BAD_REQUEST,
      //     false,
      //     interviewer.error.issues[0].message
      //   );
      // }

      const updatedInterviewer =
        this._interviewerService.updateInterviewerProfile(
          interviewerId!,
          interviewer,
          avatar
        );
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        INTERVIEWER__SUCCESS_MESSAGES.INTERVIEWER_PROFILE_UPDATED,
        updatedInterviewer
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }

  async changePassword(request: Request, response: Response): Promise<void> {
    const passwordDetails = request.body;

    try {
      const interviewer = await this._interviewerService.changePassword(
        passwordDetails.currentPassword,
        passwordDetails.newPassword,
        request.user?.userId!
      );
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        USER_COMMON_MESSAGES.PASSWORD_CHANGED,
        interviewer
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
  async createSlotGenerationRule(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const ruleData = request.body;
      console.log(request.body);
      const interviewerId = request.user?.userId;
      const slots = await this._slotService.createSlotGenerationRule({
        ...ruleData,
        interviewerId,
        duration: ruleData.slotDuration,
        buffer: ruleData.bufferRate,
      });
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        "Slots Generation Rule Created successfully"
        // INTERVIEWER__SUCCESS_MESSAGES.SLOTS_GENERATED,
        // slots
      );
    } catch (error) {
      console.error("Error generating slots:", error);
      return errorResponse(response, error);
    }
  }
  async getSlotsByRule(request: Request, response: Response): Promise<void> {
    const interviewerId = request.params.id;
    try {
      const slots = await this._slotService.getSlotsByRule(interviewerId);
      console.log("slots", slots);

      return createResponse(
        response,
        HttpStatus.OK,
        true,
        "Slots fetched successfully",
        //  INTERVIEWER__SUCCESS_MESSAGES.SLOTS_FETCHED,
        slots
      );
    } catch (error) {
      return errorResponse(response, error);
    }
  }

  async getInterviewerSlotGenerationRule(
    request: Request,
    response: Response
  ): Promise<void> {
    const interviewerId = request.params.id;
    try {
      const rule =
        await this._slotService.getInterviewerSlotGenerationRule(interviewerId);
      console.log(interviewerId, "Rule in Interviewer Controller", rule);
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        "Successfully fetched interviewer slot generation rule",
        // "Slots fetched successfully",
        //  INTERVIEWER__SUCCESS_MESSAGES.SLOTS_FETCHED,
        rule
      );
    } catch (error) {
      return errorResponse(response, error);
    }
  }

  async getUpcomingInterviews(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const interviewerId = request.user?.userId;
      const upcomingInterviews =
        await this._interviewService.getUpcomingInterviews(interviewerId!);

      return createResponse(
        response,
        HttpStatus.OK,
        true,
        "Successfully fetched upcoming interviews",

        upcomingInterviews
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
}
