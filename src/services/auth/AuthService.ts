import { Roles } from "../../constants/roles";
import { IInterviewerRepository } from "../../repositories/interviewer/IInterviewerRepository";
import { ICandidateRepository } from "../../repositories/candidate/ICandidateRepository";
import { ICompanyRepository } from "../../repositories/company/ICompanyRepository";
import { ICompany } from "../../models/company/Company";
import {
  IGoogleInterviewer,
  IInterviewer,
} from "../../models/interviewer/Interviewer";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helper/generateTokens";

import { ICandidate } from "../../models/candidate/Candidate";
import { comparePassword, hashPassword } from "../../utils/hash";
import { IOtpRepository } from "../../repositories/auth/IOtpRepository";
import { generateOtp } from "../../utils/otp";
import { sendEmail } from "../../helper/EmailService";
import { Document } from "mongoose";
import redis from "../../config/RedisConfig";
import { CustomError } from "../../error/CustomError";
import { companyRegistrationSchema } from "../../validations/CompanyValidations";
import { ZodError } from "zod";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { interviewerSchema } from "../../validations/InterviewerValidations";
import { IAuthService } from "./IAuthService";
import jwt from "jsonwebtoken";

import { TokenPayload } from "../../middlewares/Auth";
import {
  deleteRefreshToken,
  storeRefreshToken,
  verifyRefreshToken,
} from "../../helper/handleRefreshToken";
import { create } from "ts-node";

type UserType = ICompany | IInterviewer | ICandidate;

export class AuthService implements IAuthService {
  constructor(
    private readonly _interviewerRepository: IInterviewerRepository,
    private readonly _candidateRepository: ICandidateRepository,
    private readonly _companyRepository: ICompanyRepository,
    private readonly _otpRepository: IOtpRepository
  ) {}

  async login(
    role: Roles,
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string; user: UserType }> {
    let user: UserType | null | undefined;

    switch (role) {
      case Roles.COMPANY:
        user = await this._companyRepository?.findByEmail(email);
        break;
      case Roles.INTERVIEWER:
        user = await this._interviewerRepository?.findByEmail(email);
        break;
      case Roles.CANDIDATE:
        user = await this._candidateRepository?.findByEmail(email);
        break;
      default:
        throw new CustomError("Invalid Role", HttpStatus.BAD_REQUEST);
    }
    if (!user?.password) {
      throw new CustomError(
        "This account was created using Google Sign-In. Please log in with Google.",
        HttpStatus.NOT_FOUND
      );
    }
    if (!user || !(await comparePassword(password, user.password))) {
      throw new CustomError(
        "Invalid email or password",
        HttpStatus.BAD_REQUEST
      );
    }

    const accessToken = await generateAccessToken(user._id as string, role);
    const refreshToken = await generateRefreshToken(user._id as string, role);

    await storeRefreshToken(user._id as string, refreshToken);
    return { accessToken, refreshToken, user };
  }

  async sendVerificationCode(email: string) {
    await this._otpRepository.deleteOtp(email);
    const otp = generateOtp(6);
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verification Code</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: #f3f4f6;
          margin: 0;
          padding: 20px;
        }
        
