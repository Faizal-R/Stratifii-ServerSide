import { CompanyResponseDTO } from "../../dto/response/company/CompanyResponseDTO";  // adjust path
import { ICompany } from "../../models/company/Company";

export const mapToCompanyResponseDTO = (company: ICompany): CompanyResponseDTO => {
  return {
    _id: company._id?.toString(),
    name: company.name,
    email: company.email,
    phone:company.phone,
    description: company.description,
    registrationCertificateNumber: company.registrationCertificateNumber,
    status: company.status,
    companyWebsite: company.companyWebsite,
    numberOfEmployees: company.numberOfEmployees,
    linkedInProfile: company.linkedInProfile,
    headquartersLocation: company.headquartersLocation,
    companySize: company.companySize,
    companyLogo: company.companyLogo,
  };
};
