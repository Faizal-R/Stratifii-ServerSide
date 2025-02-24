import { ICompany } from "../../interfaces/ICompanyModel";
export interface ICompanyService {
  login(email: string, password: string):  Promise<{
    accessToken: string;
    refreshToken: string;
    user: ICompany;
  }>;
  register(
    companyName: string,
    email: string,
    companyWebsite: string,
    registrationCertificateNumber: string,
    linkedInProfile: string,
    phone: string,
    password: string,
    companyType: string
  ):Promise<ICompany>
}
