import { ICompany } from "../../models/company/Company";
import { ICandidate } from "../../models/candidate/Candidate";
import {
  IGoogleInterviewer,
  IInterviewer,
} from "../../models/interviewer/Interviewer";
import { ISubscriptionRecord } from "../../models/subscription/SubscriptionRecord";
type IUser = ICompany | ICandidate | IInterviewer;
export interface IAuthService {
  login(
    email: string,
    password: string,
    role: string
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser ,subscriptionDetails?:ISubscriptionRecord|null}>;

  registerCompany(company: ICompany): Promise<ICompany>;

  sendVerificationCode(email: string): Promise<void>;

  registerInterviewer(interviewer: IInterviewer,resume?:Express.Multer.File): Promise<IInterviewer>;
  setupInterviewerAccount(
      interviewerId: string,
      interviewer: IInterviewer,
      resume: Express.Multer.File
    ): Promise<{ accessToken: string; refreshToken: string; setupedInterviewer: IInterviewer }>

  authenticateOTP(otp: string, email: string,role:string): Promise<void>;

  googleAuthentication(
    email: string,
    name: string
  ): Promise<{
    accessToken?: string;
    refreshToken?: string;
    user?: IGoogleInterviewer;
    isRegister?:boolean
  }>;

  requestPasswordReset(email: string, role: string): Promise<void>;

  resetUserPassword(
    password: string,
    confirmPassword: string,
    token: string,
  ): Promise<void>;

  refreshAccessToken(
    userId: string,
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }>;

  
}
