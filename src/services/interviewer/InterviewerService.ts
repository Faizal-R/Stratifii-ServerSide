import { type Express } from "express";
import {
  IBankDetails,
  IInterviewer,
} from "../../models/interviewer/Interviewer";
import { IInterviewerRepository } from "../../repositories/interviewer/IInterviewerRepository";
import type { FundAccountBank } from "razorpayx-nodejs-sdk/dist/services/FundAccount";
import { IInterviewerService } from "./IInterviewerService";
// import { IInterviewerProfile } from "../../validations/InterviewerValidations";
import { CustomError } from "../../error/CustomError";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";

import { comparePassword, hashPassword } from "../../utils/hash";
import { USER_COMMON_MESSAGES } from "../../constants/messages/UserProfileMessages";
import { inject, injectable } from "inversify";
import { DI_TOKENS } from "../../di/types";
import { uploadOnCloudinary } from "../../helper/cloudinary";
import { bankDetailsSchema } from "../../validations/InterviewerValidations";
import stripe from "../../config/Stripe";
import { IWalletRepository } from "../../repositories/wallet/IWalletRepository";
import { IWallet } from "../../models/wallet/Wallet";
import { generateSignedUrl, uploadFileToS3 } from "../../helper/s3Helper";
import { InterviewerMapper } from "../../mapper/interviewer/InterviewerMapper";
import { InterviewerResponseDTO } from "../../dto/response/interviewer/InterviewerResponseDTO";

@injectable()
export class InterviewerService implements IInterviewerService {
  constructor(
    @inject(DI_TOKENS.REPOSITORIES.INTERVIEWER_REPOSITORY)
    private readonly _interviewerRepository: IInterviewerRepository,
    @inject(DI_TOKENS.REPOSITORIES.WALLET_REPOSITORY)
    private readonly _walletRepository: IWalletRepository
  ) {}
  async getInterviewerById(
    interviewerId: string
  ): Promise<InterviewerResponseDTO | null> {
    try {
      const interviewer =
        await this._interviewerRepository.findById(interviewerId);
      if (!interviewer)
        throw new CustomError("Interviewer Not Found", HttpStatus.NOT_FOUND);
      let avatarUrl = null;
      if (interviewer?.avatarKey) {
        avatarUrl = await generateSignedUrl(interviewer.avatarKey);
      }

      const resumeUrl = await generateSignedUrl(interviewer?.resumeKey!);
      return InterviewerMapper.toResponse(interviewer, resumeUrl!, avatarUrl);
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

  getInterviewerWallet(interviewerId: string): Promise<IWallet | null> {
    try {
      const interviewerWallet = this._walletRepository.findOne({
        userId: interviewerId,
        userType: "interviewer",
      });

      return interviewerWallet;
    } catch (error) {
      throw error;
    }
  }

  async updateInterviewerProfile(
    interviewerId: string,
    interviewer: Partial<IInterviewer>,
    avatar?: Express.Multer.File,
    resume?: Express.Multer.File
  ): Promise<InterviewerResponseDTO> {
    try {
      if (avatar) {
        const avatarKey = await uploadFileToS3(avatar);

        interviewer.avatarKey = avatarKey;
      }
      if (resume) {
        const resumeKey = await uploadFileToS3(resume);
        interviewer.resumeKey = resumeKey;
      }

      const updatedInterviewer = await this._interviewerRepository.update(
        interviewerId,
        interviewer
      );
      let avatarUrl = null;
      if (updatedInterviewer?.avatarKey) {
        avatarUrl = await generateSignedUrl(updatedInterviewer.avatarKey);
      }

      const resumeUrl = await generateSignedUrl(updatedInterviewer?.resumeKey!);

      return InterviewerMapper.toResponse(
        updatedInterviewer!,
        resumeUrl!,
        avatarUrl
      );
    } catch (error) {
      console.log("updateing Interviewer", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    interviewerId: string
  ): Promise<void> {
    try {
      const interviewer =
        await this._interviewerRepository.findById(interviewerId);
      if (
        !interviewer ||
        !comparePassword(currentPassword, interviewer.password!)
      ) {
        throw new CustomError(
          USER_COMMON_MESSAGES.CURRENT_PASSWORD_INCORRECT,
          HttpStatus.BAD_REQUEST
        );
      }
      const hashedPassword = await hashPassword(newPassword);
      await this._interviewerRepository.update(interviewerId, {
        password: hashedPassword,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addBankDetails(
    bankDetails: IBankDetails,
    interviewerId: string
  ): Promise<void> {
    try {
      const {
        success,
        data: validatedBankDetails,
        error,
      } = bankDetailsSchema.safeParse(bankDetails);
      console.log("validatedBankDetails", validatedBankDetails);
      if (!success) {
        throw new CustomError(error.issues[0].message, HttpStatus.BAD_REQUEST);
      }
      const interviewer =
        await this._interviewerRepository.findById(interviewerId);
      if (!interviewer) {
        throw new CustomError("Interviewer Not Found", HttpStatus.NOT_FOUND);
      }

      const account = await stripe.accounts.create({
        type: "custom",
        country: "US",
        business_type: "individual",
        email: "testuser@example.com",
        capabilities: {
          transfers: { requested: true },
        },
      });

      console.log("account", account);

      const stripeAccountId = account.id;

      const externalAccount = await stripe.accounts.createExternalAccount(
        stripeAccountId,
        {
          external_account: {
            object: "bank_account",
            country: "US",
            currency: "usd",
            routing_number: "110000000", // test routing number
            account_number: "000123456789", // test account number
          },
        }
      );
      console.log("externalAccount", externalAccount);
      const result = await this._interviewerRepository.update(interviewerId, {
        bankDetails: {
          ...validatedBankDetails,
          accountNumber: externalAccount.last4,
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        stripeAccountId,
      });
      console.log(result);
    } catch (error) {
      console.log("addBankDetails", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
