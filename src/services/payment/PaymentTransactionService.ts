import { Orders } from "razorpay/dist/types/orders";
import { PaymentConfig } from "../../constants/AppConfig";
import { IPaymentTransactionRepository } from "../../repositories/payment/IPaymentTransactionRepository";
import { ICalculatePaymentResponse } from "../../types/payment";
import { IPaymentTransactionService } from "./IPaymentTransactionService";
import { razorpay as RazorPay } from "../../config/razorpay";
import { CustomError } from "../../error/CustomError";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import { INTERVIEWER__SUCCESS_MESSAGES } from "../../constants/messages/UserProfileMessages";
import { PAYMENT_MESSAGES } from "../../constants/messages/PaymentAndSubscriptionMessages";
import { HttpStatus } from "../../config/HttpStatusCodes";
import crypto from "crypto";
import { Types } from "mongoose";
import { IJobRepository } from "../../repositories/job/IJobRepository";
import { JobRepository } from "../../repositories/job/JobRepository";
import { sendCreatePasswordEmail } from "../../helper/sendCreatePasswordEmail";
import { IDelegatedCandidateRepository } from "../../repositories/candidate/candidateDelegation/IDelegatedCandidateRepository";
import { ICandidateRepository } from "../../repositories/candidate/ICandidateRepository";
import { ICompanyRepository } from "../../repositories/company/ICompanyRepository";
import { inject, injectable } from "inversify";
import { DiRepositories } from "../../di/types";

export interface IPaymentVerificationDetails {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  jobId: Types.ObjectId;
  companyId: Types.ObjectId;
  candidatesCount: number;
}
@injectable()
export class PaymentTransactionService implements IPaymentTransactionService {
constructor(
  @inject(DiRepositories.PaymentTransactionRepository)
  private readonly _paymentTransactionRepository: IPaymentTransactionRepository,

  @inject(DiRepositories.JobRepository)
  private readonly _jobRepository: IJobRepository,

  @inject(DiRepositories.DelegatedCandidateRepository)
  private readonly _delegatedCandidateRepository: IDelegatedCandidateRepository,

  @inject(DiRepositories.CandidateRepository)
  private readonly _candidateRepository: ICandidateRepository,

  @inject(DiRepositories.CompanyRepository)
  private readonly _companyRepository: ICompanyRepository
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
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new CustomError(
        PAYMENT_MESSAGES.PAYMENT_VERIFICATION_FAILED,
        HttpStatus.BAD_REQUEST
      );
    }

    // Create Payment Transaction Record
    const calculatedPaymentSummary = this.calculatePayment(candidatesCount);
    const paymentTransaction = await this._paymentTransactionRepository.create({
      jobId,
      companyId,
      ...calculatedPaymentSummary,
      status: "PAID",
      paymentGatewayTransactionId: razorpay_payment_id,
    });

    // Update Job Status
    await this._jobRepository.update(String(jobId), {
      status: "in-progress",
    });

    //  Fetch candidates from DelegatedCandidate collection
    const delegatedCandidates = await this._delegatedCandidateRepository.findAll({
      job:jobId
    });
    console.log("Delegated Candidates", delegatedCandidates);

    //  Extract Candidate IDs who need onboarding
    const candidateIds = delegatedCandidates.map((dc) => dc.candidate);
    console.log("Candidate IDs to onboard", candidateIds);

    const candidates = await this._candidateRepository.findAll({
      _id: { $in: candidateIds },
    });

    //  Filter only those who have no password (i.e., not onboarded yet)
    const candidatesToOnboard = candidates.filter((c) => !c.password);
   console.log("Candidates to onboard", candidatesToOnboard);
    const company = await this._companyRepository.findById(String(companyId));
    console.log("Company", company);
    //  Send onboarding emails
    await sendCreatePasswordEmail(candidatesToOnboard, company?.companyName!);

    return true;
  }
}
