import { CompanyResponseDTO } from "../../dto/response/company/CompanyResponseDTO";
import { ICompany } from "../../models/company/Company";
import { ICompanyProfile } from "../../validations/CompanyValidations";
export interface ICompanyService {
  getCompanyProfile(companyId: string): Promise<CompanyResponseDTO | null>;
  updateCompanyProfile(
    companyId: string,
    company: ICompanyProfile,
    companyLogoFile?: Express.Multer.File
  ): Promise<CompanyResponseDTO | null>;
  changePassword(currentPassword: string, newPassword: string, companyId: string): Promise<ICompany | null>;
  getCompanyDashboard(companyId: string): Promise<any>;
}


