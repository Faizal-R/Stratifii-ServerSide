import { Orders } from "razorpay/dist/types/orders";
import { PaymentConfig } from "../../constants/enums/AppConfig";
import { IPaymentTransactionRepository } from "../../repositories/payment/IPaymentTransactionRepository";
import { ICalculatePaymentResponse } from "../../types/payment";
import { IPaymentTransactionService } from "./IPaymentTransactionService";
import { razorpay as RazorPay } from "../../config/razorpay";
import { CustomError } from "../../error/CustomError";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import { PAYMENT_MESSAGES } from "../../constants/messages/PaymentAndSubscriptionMessages";
import { HttpStatus } from "../../config/HttpStatusCodes";
import crypto from "crypto";
import { Types } from "mongoose";
import { IJobRepository } from "../../repositories/job/IJobRepository";

import { sendCreatePasswordEmail } from "../../helper/sendCreatePasswordEmail";
import { IDelegatedCandidateRepository } from "../../repositories/candidate/candidateDelegation/IDelegatedCandidateRepository";
import { ICandidateRepository } from "../../repositories/candidate/ICandidateRepository";
import { ICompanyRepository } from "../../repositories/company/ICompanyRepository";
import { inject, injectable } from "inversify";
import { DI_TOKENS } from "../../di/types";

export interface IPaymentVerificationDetails {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  jobId: Types.ObjectId;
  companyId: Types.ObjectId;
  candidatesCount: number;
  isPaymentFailed: boolean;
}
@injectable()
export class PaymentTransactionService implements IPaymentTransactionService {
  constructor(
    @inject(DI_TOKENS.REPOSITORIES.PAYMENT_TRANSACTION_REPOSITORY)
    private readonly _paymentTransactionRepository: IPaymentTransactionRepository,

    @inject(DI_TOKENS.REPOSITORIES.JOB_REPOSITORY)
    private readonly _jobRepository: IJobRepository,

    @inject(DI_TOKENS.REPOSITORIES.DELEGATED_CANDIDATE_REPOSITORY)
    private readonly _delegatedCandidateRepository: IDelegatedCandidateRepository,

    @inject(DI_TOKENS.REPOSITORIES.CANDIDATE_REPOSITORY)
    private readonly _candidateRepository: ICandidateRepository,

    @inject(DI_TOKENS.REPOSITORIES.COMPANY_REPOSITORY)
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
    isPaymentFailed,
  }: IPaymentVerificationDetails): Promise<boolean> {
    const existingJob = await this._paymentTransactionRepository.findOne({
      job: jobId,
    });
    if (existingJob) {
      throw new CustomError(
        PAYMENT_MESSAGES.ALREADY_PAYMENT_VERIFIED_AND_INTERVIEW_PROCESS_STARTED,
        HttpStatus.BAD_REQUEST
      );
    }
    if (!isPaymentFailed) {
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
    }

    // Create Payment Transaction Record
    const calculatedPaymentSummary = this.calculatePayment(candidatesCount);
    const paymentTransaction = await this._paymentTransactionRepository.create({
      job: jobId,
      company: companyId,
      ...calculatedPaymentSummary,
      status: isPaymentFailed ? "FAILED" : "PAID",
      paymentGatewayTransactionId: razorpay_payment_id || undefined,
    });

    // Update Job Status
    await this._jobRepository.update(String(jobId), {
      status: isPaymentFailed ? "open" : "in-progress",
      paymentTransaction: paymentTransaction._id as Types.ObjectId,
    });

    if (!isPaymentFailed) {
      //  Fetch candidates from DelegatedCandidate collection
      const delegatedCandidates = await this._delegatedCandidateRepository.find(
        {
          job: jobId,
        }
      );

      await Promise.all(
        delegatedCandidates.map(async (dc) => {
          return await this._delegatedCandidateRepository.update(
            String(dc._id),
            {
              mockInterviewDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // +24h
            }
          );
        })
      );

      

      //  Extract Candidate IDs who need onboarding
      const candidateIds = delegatedCandidates.map((dc) => dc.candidate);
      

      const candidates = await this._candidateRepository.find({
        _id: { $in: candidateIds },
      });

      //  Filter only those who have no password (i.e., not onboarded yet)
      const candidatesToOnboard = candidates.filter(
        (c) => c.status !== "active"
      );

      const candidateAllReadyOnboarded = candidates.filter(
        (c) => c.status === "active"
      );

      

      const company = await this._companyRepository.findById(String(companyId));
      

      //  Send onboarding emails
      const companyName=company?.name || "Company";
      await sendCreatePasswordEmail(candidatesToOnboard, companyName);

      //todo: send mail to candidates who are already onboarded
    }

    return true;
  }

  async handleRetryInterviewProcessInitializationPayment(
    jobId: string
  ): Promise<void> {
    try {
      const existingJob = await this._paymentTransactionRepository.findOne({
        job: jobId,
      });
      if (!existingJob) {
        throw new CustomError(
          PAYMENT_MESSAGES.PAYMENT_VERIFICATION_FAILED,
          HttpStatus.BAD_REQUEST
        );
      }
      await this._paymentTransactionRepository.update(String(existingJob._id), {
        status: "PAID",
      });

      await this._jobRepository.update(jobId, {
        status: "in-progress",
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
