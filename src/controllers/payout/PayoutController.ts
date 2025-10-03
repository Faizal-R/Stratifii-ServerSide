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
    private readonly _payoutService: IPayoutService
  ) {}
  async getAllInterviewersPayoutRequest(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const payoutRequest: IPayoutRequest[] =
        await this._payoutService.getAllInterviewersPayoutRequests();
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
      const { amount, interviewerName } = request.body;
      
      const payoutRequest = await this._payoutService.createPayoutRequest({
        interviewerId,
        amount,
        interviewerName,
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

  async updateInterviewersPayoutRequestStatus(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const payoutRequestId = request.params.payoutRequestId;
      
      const { status } = request.body;
      

      const updatedPayoutRequest =
        await this._payoutService.updateInterviewerPayoutRequestStatus(
          payoutRequestId,
          status
        );
      
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        status === "approved"
          ? "Payout request approved successfully"
          : status === "completed"
          ? "Payout request completed successfully And Amount Transferred"
          : "Payout request updated successfully",
        updatedPayoutRequest
      );
    } catch (error) {
      return errorResponse(response, error);
    }
  }
}
