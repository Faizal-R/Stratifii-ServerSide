import { ISubscriptionPlan } from "../../../models/subscription/SubscriptionPlan";

export interface ISubscriptionPlanService {
    createSubscription(subscription: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan>;
    getAllSubscriptions(): Promise<ISubscriptionPlan[]>;
    updateSubscription(subscriptionId: string, updateData: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan | null>;
    deleteSubscription(subscriptionId: string): Promise<boolean>;
}
