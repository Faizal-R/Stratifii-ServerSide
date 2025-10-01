import { inject, injectable } from "inversify";
import { IPayoutService } from "./IPayoutService";
import { DI_TOKENS } from "../../di/types";
import { IPayoutRequestRepository } from "../../repositories/payout/payoutRequest/IPayoutRequestRepository";
import { IPayoutHistoryRepository } from "../../repositories/payout/payoutHistory/IPayoutHistoryRepository";
import { IPayoutRequest } from "../../models/payout/PayoutRequest";
import { Types } from "mongoose";
import { CustomError } from "../../error/CustomError";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { IWalletRepository } from "../../repositories/wallet/IWalletRepository";

@injectable()
export class PayoutService implements IPayoutService {
  constructor(
    @inject(DI_TOKENS.REPOSITORIES.PAYOUT_REQUEST_REPOSITORY)
    private readonly _payoutRequestRepository: IPayoutRequestRepository,
    @inject(DI_TOKENS.REPOSITORIES.PAYOUT_HISTORY_REPOSITORY)
    private readonly _payoutHistoryRepository: IPayoutHistoryRepository,
    @inject(DI_TOKENS.REPOSITORIES.WALLET_REPOSITORY)
    private readonly _walletRepository: IWalletRepository
  ) {}

  createPayoutRequest(payoutRequestPayload: {
    interviewerId: Types.ObjectId;
    amount: number;
    interviewerName: string;
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
      interviewerName,
    });
    return payoutRequest;
  }

  async getAllInterviewersPayoutRequests(): Promise<IPayoutRequest[]> {
    const payoutRequests = await this._payoutRequestRepository.find();
    return payoutRequests;
  }

  async updateInterviewerPayoutRequestStatus(
    payoutRequestId: string,
    status: string
  ): Promise<IPayoutRequest | null> {
    try {
      const updatedPayoutRequest = await this._payoutRequestRepository.update(
        payoutRequestId,
        {
          status,
          approvedAt: status === "approved" ? Date.now() : null,
        }
      );
      if (status === "completed") {
        await this._payoutHistoryRepository.create({
          interviewerId: updatedPayoutRequest?.interviewerId,
          amount: updatedPayoutRequest?.amount,
          payoutId: updatedPayoutRequest?._id as string,
          status: "succeeded",
          transferId: `trans_${Math.random() * 10000}`,
        });
        const userWallet = await this._walletRepository.findOne({
          userId: updatedPayoutRequest?.interviewerId,
          userType: "interviewer",
        });
        if (typeof updatedPayoutRequest?.amount !== "number") {
          throw new CustomError(
            "Payout amount is undefined",
            HttpStatus.BAD_REQUEST
          );
        }
        await this._walletRepository.update(userWallet?._id as string, {
          balance: (userWallet?.balance || 0) - updatedPayoutRequest.amount,
        });
      }
      return updatedPayoutRequest;
    } catch (error) {
      if(error instanceof CustomError) {
        throw error;
    }
      throw new CustomError(
        "Failed to update payout request status",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
  }
  }
}
