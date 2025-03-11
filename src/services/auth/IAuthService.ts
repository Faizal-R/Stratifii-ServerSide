import { ICompany } from "../../models/company/Company";
import { ICandidate } from "../../models/candidate/Candidate";
import {
  IGoogleInterviewer,
  IInterviewer,
} from "../../models/interviewer/Interviewer";
type IUser = ICompany | ICandidate | IInterviewer;
export interface IAuthService {
  login(
    email: string,
    password: string,
    role: string
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser }>;

  registerCompany(company: ICompany): Promise<ICompany>;
  
  sendVerificationCode(email: string): Promise<void>;

  registerInterviewer(interviewer: IInterviewer): Promise<IInterviewer>;

  authenticateOTP(otp: string, email: string): Promise<void>;

  googleAuthentication(
    email: string,
    name: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IGoogleInterviewer;
  }>;
}
