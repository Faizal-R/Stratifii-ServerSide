import { inject } from "inversify";
import { DiServices } from "../../di/types";
import { IInterviewSlot } from "../../models/slot/interviewSlot";
import { ISlotService } from "../../services/slot/ISlotService";
import { ISlotController } from "./ISlotController";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import { Request, Response } from "express";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { IInterview } from "../../models/interview/Interview";

export class SlotController implements ISlotController {
  constructor(
    @inject(DiServices.SlotService) private readonly _slotService: ISlotService
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
}
