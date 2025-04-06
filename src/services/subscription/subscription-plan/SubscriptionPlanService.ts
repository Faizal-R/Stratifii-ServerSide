import { HttpStatus } from "../../../config/HttpStatusCodes";
import { ERROR_MESSAGES } from "../../../constants/messages";
import { CustomError } from "../../../error/CustomError";
import { ISubscriptionPlan } from "../../../models/subscription/SubscriptionPlan";
import { ISubscriptionPlanRepository } from "../../../repositories/subscription/subscription-plan/ISubscriptionPlanRepository";
import { ISubscriptionPlanService } from "./ISubscriptionPlanService";

export class SubscriptionPlanService implements ISubscriptionPlanService {
  constructor(
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository
  ) {}

  async createSubscription(
    subscription: ISubscriptionPlan
  ): Promise<ISubscriptionPlan> {
    try {
      return await this._subscriptionPlanRepository.create({
        ...subscription,
        isActive: true,
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllSubscriptions(): Promise<ISubscriptionPlan[]> {
    try {
      return await this._subscriptionPlanRepository.findAll();
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateSubscription(
    subscriptionId: string,
    updateData: Partial<ISubscriptionPlan>
  ): Promise<ISubscriptionPlan | null> {
    try {
      const updatedSubscription = await this._subscriptionPlanRepository.update(
        subscriptionId,
        updateData
      );
      if (!updatedSubscription) {
        throw new CustomError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      return updatedSubscription;
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getSubscriptionById(
    subscriptionId: string
  ): Promise<ISubscriptionPlan | null> {
    try {
      const subscription = await this._subscriptionPlanRepository.findById(
        subscriptionId
      );
      if (!subscription) {
        throw new CustomError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      return subscription;
    } catch (error) {
      console.error("Error finding subscription by ID:", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
