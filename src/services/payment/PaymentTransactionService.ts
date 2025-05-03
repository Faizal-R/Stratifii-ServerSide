import { Orders } from "razorpay/dist/types/orders";
import { PaymentConfig } from "../../constants/AppConfig";
import { IPaymentTransactionRepository } from "../../repositories/payment/IPaymentTransaction";
import { ICalculatePaymentResponse } from "../../types/payment";
import { IPaymentTransactionService } from "./IPaymentTransactionService";
import { razorpay as RazorPay } from "../../config/razorpay";
import { CustomError } from "../../error/CustomError";
import {
  ERROR_MESSAGES,
  
} from "../../constants/messages/ErrorMessages";
import {INTERVIEWER__SUCCESS_MESSAGES} from "../../constants/messages/UserProfileMessages";
import { PAYMENT_SUCCESS_MESSAGES } from "../../constants/messages/PaymentAndSubscriptionMessages";
import { HttpStatus } from "../../config/HttpStatusCodes";
import crypto from "crypto";
import { Types } from "mongoose";
import { IJobRepository } from "../../repositories/job/IJobRepository";
import { JobRepository } from "../../repositories/job/JobRepository";
import { sendCreatePasswordEmail } from "../../helper/sendCreatePasswordEmail";

export interface IPaymentVerificationDetails {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  jobId: Types.ObjectId;
  companyId: Types.ObjectId;
  candidatesCount: number;
}
export class PaymentTransactionService implements IPaymentTransactionService {
  constructor(
    private readonly _paymentTransactionRepository: IPaymentTransactionRepository,
    private readonly _jobRepository: IJobRepository
  ) {}
  calculatePayment(candidatesCount: number): ICalculatePaymentResponse {
    const pricePerInterview = PaymentConfig.RATE_PER_CANDIDATE;
    const subTotal = candidatesCount * pricePerInterview;
    const platformFeeAmount = PaymentConfig.PLATFORM_FEE;
    const taxAmount = (subTotal + platformFeeAmount) * PaymentConfig.GST_RATE;
    const finalPayableAmount = subTotal + platformFeeAmount + taxAmount;

    return {
      pricePerInterview,
      candidatesCount,
      totalAmount: subTotal,
      platformFee: platformFeeAmount,
      taxAmount,
      finalPayableAmount,
    };
  }

  async createInterviewProcessPaymentOrder(
    amount: number
  ): Promise<Orders.RazorpayOrder> {
    try {
      const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
      };
      const order = await RazorPay.orders.create(options);
      return order;
    } catch (error) {
      console.log(error);
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async interviewProcessPaymentVerificationAndCreatePaymentTransaction({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    jobId,
    companyId,
    candidatesCount,
  }: IPaymentVerificationDetails): Promise<boolean> {
    console.log(candidatesCount);
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!)
      .update(body.toString())
      .digest("hex");
    if (expectedSignature === razorpay_signature) {
      const calculatedPaymentSummary = this.calculatePayment(candidatesCount);
      const paymentTransaction =
        await this._paymentTransactionRepository.create({
          jobId,
          companyId,
          ...calculatedPaymentSummary,
          status: "PAID",
          paymentGatewayTransactionId: razorpay_payment_id,
        });
      console.log(paymentTransaction);
       await this._jobRepository.update(String(jobId),{
            status:"in-progress"
       });
        const candidates=await this._jobRepository.getCandidatesByJobId(String(jobId));
         console.log(candidates)
        await sendCreatePasswordEmail(candidates.map((candidate) => candidate.candidate));
        return true
        
    }
    throw new CustomError(
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
    
  }
}
