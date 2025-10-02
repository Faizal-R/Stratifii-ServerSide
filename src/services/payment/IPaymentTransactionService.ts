import { Orders } from "razorpay/dist/types/orders";
import { ICalculatePaymentResponse } from "../../types/payment";
import { IPaymentVerificationDetails } from "./PaymentTransactionService";

export interface IPaymentTransactionService {
  calculatePayment(candidatesCount: number): ICalculatePaymentResponse;
  createInterviewProcessPaymentOrder(
    amount: number
  ): Promise<Orders.RazorpayOrder>;
  interviewProcessPaymentVerificationAndCreatePaymentTransaction({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    jobId,
    companyId,
    candidatesCount,
    isPaymentFailed
  }: IPaymentVerificationDetails): Promise<boolean>;


  handleRetryInterviewProcessInitializationPayment(jobId: string): Promise<void>;
}
