import { IPaymentTransaction } from "../../models/payment/PaymentTransaction";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IPaymentTransactionRepository extends IBaseRepository<IPaymentTransaction>{
  getTotalRevenueFromInterview():Promise<number>
  getTotalRevenueFromInterviewWithMonth():Promise<[{_id: number; totalRevenue: number}]>
  getCompaniesTotalAmountSpendOnInterviewsPerMonth(companyId: string): Promise<{ _id: number; totalRevenue: number }[]>
  getPaymentTransactionsDetailsByCompanyId(companyId: string): Promise<IPaymentTransaction[]|[]>
  getTotalAmountSpendOnInterviewsByCompany(companyId: string): Promise<number>
} 