import { IPaymentTransaction } from "../../models/payment/PaymentTransaction";
import { PaymentTransactionDTO,PaymentTransactionBasicDTO } from "../../dto/response/payment/PaymentTransactionDTO";

import { JobMapper } from "../job/JobMapper";

import { IJob } from "../../models/job/Job";
import { Types } from "mongoose";

export const PaymentMapper = {
  /**
   * Map payment transaction summary (basic info only)
   */
  toSummary: (payment: IPaymentTransaction): PaymentTransactionBasicDTO => ({
    _id: (payment._id as Types.ObjectId).toString(),
    job: JobMapper.toSummary(payment.job as IJob),
    totalAmount: payment.totalAmount,
    finalPayableAmount: payment.finalPayableAmount,
    status: payment.status,
    createdAt: payment.createdAt,
    pricePerInterview: payment.pricePerInterview,
    candidatesCount: payment.candidatesCount,
    taxAmount: payment.taxAmount,
    platformFee: payment.platformFee,
    paymentGatewayTransactionId: payment.paymentGatewayTransactionId,
  }),

  /**
   * Map full payment transaction response (with optional population)
   */
  toResponse: (
    payment: IPaymentTransaction,
    isPopulated: boolean = false
  ): PaymentTransactionDTO => ({
    _id: payment._id.toString(),
    company: payment.company.toString(),
    job: isPopulated ? JobMapper.toResponse(payment.job as IJob) : payment.job.toString(),
    candidatesCount: payment.candidatesCount,
    pricePerInterview: payment.pricePerInterview,
    totalAmount: payment.totalAmount,
    taxAmount: payment.taxAmount,
    platformFee: payment.platformFee,
    finalPayableAmount: payment.finalPayableAmount,
    status: payment.status,
    paymentGatewayTransactionId: payment.paymentGatewayTransactionId,
    createdAt: payment.createdAt,
  }),
};
