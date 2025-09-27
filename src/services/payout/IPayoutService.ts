import { Types } from "mongoose";
import { IPayoutRequest } from "../../models/payout/PayoutRequest";

export interface IPayoutService {
  createPayoutRequest(payoutRequestPayload: {
    interviewerId: Types.ObjectId;
    amount: number;
    interviewerName: string;
  }): Promise<IPayoutRequest>;
  getAllInterviewersPayoutRequests(): Promise<IPayoutRequest[]>;
  updateInterviewerPayoutRequestStatus(
    payoutRequestId: string,
    status: string
  ): Promise<IPayoutRequest | null>;
}
