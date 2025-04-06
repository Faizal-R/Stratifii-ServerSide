import { Request, Response } from "express";
import { ISubscriptionController } from "./ISubscriptonController";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import { ISubscriptionPlanService } from "../../services/subscription/subscription-plan/ISubscriptionPlanService";
import { SubscriptionPlanSchema } from "../../validations/SubscriptionValidation";
import { HttpStatus } from "../../config/HttpStatusCodes";
import {
  ERROR_MESSAGES,
  SUBSCRIPTION_SUCCESS_MESSAGES,
} from "../../constants/messages";
import { ISubscriptionRecordService } from "../../services/subscription/subscription-record/ISubscriptionRecordService";
import mongoose from "mongoose";

export class SubscriptionController implements ISubscriptionController {
  constructor(
    private readonly _subscriptionService?: ISubscriptionPlanService,
    private readonly _subscriptionRecordService?: ISubscriptionRecordService
  ) {}

  async createSubscription(
    request: Request,
    response: Response
  ): Promise<void> {
    const { name, price, features } = request.body;
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
    const { updatedSubscription } = request.body;

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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature,subscriptionId } =
      request.body;
     console.log(request.body)
     const companyId = new mongoose.Types.ObjectId(String(request.user?.userId));

    try {
       const subscriptionDetails=await this._subscriptionService?.getSubscriptionById(subscriptionId)
       console.log(subscriptionDetails)
      const isVerifiedAndCreatedSubscriptionRecord =
        await this._subscriptionRecordService?.subscriptionPaymentVerification(
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          subscriptionDetails!,
          companyId
          
        );
      if (isVerifiedAndCreatedSubscriptionRecord) {
        createResponse(
          response,
          HttpStatus.OK,
          true,
          SUBSCRIPTION_SUCCESS_MESSAGES.SUBSCRIPTION_SUBSCRIBED
        );
      }
    } catch (error) {
      errorResponse(response, error);
    }
  }

  getSubscriptionRecord(request: Request, response: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
