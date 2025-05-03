import { Request, Response } from "express";

export interface IAuthController {
  login(request: Request, response: Response): Promise<void>;
  registerCompany(request: Request, response: Response): Promise<void>;
  registerInterviewer(request: Request, response: Response): Promise<void>;
  authenticateOTP(request: Request, response: Response): Promise<void>;
  googleAuthentication(request: Request, response: Response): Promise<void>;
  triggerOtpResend(request: Request, response: Response): Promise<void>;
  resetUserPassword(request: Request, response: Response): Promise<void>;
  requestPasswordReset(request: Request, response: Response): Promise<void>;
  refreshAccessToken(request: Request, response: Response): Promise<void>;
  verifyUserAccount(request: Request, response: Response): Promise<void>;
  setupInterviewerAccount(request: Request, response: Response): Promise<void>;
  signout(request: Request, response: Response): void;
}
