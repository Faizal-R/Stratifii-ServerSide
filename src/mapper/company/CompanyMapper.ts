// company.profile.ts
import { CompanyBasicDTO, CompanyResponseDTO } from "../../dto/response/company/CompanyResponseDTO";
import { generateSignedUrl } from "../../helper/s3Helper";
import { ICompany } from "../../models/company/Company";

export const CompanyMapper = {
  toResponse: (
    company: ICompany,
    companyLogoUrl: string|null=null
  ): CompanyResponseDTO => ({
    _id: company._id?.toString(),
    name: company.name,
    email: company.email,
    phone: company.phone,
    description: company.description,
    registrationCertificateNumber: company.registrationCertificateNumber,
    status: company.status,
    companyWebsite: company.companyWebsite,
    numberOfEmployees: company.numberOfEmployees,
    linkedInProfile: company.linkedInProfile,
    headquartersLocation: company.headquartersLocation,
    companySize: company.companySize,
    companyLogo: companyLogoUrl||null,
  }),

  toSummary: (company: ICompany, companyLogoUrl: string|null=null):CompanyBasicDTO => ({
    _id: company._id?.toString(),
    name: company.name,
    email: company.email,
    phone: company.phone,
    companyLogo: companyLogoUrl||null,
    status:company.status
  }),
};
