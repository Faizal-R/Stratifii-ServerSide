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
  companyLogo: string|null;
  phone: string;
}


 
export interface CompanyBasicDTO  {
  _id: string;
  name: string;
  email: string;
  phone: string;
  companyLogo: string|null; 
  status:string;
}
