import { injectable } from "inversify";
import SubscriptionRecord, {
  ISubscriptionRecord,
} from "../../../models/subscription/SubscriptionRecord";

import { BaseRepository } from "../../base/BaseRepository";
import { ISubscriptionRecordRepository } from "./ISubscriptionRecordRepository";
import { Types } from "mongoose";
@injectable()
export class SubscriptionRecordRepository
  extends BaseRepository<ISubscriptionRecord>
  implements ISubscriptionRecordRepository
{
  constructor() {
    super(SubscriptionRecord);
  }
  async getSubscriptionRecordDetailsByCompanyId(
    companyId: string
  ): Promise<ISubscriptionRecord | null> {
    return await this.model.findOne({ subscriberId: companyId });
  }
  async getTotalSubscriptionRevenueWithMonth(): Promise<
    { _id: number; totalRevenue: number }[]
  > {
    return await this.model.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$planDetails.price" },
        },
      },
    ]);
  }
  async getTotalSubscriptionRevenueOfCompanyWithMonth(companyId:string): Promise<
    { _id: number; totalRevenue: number }[]
  > {
    return await this.model.aggregate([
      {
        $match: { subscriberId: new Types.ObjectId(companyId) },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$planDetails.price" },
        },
      },
    ]);
  }

  async getSubscriptionDistribution(): Promise<
    { name: string; value: number }[]
  > {
    return await this.model.aggregate([
      {
        $group: {
          _id: "$planDetails.name",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: "$count",
        },
      },
    ]);
  }
}
