import { inject, injectable } from "inversify";
import { IPayoutService } from "./IPayoutService";
import { DI_TOKENS } from "../../di/types";
import { IPayoutRequestRepository } from "../../repositories/payout/payoutRequest/IPayoutRequestRepository";
import { IPayoutHistoryRepository } from "../../repositories/payout/payoutHistory/IPayoutHistoryRepository";
import { IPayoutRequest } from "../../models/payout/PayoutRequest";
import { Types } from "mongoose";
import { CustomError } from "../../error/CustomError";
import { HttpStatus } from "../../config/HttpStatusCodes";

@injectable()
export class PayoutService implements IPayoutService {
  constructor(
    @inject(DI_TOKENS.REPOSITORIES.PAYOUT_REQUEST_REPOSITORY)
    private readonly _payoutRequestRepository: IPayoutRequestRepository,
    @inject(DI_TOKENS.REPOSITORIES.PAYOUT_HISTORY_REPOSITORY)
    private readonly _payoutHistoryRepository: IPayoutHistoryRepository
  ) {}

  createPayoutRequest(payoutRequestPayload: {
    interviewerId: Types.ObjectId;
    amount: number;
    interviewerName:string
  }): Promise<IPayoutRequest> {
    const { interviewerId, amount, interviewerName } = payoutRequestPayload;
    if (!interviewerId)
      throw new CustomError(
        "interviewerId is required",
        HttpStatus.BAD_REQUEST
      );
    if (!amount || amount <= 0)
      throw new CustomError(
        "amount should not be empty and should be greater than 0",
        HttpStatus.BAD_REQUEST
      );
    const payoutRequest = this._payoutRequestRepository.create({
      interviewerId,
      amount,
      interviewerName
    }); 
    return payoutRequest;
  }

  getAllInterviewersPayoutRequests(): Promise<IPayoutRequest[]> {
    try {
      const payoutRequests = this._payoutRequestRepository.find();
      return payoutRequests;
    } catch (error) { 
      throw error;
    }
  }

  payoutInterviewer(data: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
