export interface CompanyResponseDTO {
  _id: string;
  name: string;
  email: string;
  description?: string;
  registrationCertificateNumber: string;
  status: string;
  companyWebsite: string;
  numberOfEmployees?: string;
  linkedInProfile: string;
  headquartersLocation?: string;
  companySize?: string;
  companyLogo?: string;
  phone: string;
}

