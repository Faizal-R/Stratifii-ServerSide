import { Roles } from "../../constants/enums/roles";
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
  generateTokenId,
} from "../../helper/generateTokens";
import { comparePassword, hashPassword } from "../../utils/hash";
import { IOtpRepository } from "../../repositories/auth/IOtpRepository";
import { generateOtp } from "../../utils/otp";
import { sendEmail } from "../../helper/EmailService";
import { Document, Types } from "mongoose";
import redis from "../../config/RedisConfig";
import { CustomError } from "../../error/CustomError";
import {
  AuthenticateOTPRequestDTO,
  CompanyRegistrationSchema,
} from "../../dto/request/auth/RegisterRequestDTO";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { IAuthService } from "./IAuthService";
import jwt from "jsonwebtoken";
import { AccessTokenPayload, RefreshTokenPayload } from "../../types/token";

import { otpVerificationHtml, wrapHtml } from "../../helper/wrapHtml";
import { AUTH_MESSAGES } from "../../constants/messages/AuthMessages";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import { VALIDATION_MESSAGES } from "../../constants/messages/ValidationMessages";
import { getUserByRoleAndEmail } from "../../helper/getUserByRoleAndEmail";

import { ISubscriptionRecordRepository } from "../../repositories/subscription/subscription-record/ISubscriptionRecordRepository";
import { ISubscriptionRecord } from "../../models/subscription/SubscriptionRecord";
import { inject, injectable } from "inversify";
import { DI_TOKENS } from "../../di/types";
import {
  LoginRequestDTO,
  LoginRequestSchema,
} from "../../dto/request/auth/LoginRequestDTO";
import { TStatus, TUserType } from "../../types/sharedTypes";
import { AuthMapper } from "../../mapper/auth/AuthMapper";
import {
  AuthResponseDTO,
  AuthUserResponseDTO,
  GoogleAuthResponseDTO,
} from "../../dto/response/auth/AuthResponseDTO";
import {
  CompanyRegisterRequestDTO,
  InterviewerRegisterRequestDTO,
  InterviewerRegisterSchema,
} from "../../dto/request/auth/RegisterRequestDTO";
import { blacklistToken } from "../../utils/handleTokenBlacklisting";
import { InterviewerAccountSetupRequestDTO } from "../../dto/request/auth/AccountSetupRequestDTO";
import { GoogleAuthRequestDTO } from "../../dto/request/auth/GoogleAuthRequestDTO";
import { IWalletRepository } from "../../repositories/wallet/IWalletRepository";
import { uploadFileToS3 } from "../../helper/s3Helper";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(DI_TOKENS.REPOSITORIES.INTERVIEWER_REPOSITORY)
    private readonly _interviewerRepository: IInterviewerRepository,

    @inject(DI_TOKENS.REPOSITORIES.CANDIDATE_REPOSITORY)
    private readonly _candidateRepository: ICandidateRepository,

    @inject(DI_TOKENS.REPOSITORIES.COMPANY_REPOSITORY)
    private readonly _companyRepository: ICompanyRepository,

    @inject(DI_TOKENS.REPOSITORIES.OTP_REPOSITORY)
    private readonly _otpRepository: IOtpRepository,

    @inject(DI_TOKENS.REPOSITORIES.SUBSCRIPTION_RECORD_REPOSITORY)
    private readonly _subscriptionRecord: ISubscriptionRecordRepository,

    @inject(DI_TOKENS.REPOSITORIES.WALLET_REPOSITORY)
    private readonly _walletRepository: IWalletRepository
  ) {}

  async login(authPayload: LoginRequestDTO): Promise<AuthResponseDTO> {
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
        if (!user?.password) {
          throw new CustomError(
            AUTH_MESSAGES.CANDIDATE_ACCOUNT_NOT_SETUP,
            HttpStatus.NOT_FOUND
          );
        }
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

    // if(role===Roles.INTERVIEWER){
    //   if((user as IInterviewer).status==="rejected"){
    //     throw new CustomError("Your account has been rejected. Please contact support.",HttpStatus.LOCKED)
    //   }
    // }

    const accessToken = await generateAccessToken({
      userId: user._id as string,
      role,
    });

    const refreshToken = await generateRefreshToken({
      userId: user._id as string,
      role,
      jti: generateTokenId(),
    });

    let subscriptionDetails: ISubscriptionRecord | null = null;

    if (role == Roles.COMPANY) {
      subscriptionDetails = await this._subscriptionRecord.findOne({
        subscriberId: user._id as string,
      });
    }

    return AuthMapper.toAuthResponse({
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

  async registerCompany(
    company: CompanyRegisterRequestDTO
  ): Promise<AuthUserResponseDTO> {
    try {
      const {
        data: validatedData,
        success,
        error,
      } = CompanyRegistrationSchema.safeParse(company);
      if (!success) {
        const firstError = error.errors[0];
        throw new CustomError(firstError.message, HttpStatus.BAD_REQUEST);
      }

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

      const createdCompany =
        await this._companyRepository.create(validatedData);
      await this._walletRepository.create({
        userId: createdCompany._id as Types.ObjectId,
        userType: Roles.COMPANY,
      });
      await this.sendVerificationCode(createdCompany.email);
      return AuthMapper.toAuthUserResponse(createdCompany);
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
    const resumeKey= await uploadFileToS3(resume)

    const validatedInterviewer = {
      ...validatedData,
      password: hashedPassword,
      resume: resumeKey,
      status: "pending" as TStatus,
      isBlocked: false,
    };

    const createdInterviewer =
      await this._interviewerRepository.create(validatedInterviewer);

    await this._walletRepository.create({
      userId: createdInterviewer._id as Types.ObjectId,
      userType: Roles.INTERVIEWER,
    });
    await this.sendVerificationCode(createdInterviewer.email);

    return AuthMapper.toAuthUserResponse(createdInterviewer);
  }

  async setupInterviewerAccount(
    interviewerId: string,
    interviewer: InterviewerAccountSetupRequestDTO,
    resume: Express.Multer.File
  ): Promise<AuthResponseDTO> {
    const findedInterviewer =
      await this._interviewerRepository.findById(interviewerId);
    if (!resume) {
      throw new CustomError("Resume is required", HttpStatus.BAD_REQUEST);
    }

    const hashedPassword: string = await hashPassword(interviewer.password!);
    const resumeKey = await uploadFileToS3(resume);

    const setupedInterviewer = await this._interviewerRepository.update(
      interviewerId,
      {
        ...interviewer,
        email: findedInterviewer?.email,
        name: findedInterviewer?.name,
        password: hashedPassword,
        resumeKey: resumeKey,
      }
    );

    if (!setupedInterviewer) {
      throw new CustomError(
        "Failed to setup interviewer account",
        HttpStatus.NOT_FOUND
      );
    }
    await this._walletRepository.create({
      userId: setupedInterviewer._id as Types.ObjectId,
      userType: Roles.INTERVIEWER,
    });

    const accessToken = await generateAccessToken({
      userId: interviewerId,
      role: Roles.INTERVIEWER,
    });

    const refreshToken = await generateRefreshToken({
      userId: interviewerId,
      role: Roles.INTERVIEWER,
      jti: generateTokenId(),
    });

    return AuthMapper.toAuthResponse({
      accessToken,
      refreshToken,
      user: setupedInterviewer,
    });
  }

  async authenticateOTP(
    authenticateOTPPayload: AuthenticateOTPRequestDTO
  ): Promise<void> {
    const { email, role, otp } = authenticateOTPPayload;
    try {
      if (otp.length !== 6) {
        throw new CustomError(
          AUTH_MESSAGES.INVALID_OTP_FORMAT,
          HttpStatus.BAD_REQUEST
        );
      }

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
    googleAuthPayload: GoogleAuthRequestDTO
  ): Promise<GoogleAuthResponseDTO> {
    const { email, name, avatar } = googleAuthPayload;
    try {
      let interviewer = await this._interviewerRepository.findByEmail(email);

      if (interviewer) {
        // if (interviewer.status === "rejected") {
        //   throw new CustomError(
        //     "Your account has been rejected. Please contact support.",
        //     HttpStatus.LOCKED
        //   );
        // }
        const accessToken = await generateAccessToken({
          userId: interviewer._id as string,
          role: Roles.INTERVIEWER,
        });

        const refreshToken = await generateRefreshToken({
          userId: interviewer._id as string,
          role: Roles.INTERVIEWER,
          jti: generateTokenId(),
        });

        return AuthMapper.toGoogleAuthResponse({
          accessToken,
          refreshToken,
          user: interviewer,
          isRegister: false,
        });
      }
      const newInterviewer: Omit<IGoogleInterviewer, keyof Document> = {
        name,
        email,
        avatar: avatar,
      };
      const createdInterviewer =
        await this._interviewerRepository.create(newInterviewer);

      return AuthMapper.toGoogleAuthResponse({
        isRegister: true,
        user: createdInterviewer,
      });
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

  async signout(refreshToken: string): Promise<boolean> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as RefreshTokenPayload;

      if (decoded && typeof decoded.exp === "number") {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
          await blacklistToken(decoded.jti, ttl);
        }
      }

      return true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return true;
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new CustomError(
          "Your session is not valid. Please log in again.",
          HttpStatus.BAD_REQUEST
        );
      }

      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
