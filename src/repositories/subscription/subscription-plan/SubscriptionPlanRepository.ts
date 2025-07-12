import { ISubscriptionPlan } from "../../../models/subscription/SubscriptionPlan";
import { SubscriptionPlan } from "../../../models/index";
import { BaseRepository } from "../../base/BaseRepository";
import { ISubscriptionPlanRepository } from "./ISubscriptionPlanRepository";
import { injectable } from "inversify";
@injectable()
export class SubscriptionPlanRepository
  extends BaseRepository<ISubscriptionPlan>
  implements ISubscriptionPlanRepository
{
  constructor() {
    super(SubscriptionPlan);
  }

  
}
