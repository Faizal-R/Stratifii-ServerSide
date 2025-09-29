import { ISubscriptionRecord } from "../../../models/subscription/SubscriptionRecord";
import { IBaseRepository } from "../../base/IBaseRepository";

export interface ISubscriptionRecordRepository
  extends IBaseRepository<ISubscriptionRecord> {
      getSubscriptionRecordDetailsByCompanyId(companyId: string): Promise<ISubscriptionRecord | null>
       getTotalSubscriptionRevenueWithMonth():Promise<{_id: number; totalRevenue: number}[]>
       getSubscriptionDistribution():Promise<{name: string; value: number}[]>
  }
