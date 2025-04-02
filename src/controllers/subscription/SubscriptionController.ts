import { Request, Response } from "express";
import { ISubscriptionController } from "./ISubscriptonController";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import { ISubscriptionPlanService } from "../../services/subscription/subscription-plan/ISubscriptionPlanService";
import { SubscriptionPlanSchema } from "../../validations/SubscriptionValidation";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { ERROR_MESSAGES } from "../../constants/messages";

export class SubscriptionController implements ISubscriptionController {
  constructor(
    private readonly _subscriptionService: ISubscriptionPlanService
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
        await this._subscriptionService.createSubscription({
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
        await this._subscriptionService.getAllSubscriptions();
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
      await this._subscriptionService.updateSubscription(
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
}
