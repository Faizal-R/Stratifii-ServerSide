import { ObjectId,Document } from "mongoose";

export interface ICompany extends Document {
  companyName: string;
  email: string;
  companyWebsite: string;
  registrationCertificateNumber?: string;
  linkedInProfile?: string;
  phone: string;
  password: string;
  companyType: string;
  candidates?: ObjectId[];
  isVerified?: boolean;
}
