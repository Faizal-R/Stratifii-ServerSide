import { Types } from "mongoose"
import { IPayoutRequest } from "../../models/payout/PayoutRequest"

export interface IPayoutService {
    createPayoutRequest(payoutRequestPayload: {
        interviewerId: Types.ObjectId,
        amount: number,
        interviewerName:string
    }): Promise<IPayoutRequest>
    payoutInterviewer (data: any):Promise<any>
    getAllInterviewersPayoutRequests(): Promise<IPayoutRequest[]>
}

