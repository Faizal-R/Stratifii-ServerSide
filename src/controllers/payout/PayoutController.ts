import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IPayoutController } from "./IPayoutController";
import { IPayoutService } from "../../services/payout/IPayoutService";
import { DI_TOKENS } from "../../di/types";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { IPayoutRequest } from "../../models/payout/PayoutRequest";

@injectable()
export class PayoutController implements IPayoutController {
  constructor(
    @inject(DI_TOKENS.SERVICES.PAYOUT_SERVICE)
    private readonly payoutService: IPayoutService
  ) {}
  async getAllInterviewersPayoutRequest(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const payoutRequest: IPayoutRequest[] =
        await this.payoutService.getAllInterviewersPayoutRequests();
      createResponse(
        response,
        HttpStatus.OK,
        true,
        "Payout requests fetched successfully",
        payoutRequest
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }

  async createPayoutRequest(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const interviewerId = request.user.userId;
      const { amount,interviewerName } = request.body;
      console.log(interviewerId, amount);
      const payoutRequest = await this.payoutService.createPayoutRequest({
        interviewerId,
        amount,
        interviewerName
      });
      createResponse(
        response,
        HttpStatus.OK,
        true,
        "Payout request created successfully",
        payoutRequest
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }

  async payoutInterviewer(request: Request, response: Response): Promise<void> {
    try {
      const data = request.body;
      //   const result = await this.payoutService.payoutInterviewer(data);
      //   response.status(200).json(result);
    } catch (error) {
      response.status(500).json({ error: "Failed to process payout" });
    }
  }
}
