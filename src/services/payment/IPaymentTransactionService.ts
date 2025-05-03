import { Orders } from "razorpay/dist/types/orders";
import { ICalculatePaymentResponse } from "../../types/payment";
import { IPaymentVerificationDetails } from "./PaymentTransactionService";

export interface IPaymentTransactionService {
    // createPaymentTransaction: (paymentTransaction: any) => Promise<any>;
    calculatePayment (candidatesCount:number): ICalculatePaymentResponse;
    createInterviewProcessPaymentOrder(amount:number):Promise<Orders.RazorpayOrder>
    interviewProcessPaymentVerificationAndCreatePaymentTransaction({ razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        jobId,
        companyId,
        candidatesCount}:IPaymentVerificationDetails):Promise<boolean>
}