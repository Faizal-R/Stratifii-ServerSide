import { ICompany } from "../../models/company/Company";
import { ICompanyProfile } from "../../validations/CompanyValidations";
export interface ICompanyService  {
  getCompanyById(companyId: string): Promise<ICompany | null>;
  updateCompanyProfile(companyId:string,company: ICompanyProfile): Promise<ICompany|null>;
}
