import { ICompany } from "../../models/company/Company";

import {
  IGoogleInterviewer,
  IInterviewer,
} from "../../models/interviewer/Interviewer";

import { LoginRequestDTO } from "../../dto/request/auth/LoginRequestDTO";
import {
  AuthLoginResponseDTO,
  AuthUserResponseDTO,
} from "../../dto/response/auth/AuthResponseDTO";
import { companyRegisterRequestDTO, InterviewerRegisterRequestDTO } from "../../dto/request/auth/RegisterRequestDTO";

export interface IAuthService {
  login(AuthPayload: LoginRequestDTO): Promise<AuthLoginResponseDTO>;

  registerCompany(company:companyRegisterRequestDTO): Promise<AuthUserResponseDTO>;

  sendVerificationCode(email: string): Promise<void>;

  registerInterviewer(
    interviewer: InterviewerRegisterRequestDTO,
    resume?: Express.Multer.File
  ): Promise<AuthUserResponseDTO>;
  setupInterviewerAccount(
    interviewerId: string,
    interviewer: IInterviewer,
    resume: Express.Multer.File
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    setupedInterviewer: IInterviewer;
  }>;

  authenticateOTP(otp: string, email: string, role: string): Promise<void>;

  googleAuthentication(
    email: string,
    name: string,
    avatar:string
  ): Promise<{
    accessToken?: string;
    refreshToken?: string;
    user?: IGoogleInterviewer;
    isRegister?: boolean;
  }>;

  requestPasswordReset(email: string, role: string): Promise<void>;

  resetUserPassword(
    password: string,
    confirmPassword: string,
    token: string
  ): Promise<void>;

  // refreshAccessToken(
  //   userId: string,
  //   refreshToken: string
  // ): Promise<{ accessToken: string; refreshToken: string }>;

  signout(refreshToken:string):Promise<boolean>;
}
