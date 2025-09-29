import { ICompany } from "../../models/company/Company";

import {
  IGoogleInterviewer,
  IInterviewer,
} from "../../models/interviewer/Interviewer";

import { LoginRequestDTO } from "../../dto/request/auth/LoginRequestDTO";
import {
  AuthResponseDTO,
  AuthUserResponseDTO,
  GoogleAuthResponseDTO,
} from "../../dto/response/auth/AuthResponseDTO";
import {
  AuthenticateOTPRequestDTO,
  CompanyRegisterRequestDTO,
  InterviewerRegisterRequestDTO,
} from "../../dto/request/auth/RegisterRequestDTO";
import { InterviewerAccountSetupRequestDTO } from "../../dto/request/auth/AccountSetupRequestDTO";
import { GoogleAuthRequestDTO } from "../../dto/request/auth/GoogleAuthRequestDTO";

export interface IAuthService {
  login(AuthPayload: LoginRequestDTO): Promise<AuthResponseDTO>;

  registerCompany(
    company: CompanyRegisterRequestDTO
  ): Promise<AuthUserResponseDTO>;

  sendVerificationCode(email: string): Promise<void>;

  registerInterviewer(
    interviewer: InterviewerRegisterRequestDTO,
    resume?: Express.Multer.File
  ): Promise<AuthUserResponseDTO>;

  setupInterviewerAccount(
    interviewerId: string,
    interviewer: InterviewerAccountSetupRequestDTO,
    resume: Express.Multer.File
  ): Promise<AuthResponseDTO>;

  authenticateOTP(
    authenticateOTPPayload: AuthenticateOTPRequestDTO
  ): Promise<void>;

  googleAuthentication(
    googleAuthPayload: GoogleAuthRequestDTO
  ): Promise<GoogleAuthResponseDTO>;

  requestPasswordReset(email: string, role: string): Promise<void>;

  resetUserPassword(
    password: string,
    confirmPassword: string,
    token: string
  ): Promise<void>;

  signout(refreshToken: string): Promise<boolean>;
}
