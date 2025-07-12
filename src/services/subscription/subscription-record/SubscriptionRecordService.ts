import { Orders } from "razorpay/dist/types/orders";
import { razorpay as RazorPay } from "../../../config/razorpay";
import { ISubscriptionRecordRepository } from "../../../repositories/subscription/subscription-record/ISubscriptionRecordRepository";
import { ISubscriptionRecordService } from "./ISubscriptionRecordService";
import { CustomError } from "../../../error/CustomError";
import { ERROR_MESSAGES } from "../../../constants/messages/ErrorMessages";
import { SUBSCRIPTION_ERROR_MESSAGES } from "../../../constants/messages/PaymentAndSubscriptionMessages";
import { HttpStatus } from "../../../config/HttpStatusCodes";
import { ISubscriptionPlan } from "../../../models/subscription/SubscriptionPlan";
import crypto from "crypto";
import mongoose, { Types } from "mongoose";
import { ICompanyRepository } from "../../../repositories/company/ICompanyRepository";
import { ISubscriptionRecord } from "../../../models/subscription/SubscriptionRecord";
import { inject, injectable } from "inversify";
import { DI_REPOSITORIES } from "../../../di/types";

injectable();
export class SubscriptionRecordService implements ISubscriptionRecordService {
  constructor(
    @inject(DI_REPOSITORIES.SUBSCRIPTION_RECORD_REPOSITORY)
    private readonly _subscriptionRepository: ISubscriptionRecordRepository,
    @inject(DI_REPOSITORIES.COMPANY_REPOSITORY)
    private readonly _companyRepository: ICompanyRepository
  ) {}
  async createPaymentOrder(amount: number): Promise<Orders.RazorpayOrder> {
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
        SUBSCRIPTION_ERROR_MESSAGES.SUBSCRIPTION_PAYMENT_FAILED,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async subscriptionPaymentVerification(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    subscriptionDetails: ISubscriptionPlan,
    companyId: mongoose.Types.ObjectId
  ): Promise<{
    isVerified: boolean;
    subscriptionRecord?: ISubscriptionRecord;
  }> {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!)
      .update(body.toString())
      .digest("hex");
    if (expectedSignature === razorpay_signature) {
      const subscriptionRecord = await this.createSubscriptionRecord(
        subscriptionDetails,
        companyId,
        razorpay_payment_id
      );
      if (subscriptionRecord) {
        return { isVerified: true, subscriptionRecord };
      } else {
        throw new CustomError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
    return { isVerified: false };
  }

  async createSubscriptionRecord(
    data: ISubscriptionPlan,
    subscriberId: string | mongoose.Types.ObjectId,
    transactionId: string
  ) {
    try {
      const validSubscriberId = new mongoose.Types.ObjectId(
        String(subscriberId)
      );
      const validPlanId = new mongoose.Types.ObjectId(String(data._id));
      const subscriptionRecordData = {
        subscriberId: validSubscriberId,
        planId: validPlanId,
        planDetails: {
          name: data.name as string,
          price: data.price,
          features: data.features,
        },
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        transactionId,
        status: "active" as "active",
      };
      const subscriptionRecord = await this._subscriptionRepository.create(
        subscriptionRecordData
      );
      console.log(data.features);
      this._companyRepository.update(subscriberId as string, {
        activePlan: subscriptionRecord._id as Types.ObjectId,
        usage: {
          jobPostsThisMonth: data.features.jobPostLimitPerMonth,
          candidatesAddedThisMonth: data.features.candidateSlotPerMonth,
        },
      });
      return subscriptionRecord;
    } catch (error) {
      console.log(error);
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  getSubscriptionRecordDetails(
    companyId: string
  ): Promise<ISubscriptionRecord | null> {
    return this._subscriptionRepository.getSubscriptionRecordDetailsByCompanyId(
      companyId
    );
  }
}
