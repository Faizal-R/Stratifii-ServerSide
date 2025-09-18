import { CompanyResponseDTO } from "../../dto/response/company/CompanyResponseDTO";
import { IDelegatedCandidate } from "../../models/candidate/DelegatedCandidate";
import { ICompany } from "../../models/company/Company";
import { IJob } from "../../models/job/Job";
import { IPaymentTransaction } from "../../models/payment/PaymentTransaction";
import { ICompanyProfile } from "../../validations/CompanyValidations";
export interface ICompanyService {
  getCompanyProfile(companyId: string): Promise<CompanyResponseDTO | null>;
  updateCompanyProfile(
    companyId: string,
    company: ICompanyProfile,
    companyLogoFile?: Express.Multer.File
  ): Promise<CompanyResponseDTO | null>;
  changePassword(currentPassword: string, newPassword: string, companyId: string): Promise<ICompany | null>;
  getCompanyDashboard(companyId: string): Promise<{jobs:IJob[],candidates:IDelegatedCandidate[],payments:IPaymentTransaction[]}>
}


