import { Orders } from "razorpay/dist/types/orders";
import { ISubscriptionPlan } from "../../../models/subscription/SubscriptionPlan";
import mongoose from "mongoose";
import { ISubscriptionRecord } from "../../../models/subscription/SubscriptionRecord";

export interface ISubscriptionRecordService {
  createPaymentOrder(amount: number): Promise<Orders.RazorpayOrder>;
  subscriptionPaymentVerification(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    subscriptionDetails:ISubscriptionPlan,
    companyId: mongoose.Types.ObjectId

  ): Promise<{isVerified:boolean,subscriptionRecord?:ISubscriptionRecord}>;
  getSubscriptionRecordDetails(subscriptionId: string): Promise<ISubscriptionRecord | null>;
}
