import { inject } from "inversify";
import { DI_TOKENS } from "../../di/types";
import { IInterviewSlot } from "../../models/slot/interviewSlot";
import { ISlotService } from "../../services/slot/ISlotService";
import { ISlotController } from "./ISlotController";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import { Request, Response } from "express";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { IInterview } from "../../models/interview/Interview";

export class SlotController implements ISlotController {
  constructor(
   @inject(DI_TOKENS.SERVICES.SLOT_SERVICE)
private readonly _slotService: ISlotService

  ) {}

  async bookSlotForCandidate(
    request: Request,
    response: Response
  ): Promise<void> {
    const payloadForSlotBooking = request.body;
    const company = request.user?.userId;
    try {
      const scheduledInterview: IInterview =
        await this._slotService.bookSlotForCandidate({
          ...payloadForSlotBooking,
          bookedBy:company,
        });
      createResponse(
        response,
        HttpStatus.OK,
        true,
        "Slot Booked Successfully",
        {bookedSlot:scheduledInterview}
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
    const interviewerId = request.params.interviewerId;
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
 
  async updateInterviewerSlotGenerationRule(
    request: Request,
    response: Response
  ): Promise<void> {
    const interviewerId = request.params.interviewerId;
    const ruleData = request.body;
    try {
      const updatedRule =
        await this._slotService.updateInterviewerSlotGenerationRule(
          interviewerId,
          ruleData
        );
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        "Successfully updated interviewer slot generation rule",
        // INTERVIEWER__SUCCESS_MESSAGES.SLOT_GENERATION_RULE_UPDATED,
        updatedRule
      );
    } catch (error) {
      return errorResponse(response, error);
    }
  }
}
