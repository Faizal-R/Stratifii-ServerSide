import { Roles } from "../../constants/roles";
import { IInterviewerRepository } from "../../repositories/interviewer/IInterviewerRepository";
import { ICandidateRepository } from "../../repositories/candidate/ICandidateRepository";
import { ICompanyRepository } from "../../repositories/company/ICompanyRepository";
import { ICompany } from "../../models/company/Company";
import {
  IGoogleInterviewer,
  IInterviewer,
} from "../../models/interviewer/Interviewer";
import { ICandidate } from "../../models/candidate/Candidate";
import { comparePassword, hashPassword } from "../../utils/hash";
import { IOtpRepository } from "../../repositories/auth/IOtpRepository";
import { generateOtp } from "../../utils/otp";
import { sendEmail } from "../../helper/EmailService";
import { Document } from "mongoose";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helper/generateTokens";
import { CustomError } from "../../error/CustomError";
import { companyRegistrationSchema } from "../../validations/CompanyValidations";
import { ZodError } from "zod";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { interviewerSchema } from "../../validations/InterviewerValidations";
import { IAuthService } from "./IAuthService";
import { IAdmin } from "../../models/admin/Admin";

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

    if (!user || !(await comparePassword(password, user.password))) {
      throw new CustomError(
        "Invalid email or password",
        HttpStatus.BAD_REQUEST
      );
    }

    const accessToken = await generateAccessToken(user._id as string, role);
    const refreshToken = await generateRefreshToken(user._id as string, role);

    return { accessToken, refreshToken, user };
  }

  async sendVerificationCode(email: string) {
    await this._otpRepository.deleteOtp(email);
    const otp = generateOtp(6);
    await sendEmail(email, otp);
    this._otpRepository.saveOtp(email, otp, 180);
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

      return await this._companyRepository.create(newCompany);
    } catch (error) {
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

    const newInterviewer: Omit<IInterviewer, keyof Document> = {
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
    };

    return await this._interviewerRepository.create(newInterviewer);
  }

  async authenticateOTP(
    otp: string,
    email: string,
  ): Promise<void> {
    try{
      let isOtpExists = await this._otpRepository.otpExists(
         email
      );
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
        "An unexpected error occurred",
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
      return { accessToken, refreshToken, user: createdInterviewer };
    } catch (error) {
      throw new CustomError(
        "An unexpected error occurred while google authentication",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
