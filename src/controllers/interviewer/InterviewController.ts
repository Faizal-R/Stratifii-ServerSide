import { Request, Response } from "express";
import { IInterviewerService } from "../../services/interviewer/IInterviewerService";
import { IInterviewerController } from "./IInterviewerController";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import { HttpStatus } from "../../config/HttpStatusCodes";
import {
  INTERVIEWER__SUCCESS_MESSAGES,
  USER_COMMON_MESSAGES,
} from "../../constants/messages/UserProfileMessages";

import { InterviewerProfileSchema } from "../../validations/InterviewerValidations";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helper/generateTokens";
import { Roles } from "../../constants/roles";
import { COOKIE_OPTIONS } from "../../config/CookieConfig";
import { ISlotService } from "../../services/slot/ISlotService";
import { IInterviewSlot } from "../../models/slot/interviewSlot";
import { inject, injectable } from "inversify";
import { DiServices } from "../../di/types";

@injectable()
export class InterviewerController implements IInterviewerController {
  constructor(
    @inject(DiServices.InterviewerService)
    private readonly _interviewerService: IInterviewerService,
    @inject(DiServices.SlotService)
    private readonly _slotService: ISlotService
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
      console.log(request.body);
      const interviewerId = request.user?.userId ?? request.body.interviewerId;
      const interviewer = InterviewerProfileSchema.safeParse(request.body);
      if (!interviewer.success) {
        return createResponse(
          response,
          HttpStatus.BAD_REQUEST,
          false,
          interviewer.error.message
        );
      }

      const updatedInterviewer =
        this._interviewerService.updateInterviewerProfile(
          interviewerId!,
          interviewer.data
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
  async generateSlots(request: Request, response: Response): Promise<void> {
    try {
      const ruleData = request.body;
      console.log(request.body);
      const interviewerId = request.user?.userId;
      const slots = await this._slotService.createRuleAndGenerateSlots({
        ...ruleData,
        interviewerId,
        duration: ruleData.slotDuration,
        buffer: ruleData.bufferRate,
      });
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        "Slots generated successfully",
        // INTERVIEWER__SUCCESS_MESSAGES.SLOTS_GENERATED,
        slots
      );
    } catch (error) {
      console.error("Error generating slots:", error);
      return errorResponse(response, error);
    }
  }
  async getSlotsByInterviewerId(
    request: Request,
    response: Response
  ): Promise<void> {
    const interviewerId = request.params.id;
    try {
      const slots = await this._slotService.getSlotsByInterviewerId(
        interviewerId
      );

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
}
