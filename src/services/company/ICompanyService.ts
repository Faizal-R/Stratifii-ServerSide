import {
  CompanyBasicDTO,
  CompanyResponseDTO,
} from "../../dto/response/company/CompanyResponseDTO";
import { PaymentTransactionBasicDTO } from "../../dto/response/payment/PaymentTransactionDTO";
import { IDelegatedCandidate } from "../../models/candidate/DelegatedCandidate";

import { IJob } from "../../models/job/Job";
import { IPaymentTransaction } from "../../models/payment/PaymentTransaction";
import { ISubscriptionRecord } from "../../models/subscription/SubscriptionRecord";
import { ICompanyProfile } from "../../validations/CompanyValidations";
export interface ICompanyService {
  getCompanyProfile(companyId: string): Promise<CompanyResponseDTO | null>;
  updateCompanyProfile(
    companyId: string,
    company: ICompanyProfile,
    companyLogoFile?: Express.Multer.File
  ): Promise<CompanyResponseDTO | null>;
  changePassword(
    currentPassword: string,
    newPassword: string,
    companyId: string
  ): Promise<CompanyBasicDTO | null>;
  getCompanyDashboard(companyId: string): Promise<{
    jobs: IJob[];
    candidates: IDelegatedCandidate[];
    payments: IPaymentTransaction[];
    monthlySpend: {
      month: string;
      subscription: number;
      interviews: number;
    }[];
  }>;
  getCompanyPaymentHistory(companyId: string): Promise<{
    subscriptionPayments: ISubscriptionRecord[];
    interviewProcessPayments: PaymentTransactionBasicDTO[];
    totalSpendOnInterview: number;
    totalSpendOnSubscription?: number;
  }>;
}
