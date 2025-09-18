import { PaymentTransaction } from "../../models/payment/PaymentTransaction";
import { BaseRepository } from "../base/BaseRepository";
import { IPaymentTransaction } from "../../models/payment/PaymentTransaction";
import { IPaymentTransactionRepository } from "./IPaymentTransactionRepository";
import { injectable } from "inversify";
import { PaymentConfig } from "../../constants/enums/AppConfig";
@injectable()
export class PaymentTransactionRepository
  extends BaseRepository<IPaymentTransaction>
  implements IPaymentTransactionRepository
{
  constructor() {
    super(PaymentTransaction);
  }
 
async getTotalRevenueFromInterview(): Promise<number> {
  const result = await this.model.aggregate([
    { $match: { status: "PAID" } },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: {
            $subtract: [
              "$finalPayableAmount",
              { $multiply: ["$candidatesCount", PaymentConfig.PLATFORM_COMMISSION_PER_CANDIDATE] }
            ]
          }
        }
      }
    }
  ]);
  console.log(result)
  return result[0]?.totalRevenue || 0;
}
 async getTotalRevenueFromInterviewWithMonth(): Promise<[{ _id: number; totalRevenue: number; }]> {
  const result=await  this.model.aggregate([
    { $match: { status: "PAID" } },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalRevenue: {
          $sum: {
            $subtract: [
              "$finalPayableAmount",
              { $multiply: ["$candidatesCount", PaymentConfig.PLATFORM_COMMISSION_PER_CANDIDATE] }
            ]
          }
        }
      }
    }
  ]);
  return result as [{ _id: number; totalRevenue: number; }]
 }
}