        .container {
          max-width: 500px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          background: linear-gradient(to bottom, #000000, #1e1b4b);
          padding: 24px;
          text-align: center;
        }
        
        .icon-container {
          background-color: #1e1b4b;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 8px;
        }
        
        .header-title {
          color: #ffffff;
          font-size: 20px;
          font-weight: bold;
          margin: 0;
        }
        
        .date {
          padding: 16px 24px 0;
          font-size: 12px;
          color: #6b7280;
        }
        
        .content {
          padding: 24px;
        }
        
        .greeting, .message {
          color: #374151;
          margin-bottom: 24px;
        }
        
        .code-container {
          background-color: #f3f4f6;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          text-align: center;
        }
        
        .code {
          font-size: 30px;
          font-weight: bold;
          letter-spacing: 0.2em;
          color: #1e1b4b;
        }
        
        .expiry {
          font-size: 12px;
          color: #6b7280;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .warning-box {
          background-color: #fffbeb;
          border: 1px solid #fef3c7;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 24px;
          display: flex;
        }
        
        .security-box {
          background-color: #f5f3ff;
          border: 1px solid #ede9fe;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 24px;
          display: flex;
        }
        
        .box-text {
          font-size: 14px;
          color: #374151;
          margin: 0;
          margin-left: 8px;
        }
        
        .thanks {
          color: #374151;
          margin-bottom: 8px;
        }
        
        .team {
          color: #374151;
          font-weight: 600;
          margin-bottom: 24px;
        }
        
        .details-button {
          color: #8b5cf6;
          font-size: 14px;
          display: flex;
          align-items: center;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        
        .details-section {
          margin-top: 16px;
          border-top: 1px solid #e5e7eb;
          padding-top: 16px;
        }
        
        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .details-title {
          font-weight: 500;
          color: #374151;
          margin: 0;
        }
        
        .hide-details {
          color: #8b5cf6;
          font-size: 12px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        
        .details-text {
          font-size: 14px;
          color: #4b5563;
          margin-bottom: 16px;
        }
        
        .details-info {
          background-color: #f9fafb;
          padding: 12px;
          border-radius: 6px;
        }
        
        .info-row {
          display: flex;
          margin-bottom: 8px;
        }
        
        .info-row:last-child {
          margin-bottom: 0;
        }
        
        .info-label {
          width: 96px;
          font-size: 12px;
          color: #6b7280;
        }
        
        .info-value {
          font-size: 12px;
          color: #374151;
        }
        
        .help-section {
          background-color: #f9fafb;
          padding: 16px;
          border-top: 1px solid #e5e7eb;
        }
        
        .help-title {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }
        
        .help-link {
          color: #8b5cf6;
          font-size: 14px;
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        
        .footer {
          border-top: 1px solid #e5e7eb;
          padding: 16px;
          background-color: #f9fafb;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
        
        .footer p {
          margin: 0 0 8px;
        }
        
        .footer p:last-child {
          margin-bottom: 0;
        }
        
        .icon {
          display: inline-block;
          vertical-align: middle;
        }
        
        .icon-sm {
          width: 16px;
          height: 16px;
          margin-right: 4px;
        }
        
        .icon-xs {
          width: 12px;
          height: 12px;
          margin-right: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Email Header -->
        <div class="header">
          <div class="icon-container">
            <svg class="icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
              <path d="m5 8 7 4 7-4"></path>
            </svg>
          </div>
          <h1 class="header-title">Verification Code</h1>
        </div>
        
        <!-- Email Date -->
        <div class="date">
          Monday, January 1, 2025
        </div>
        
        <!-- Email Body -->
        <div class="content">
          <p class="greeting">
            Hello,
          </p>
          
          <p class="message">
            We received a request to verify your account. Please use the verification code below to complete the process:
          </p>
          
          <!-- OTP Code Display -->
          <div class="code-container">
            <div class="code">${otp}</div>
            <div class="expiry">
              <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              This code will expire in 10 minutes.
            </div>
          </div>
          
          <div class="security-box">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p class="box-text">
              For your security, never share this code with anyone.
            </p>
          </div>
          
          <p class="thanks">
            Thank you,
          </p>
          <p class="team">
            The Security Team
          </p>
          
          <!-- Details Section (Expanded) -->
          <div class="details-section">
            <div class="details-header">
              <h3 class="details-title">Why am I receiving this?</h3>
              <button class="hide-details">Hide details</button>
            </div>
            <p class="details-text">
              You received this email because someone (hopefully you) is trying to access your account. This verification code helps us ensure it's really you.
            </p>
            
        
        
        <!-- Email Footer -->
        <div class="footer">
          <p>This is an automated message, please do not reply.</p>
          <p>© 2025 Your Company. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>`;
    await sendEmail(email, otp, html);
    this._otpRepository.saveOtp(email, otp, 180);
  }
  async sendVerificationLink(email: string, resetLink: string) {
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .logo {
            width: 100px;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            background: #007bff;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 5px;
            font-size: 16px;
            margin-top: 20px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888888;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://yourwebsite.com/logo.png" alt="Company Logo" class="logo">
        <h2>Password Reset Request</h2>
        <p>Click the button below to reset your password. This link is valid for <strong>15 minutes</strong>.</p>
        <a href=${resetLink} class="button">Reset Password</a>
        <p>If you did not request a password reset, you can ignore this email.</p>
        <div class="footer">
            <p>Need help? <a href="https://yourwebsite.com/support">Contact Support</a></p>
            <p>© 2025 Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
    await sendEmail(email, resetLink, html);
  }

  async registerCompany(company: ICompany): Promise<ICompany> {
    try {
      const validatedData = companyRegistrationSchema.parse(company);

      const existingCompany = await this._companyRepository.findByEmail(
        validatedData.email
      );
      if (existingCompany) {
        throw new CustomError(
          "A company with this email already exists.",
          HttpStatus.CONFLICT
        );
      }

      validatedData.password = await hashPassword(validatedData.password);

      const newCompany: Omit<ICompany, keyof Document> = { ...validatedData };
      const newCom = await this._companyRepository.create(newCompany);
      await this.sendVerificationCode(newCom.email);
      return newCom;
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        throw error;
      }

      if (error instanceof ZodError) {
        throw new CustomError(
          error.errors.map((e) => e.message).join(", "),
          HttpStatus.BAD_REQUEST
        );
      }

      throw new CustomError(
        "An unexpected error occurred",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async registerInterviewer(interviewer: IInterviewer): Promise<IInterviewer> {
    const validatedData = interviewerSchema.parse(interviewer);

    const existingUser = await this._interviewerRepository.findByEmail(
      validatedData.email
    );
    if (existingUser) {
      throw new CustomError("Email already in use", 400);
    }

    const hashedPassword = await hashPassword(validatedData.password);

    const validatedInterviewer: Omit<IInterviewer, keyof Document> = {
      name: validatedData.name,
      email: validatedData.email,
      position: validatedData.position,
      password: hashedPassword,
      phone: validatedData.phone,
      experience: validatedData.experience,
      linkedinProfile: validatedData.linkedinProfile,
      language: validatedData.language,
      availableDays: validatedData.availableDays,
      professionalSummary: validatedData.professionalSummary,
      expertise: validatedData.expertise,
      isVerified: false,
      status: "pending",
      isBlocked: false,
    };
    const newInterviewer = await this._interviewerRepository.create(
      validatedInterviewer
    );
    await this.sendVerificationCode(newInterviewer.email);

    return newInterviewer;
  }

  async authenticateOTP(otp: string, email: string): Promise<void> {
    try {
      let isOtpExists = await this._otpRepository.otpExists(email);
      if (!isOtpExists) {
        throw new CustomError(
          "OTP not found or expired",
          HttpStatus.BAD_REQUEST
        );
      }
      const existingOtp = await this._otpRepository.getOtp(email);

      if (existingOtp !== otp) {
        throw new CustomError("Invalid OTP", HttpStatus.BAD_REQUEST);
      }
      await this._otpRepository.deleteOtp(email);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "An unexpected error occurred While Authenticating OTP",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async googleAuthentication(
    email: string,
    name: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IGoogleInterviewer;
  }> {
    try {
      let interviewer = await this._interviewerRepository.findByEmail(email);
      
      if (interviewer) {
        const accessToken = await generateAccessToken(
          interviewer._id as string,
          Roles.INTERVIEWER
        );
        const refreshToken = await generateRefreshToken(
          interviewer._id as string,
          Roles.INTERVIEWER
        );
        return { accessToken, refreshToken, user: interviewer };
      }
      const newInterviewer: Omit<IGoogleInterviewer, keyof Document> = {
        name,
        email,
      };
      const createdInterviewer = await this._interviewerRepository.create(
        newInterviewer
      );
      const accessToken = await generateAccessToken(
        createdInterviewer._id as string,
        Roles.INTERVIEWER
      );
      const refreshToken = await generateRefreshToken(
        createdInterviewer._id as string,
        Roles.INTERVIEWER
      );
      await storeRefreshToken(createdInterviewer._id as string, refreshToken);
      return { accessToken, refreshToken, user: createdInterviewer };
    } catch (error) {
      console.log(error)
      throw new CustomError(
        "An unexpected error occurred while google authentication",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async requestPasswordReset(email: string, role: string) {
    let user: UserType | null;
    try {
      switch (role) {
        case Roles.COMPANY:
          user = await this._companyRepository.findByEmail(email);
          break;
        case Roles.INTERVIEWER:
          user = await this._interviewerRepository.findByEmail(email);
          break;
        case Roles.CANDIDATE:
          user = await this._candidateRepository.findByEmail(email);
          break;
        default:
          throw new CustomError("Invalid Role", HttpStatus.BAD_REQUEST);
      }
      if (!user) {
        throw new CustomError(
          "No user found with this email",
          HttpStatus.NOT_FOUND
        );
      }
      const resetToken = await generateAccessToken(user._id as string, role);
      await redis.setex(`resetToken:${user._id}`, 900, resetToken);
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/?token=${resetToken}`;
      await this.sendVerificationLink(email, resetLink);
      // await this.sendVerificationCode(email);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
    }
  }
  async resetUserPassword(
    password: string,
    confirmPassword: string,
    token: string
  ) {
    let decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as TokenPayload;
    console.log(decoded);
    const userId = decoded.userId;

    const storedToken = await redis.get(`resetToken:${userId}`);

    if (!storedToken || storedToken !== token) {
      throw new CustomError("Invalid or expired token", HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await hashPassword(password);
    let user: UserType | null;
    let role = decoded.role;
    try {
      switch (role) {
        case Roles.COMPANY:
          await this._companyRepository.update(userId, {
            password: hashedPassword,
          });
          break;
        case Roles.INTERVIEWER:
          await this._interviewerRepository.update(userId, {
            password: hashedPassword,
          });
          break;
        case Roles.CANDIDATE:
          user = await this._candidateRepository.update(userId, {
            password: hashedPassword,
          });
          break;
        default:
          throw new CustomError("Invalid Role", HttpStatus.BAD_REQUEST);
      }
      // if (!user) {
      //   throw new CustomError("No user found", HttpStatus.NOT_FOUND);
      // }
      if (password !== confirmPassword) {
        throw new CustomError("Passwords do not match", HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
    }
  }

  async refreshAccessToken(
    userId: string,
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const isValidRefreshToken = await verifyRefreshToken(userId, refreshToken);

    if (!isValidRefreshToken) {
      throw new CustomError("Invalid refresh token", HttpStatus.UNAUTHORIZED);
    }

    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as TokenPayload;

    const role = decodedToken.role;

    const accessToken = await generateAccessToken(userId, role);
    const newRefreshToken = await generateRefreshToken(userId, role);

    await deleteRefreshToken(userId);
    await storeRefreshToken(userId, newRefreshToken);
    return { accessToken, refreshToken: newRefreshToken };
  }
  
}
