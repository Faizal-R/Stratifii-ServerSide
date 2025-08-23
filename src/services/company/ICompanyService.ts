import { ICompany } from "../../models/company/Company";
import { ICompanyProfile } from "../../validations/CompanyValidations";
export interface ICompanyService {
  getCompanyById(companyId: string): Promise<ICompany | null>;
  updateCompanyProfile(
    companyId: string,
    company: ICompanyProfile,
    companyLogoFile?: Express.Multer.File
  ): Promise<ICompany | null>;
  changePassword(currentPassword: string, newPassword: string, companyId: string): Promise<ICompany | null>;
  getCompanyDashboard(companyId: string): Promise<any>;
}


