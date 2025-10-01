import { Request, Response } from "express";
import { ISubscriptionController } from "./ISubscriptonController";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import { ISubscriptionPlanService } from "../../services/subscription/subscription-plan/ISubscriptionPlanService";
import { SubscriptionPlanSchema } from "../../validations/SubscriptionValidation";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import { SUBSCRIPTION_SUCCESS_MESSAGES } from "../../constants/messages/PaymentAndSubscriptionMessages";

import { ISubscriptionRecordService } from "../../services/subscription/subscription-record/ISubscriptionRecordService";
import mongoose from "mongoose";
import { ISubscriptionRecord } from "../../models/subscription/SubscriptionRecord";
import { inject, injectable } from "inversify";
import { DI_TOKENS } from "../../di/types";

@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
  @inject(DI_TOKENS.SERVICES.SUBSCRIPTION_PLAN_SERVICE)
private readonly _subscriptionService?: ISubscriptionPlanService,

@inject(DI_TOKENS.SERVICES.SUBSCRIPTION_RECORD_SERVICE)
private readonly _subscriptionRecordService?: ISubscriptionRecordService

  ) {}

  async createSubscription(
    request: Request,
    response: Response
  ): Promise<void> {
    const { name, price, features } = request.body;
    console.log(request.body);
    const validatedSubscriptionPlan = SubscriptionPlanSchema.safeParse(
      request.body
    );
    if (!validatedSubscriptionPlan.success) {
      return createResponse(
        response,
        HttpStatus.BAD_REQUEST,
        false,
        ERROR_MESSAGES.INVALID_INPUT,
        validatedSubscriptionPlan.error
      );
    }

    try {
      const createdSubscription =
        await this._subscriptionService?.createSubscription({
          name,
          price,
          features,
        });
      createResponse(
        response,
        HttpStatus.OK,
        true,
        "Successfully created subscription plan",
        createdSubscription
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
  async getAllSubscriptions(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const subscriptions =
        await this._subscriptionService?.getAllSubscriptions();
      createResponse(
        response,
        HttpStatus.OK,
        true,
        "Successfully fetched subscription plans",
        subscriptions
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
  async updateSubscription(
    request: Request,
    response: Response
  ): Promise<void> {
    const subscriptionId = request.params.subscriptionId;
    console.log(subscriptionId);
    const { updatedSubscription } = request.body;
    console.log(request.body);

    try {
      await this._subscriptionService?.updateSubscription(
        subscriptionId,
        updatedSubscription
      );
      createResponse(
        response,
        HttpStatus.OK,
        true,
        "Successfully updated subscription plan"
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
  async createPaymentOrder(
    request: Request,
    response: Response
  ): Promise<void> {
    const { amount } = request.body;
    try {
      const paymentOrder =
        await this._subscriptionRecordService?.createPaymentOrder(amount);
      createResponse(
        response,
        HttpStatus.OK,
        true,
        SUBSCRIPTION_SUCCESS_MESSAGES.SUBSCRIPTION_PAYMENT_ORDER_SUCCESS,
        paymentOrder
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
  async subscriptionPaymentVerificationAndCreateSubscriptionRecord(
    request: Request,
    response: Response
  ): Promise<void> {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      subscriptionId,
    } = request.body;
    console.log(request.body);
    const companyId = new mongoose.Types.ObjectId(String(request.user?.userId));

    try {
      const subscriptionDetails =
        await this._subscriptionService?.getSubscriptionById(subscriptionId);
      console.log(subscriptionDetails);
      const { isVerified, subscriptionRecord } =
        (await this._subscriptionRecordService?.subscriptionPaymentVerification(
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          subscriptionDetails!,
          companyId
        )) as { isVerified: boolean; subscriptionRecord: ISubscriptionRecord };
      if (isVerified) {
        createResponse(
          response,
          HttpStatus.OK,
          true,
          SUBSCRIPTION_SUCCESS_MESSAGES.SUBSCRIPTION_SUBSCRIBED,
          subscriptionRecord
        );
      }
    } catch (error) {
      errorResponse(response, error);
    }
  }



 async  getSubscriptionPlanDetails(request:Request,response:Response):Promise<void>{
    // const subscriptionId = request.body.comp;
    const companyId=  request.user?.userId;
    console.log(companyId,request.user)
    try {
      const subscriptionPlanDetails =
        await this._subscriptionRecordService?.getSubscriptionRecordDetails(companyId!);
      if (!subscriptionPlanDetails) {
        return createResponse(
          response,
          HttpStatus.NOT_FOUND,
          false,
          "Subscription plan not found",
          // ERROR_MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND
        );
      }
      createResponse(
        response,
        HttpStatus.OK,
        true,
        "Successfully fetched subscription plan details",
        subscriptionPlanDetails
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
}
