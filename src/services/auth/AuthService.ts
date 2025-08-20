import { Roles } from "../../constants/roles";
import { IInterviewerRepository } from "../../repositories/interviewer/IInterviewerRepository";
import { ICandidateRepository } from "../../repositories/candidate/ICandidateRepository";
import { ICompanyRepository } from "../../repositories/company/ICompanyRepository";
import { ICompany } from "../../models/company/Company";
import {
  IGoogleInterviewer,
  IInterviewer,
  TStatus,
} from "../../models/interviewer/Interviewer";

import {
  generateAccessToken,
  generateRefreshToken,
  generateSessionIdForToken,
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

import { AccessTokenPayload } from "../../middlewares/Auth";
import { storeRefreshToken } from "../../helper/handleRefreshToken";

import { otpVerificationHtml, wrapHtml } from "../../helper/wrapHtml";
import { AUTH_MESSAGES } from "../../constants/messages/AuthMessages";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import { VALIDATION_MESSAGES } from "../../constants/messages/ValidationMessages";
import { getUserByRoleAndEmail } from "../../helper/getUserByRoleAndEmail";
import { uploadOnCloudinary } from "../../helper/cloudinary";
import { ISubscriptionRecordRepository } from "../../repositories/subscription/subscription-record/ISubscriptionRecordRepository";
import { ISubscriptionPlanService } from "../subscription/subscription-plan/ISubscriptionPlanService";
import { ISubscriptionRecord } from "../../models/subscription/SubscriptionRecord";
import { inject, injectable } from "inversify";
import { DiRepositories } from "../../di/types";
import {
  LoginRequestDTO,
  LoginRequestSchema,
} from "../../dto/request/auth/LoginRequestDTO";
import { TUserType } from "../../types/user";
import {
  mapToAuthResponseDTO,
  mapToAuthUserResponseDTO,
} from "../../mapper/auth/AuthMapper";
import {
  AuthLoginResponseDTO,
  AuthUserResponseDTO,
} from "../../dto/response/auth/AuthResponseDTO";
import {
  InterviewerRegisterRequestDTO,
  InterviewerRegisterSchema,
} from "../../dto/request/auth/RegisterRequestDTO";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(DiRepositories.InterviewerRepository)
    private readonly _interviewerRepository: IInterviewerRepository,

    @inject(DiRepositories.CandidateRepository)
    private readonly _candidateRepository: ICandidateRepository,

    @inject(DiRepositories.CompanyRepository)
    private readonly _companyRepository: ICompanyRepository,

    @inject(DiRepositories.AuthRepository)
    private readonly _otpRepository: IOtpRepository,

    @inject(DiRepositories.SubscriptionRecordRepository)
    private readonly _subscriptionRecord: ISubscriptionRecordRepository
  ) {}

  async login(authPayload: LoginRequestDTO): Promise<AuthLoginResponseDTO> {
    const validatedAuthPayload = LoginRequestSchema.safeParse(authPayload);

    if (!validatedAuthPayload.success) {
      const firstIssue = validatedAuthPayload.error.issues[0];
      throw new CustomError(firstIssue.message, HttpStatus.BAD_REQUEST);
    }

    const { email, password, role } = validatedAuthPayload.data;

    let user: TUserType | null | undefined;

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
    const sessionId = generateSessionIdForToken();
    const refreshToken = await generateRefreshToken({
      userId: user._id as string,
      role,
      sessionId,
    });

    await storeRefreshToken(sessionId, refreshToken);

    let subscriptionDetails: ISubscriptionRecord | null = null;

    if (role == Roles.COMPANY) {
      subscriptionDetails = await this._subscriptionRecord.findOne({
        subscriberId: user._id as string,
      });
    }

    return mapToAuthResponseDTO({
      accessToken,
      refreshToken,
      user,
      subscriptionDetails,
    });
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

  async registerCompany(company: ICompany): Promise<AuthUserResponseDTO> {
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

      const validatedCompany: Omit<ICompany, keyof Document> = {
        ...validatedData,
      };
      const createdCompany = await this._companyRepository.create(
        validatedCompany
      );
      await this.sendVerificationCode(createdCompany.email);
      return mapToAuthUserResponseDTO(createdCompany);
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
    interviewer: InterviewerRegisterRequestDTO,
    resume: Express.Multer.File
  ): Promise<AuthUserResponseDTO> {
    const parsedResult = InterviewerRegisterSchema.safeParse(interviewer);

    if (!parsedResult.success) {
      const firstError = parsedResult.error.errors[0];
      throw new CustomError(firstError.message, 400);
    }

    const validatedData = parsedResult.data;

    const existingUser = await this._interviewerRepository.findByEmail(
      validatedData.email
    );
    if (existingUser) {
      throw new CustomError(AUTH_MESSAGES.INTERVIEWER_ALREADY_EXISTS, 400);
    }

    const hashedPassword = await hashPassword(validatedData.password);
    const resumeUrl = await uploadOnCloudinary(resume?.path!, "raw");

    const validatedInterviewer = {
      ...validatedData,
      password: hashedPassword,
      resume: resumeUrl,
      status: "pending" as TStatus,
      isBlocked: false,
    };

    const createdInterviewer = await this._interviewerRepository.create(
      validatedInterviewer
    );
    await this.sendVerificationCode(createdInterviewer.email);

    return mapToAuthUserResponseDTO(createdInterviewer);
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
    const hashedPassword: string = await hashPassword(interviewer.password!);
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
    const sessionId = generateSessionIdForToken();
    const refreshToken = await generateRefreshToken({
      userId: interviewerId,
      role: Roles.INTERVIEWER,
      sessionId,
    });
    await storeRefreshToken(sessionId, refreshToken);
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
    name: string,
    avatar: string
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
        const sessionId = generateSessionIdForToken();
        const refreshToken = await generateRefreshToken({
          userId: interviewer._id as string,
          role: Roles.INTERVIEWER,
          sessionId,
        });
        await storeRefreshToken(sessionId, refreshToken);

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
        avatar: avatar,
      };
      const createdInterviewer = await this._interviewerRepository.create(
        newInterviewer
      );
      const accessToken = await generateAccessToken({
        userId: createdInterviewer._id as string,
        role: Roles.INTERVIEWER,
      });
      const sessionId = generateSessionIdForToken();
      const refreshToken = await generateRefreshToken({
        userId: createdInterviewer._id as string,
        role: Roles.INTERVIEWER,
        sessionId,
      });
      await storeRefreshToken(sessionId, refreshToken);

      return {
        isRegister: true,
        user: createdInterviewer,
        accessToken,
        refreshToken,
      };
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
    let user: TUserType | null;
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
    ) as AccessTokenPayload;

    const userId = decoded.userId;

    const storedToken = await redis.get(`resetToken:${userId}`);

    if (!storedToken || storedToken !== token) {
      throw new CustomError("Invalid or expired token", HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await hashPassword(password);
    let user: TUserType | null;
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

  // async refreshAccessToken(
  //   userId: string,
  //   refreshToken: string
  // ): Promise<{ accessToken: string; refreshToken: string }> {
  //   const isValidRefreshToken = await verifyRefreshToken(userId, refreshToken);

  //   if (!isValidRefreshToken) {
  //     throw new CustomError("Invalid refresh token", HttpStatus.UNAUTHORIZED);
  //   }

  //   const decodedToken = jwt.verify(
  //     refreshToken,
  //     process.env.REFRESH_TOKEN_SECRET as string
  //   ) as TokenPayload;

  //   const role = decodedToken.role;

  //   const accessToken = await generateAccessToken({ userId, role });
  //   const newRefreshToken = await generateRefreshToken({ userId, role });

  //   await deleteRefreshToken(userId);
  //   await storeRefreshToken(userId, newRefreshToken);
  //   return { accessToken, refreshToken: newRefreshToken };
  // }
}
