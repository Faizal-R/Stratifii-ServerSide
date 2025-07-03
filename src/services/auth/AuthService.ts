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
import { string, ZodError } from "zod";
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

import { otpVerificationHtml, wrapHtml } from "../../helper/wrapHtml";
import { AUTH_MESSAGES } from "../../constants/messages/AuthMessages";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import { VALIDATION_MESSAGES } from "../../constants/messages/ValidationMessages";
import { getUserByRoleAndEmail } from "../../helper/getUserByRoleAndEmail";
import { uploadOnCloudinary } from "../../helper/cloudinary";

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
        if (user?.status === "pending") {
          user = await this._candidateRepository.update(user._id as string, {
            status: "active",
          });
        }
        break;
      default:
        throw new CustomError("Invalid Role", HttpStatus.BAD_REQUEST);
    }
    if (user?.password === null && role === Roles.INTERVIEWER) {
      throw new CustomError(
        AUTH_MESSAGES.GOOGLE_SIGNIN_ONLY,
        HttpStatus.NOT_FOUND
      );
    }
    if (!user || !(await comparePassword(password, user.password!))) {
      throw new CustomError(
        VALIDATION_MESSAGES.INVALID_CREDENTIALS,
        HttpStatus.BAD_REQUEST
      );
    }
    if (
      role !== Roles.CANDIDATE &&
      !(user as IInterviewer | ICompany).isVerified
    ) {
      throw new CustomError(
        AUTH_MESSAGES.USER_NOT_VERIFIED,
        HttpStatus.FORBIDDEN
      );
    }

    const accessToken = await generateAccessToken({
      userId: user._id as string,
      role,
    });
    const refreshToken = await generateRefreshToken({
      userId: user._id as string,
      role,
    });

    await storeRefreshToken(user._id as string, refreshToken);
    return { accessToken, refreshToken, user };
  }

  async sendVerificationCode(email: string) {
    await this._otpRepository.deleteOtp(email);
    const otp = generateOtp(6);

    const html = otpVerificationHtml(otp);
    await sendEmail(email, html);
    this._otpRepository.saveOtp(email, otp, 180);
  }
  async sendVerificationLink(email: string, resetLink: string) {
    const html = wrapHtml(resetLink);

    await sendEmail(email, html);
  }

  async registerCompany(company: ICompany): Promise<ICompany> {
    try {
      const validatedData = companyRegistrationSchema.parse(company);

      const existingCompany = await this._companyRepository.findByEmail(
        validatedData.email
      );
      if (existingCompany) {
        throw new CustomError(
          AUTH_MESSAGES.COMPANY_ALREADY_EXISTS,
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
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async registerInterviewer(
    interviewer: IInterviewer,
    resume: Express.Multer.File
  ): Promise<IInterviewer> {
    const validatedData = interviewerSchema.parse(interviewer);

    const existingUser = await this._interviewerRepository.findByEmail(
      validatedData.email
    );
    if (existingUser) {
      throw new CustomError(AUTH_MESSAGES.INTERVIEWER_ALREADY_EXISTS, 400);
    }

    const hashedPassword = await hashPassword(validatedData.password);
    const resumeUrl = await uploadOnCloudinary(resume?.path!, "raw");

    const validatedInterviewer: Omit<IInterviewer, keyof Document> = {
      name: validatedData.name,
      email: validatedData.email,
      position: validatedData.position,
      password: hashedPassword,
      phone: validatedData.phone,
      experience: validatedData.experience,
      linkedinProfile: validatedData.linkedinProfile,
      languages: validatedData.languages,
      availableDays: validatedData.availableDays,
      professionalSummary: validatedData.professionalSummary,
      expertise: validatedData.expertise,
      isVerified: false,
      status: "pending",
      isBlocked: false,
      resume: resumeUrl,
    };
    const newInterviewer = await this._interviewerRepository.create(
      validatedInterviewer
    );
    await this.sendVerificationCode(newInterviewer.email);

    return newInterviewer;
  }

  async setupInterviewerAccount(
    interviewerId: string,
    interviewer: IInterviewer,
    resume: Express.Multer.File
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    setupedInterviewer: IInterviewer;
  }> {
    const findedInterviewer = await this._interviewerRepository.findById(
      interviewerId
    );
    console.log("resumeInService", resume);
    const hashedPassword: string = await hashPassword(interviewer.password);
    const resumeUrl = await uploadOnCloudinary(resume.path!, "raw");
    const setupedInterviewer = await this._interviewerRepository.update(
      interviewerId,
      {
        ...interviewer,
        email: findedInterviewer?.email,
        name: findedInterviewer?.name,
        password: hashedPassword,
        resume: resumeUrl,
      } 
    );
    if (!setupedInterviewer) {
      throw new CustomError(
        "Failed to setup interviewer account",
        HttpStatus.NOT_FOUND
      );
    }
    const accessToken = await generateAccessToken({
      userId: interviewerId,
      role: Roles.INTERVIEWER,
    });
    const refreshToken = await generateRefreshToken({
      userId: interviewerId,
      role: Roles.INTERVIEWER,
    });
    await storeRefreshToken(interviewerId, refreshToken);
    return { accessToken, refreshToken, setupedInterviewer };
  }

  async authenticateOTP(
    otp: string,
    email: string,
    role: string
  ): Promise<void> {
    try {
      let isOtpExists = await this._otpRepository.otpExists(email);
      if (!isOtpExists) {
        throw new CustomError(
          AUTH_MESSAGES.EXPIRED_OTP,
          HttpStatus.BAD_REQUEST
        );
      }
      const existingOtp = await this._otpRepository.getOtp(email);
      console.log(existingOtp, otp);
      if (existingOtp !== otp) {
        throw new CustomError(
          AUTH_MESSAGES.INCORRECT_OTP,
          HttpStatus.BAD_REQUEST
        );
      }
      await this._otpRepository.deleteOtp(email);
      const user = await getUserByRoleAndEmail(email, role);
      if (!user)
        throw new CustomError(
          AUTH_MESSAGES.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      if (role === Roles.COMPANY) {
        await this._companyRepository.update(user._id as string, {
          isVerified: true,
        });
      } else if (role === Roles.INTERVIEWER) {
        await this._interviewerRepository.update(user._id as string, {
          isVerified: true,
        });
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async googleAuthentication(
    email: string,
    name: string
  ): Promise<{
    accessToken?: string;
    refreshToken?: string;
    user?: IGoogleInterviewer;
    isRegister?: boolean;
  }> {
    try {
      let interviewer = await this._interviewerRepository.findByEmail(email);

      if (interviewer) {
        if (interviewer.status === "rejected") {
          throw new CustomError(
            "Your account has been rejected. Please contact support.",
            HttpStatus.FORBIDDEN
          );
        }
        const accessToken = await generateAccessToken({
          userId: interviewer._id as string,
          role: Roles.INTERVIEWER,
        });
        const refreshToken = await generateRefreshToken({
          userId: interviewer._id as string,
          role: Roles.INTERVIEWER,
        });
        await storeRefreshToken(interviewer._id as string, refreshToken);

        return {
          accessToken,
          refreshToken,
          user: interviewer,
          isRegister: false,
        };
      }
      const newInterviewer: Omit<IGoogleInterviewer, keyof Document> = {
        name,
        email,
      };
      const createdInterviewer = await this._interviewerRepository.create(
        newInterviewer
      );
      // await storeRefreshToken(createdInterviewer._id as string, refreshToken);

      return { isRegister: true, user: createdInterviewer };
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
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
          AUTH_MESSAGES.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }
      const resetToken = await generateAccessToken({
        userId: user._id as string,
        role,
      });
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
    if (password !== confirmPassword) {
      throw new CustomError(
        VALIDATION_MESSAGES.PASSWORD_MISMATCH,
        HttpStatus.BAD_REQUEST
      );
    }
    let decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as TokenPayload;

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

    const accessToken = await generateAccessToken({ userId, role });
    const newRefreshToken = await generateRefreshToken({ userId, role });

    await deleteRefreshToken(userId);
    await storeRefreshToken(userId, newRefreshToken);
    return { accessToken, refreshToken: newRefreshToken };
  }
}
