import { hash } from "bcryptjs";
import { IAdminRepository } from "../../repositories/admin/IAdminRepository";
import { IAdminService } from "./IAdminService";
import { comparePassword } from "../../utils/hash";
import { CustomError } from "../../error/CustomError";
import { HttpStatus } from "../../config/HttpStatusCodes";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helper/generateTokens";
import { Roles } from "../../constants/roles";
import { ICompany } from "../../models/company/Company";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import { IInterviewer } from "../../models/interviewer/Interviewer";
import { storeRefreshToken } from "../../helper/handleRefreshToken";
import { sendEmail } from "../../helper/EmailService";
import { interviewerAccountRejectionHtml } from "../../helper/wrapHtml";
import { inject, injectable } from "inversify";
import { DiRepositories, DiServices } from "../../di/types";

@injectable()
export class AdminService implements IAdminService {
  constructor(@inject(DiRepositories.AdminRepository) private readonly _adminRepository: IAdminRepository) {}
  async getAllCompanies(status: string): Promise<ICompany[] | []> {
    try {
      const companies = await this._adminRepository.getAllCompanies(status);
      return companies;
    } catch (error) {
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getAllInterivewers(status: string): Promise<IInterviewer[] | []> {
    try {
      console.log(status);
      const interviewers = await this._adminRepository.getAllInterviewers(
        status
      );
      return interviewers;
    } catch (error) {
      console.log(error);
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      let admin = await this._adminRepository.findByEmail(email);
      let isPassMatch = admin?.password === password;
      console.log(admin?.password, password);
      console.log(isPassMatch);
      if (!admin || !isPassMatch) {
        throw new CustomError("Incorrect Email or password", HttpStatus.BAD_REQUEST);
      }
      const accessToken = await generateAccessToken({
        userId: admin._id as string,
        role: Roles.ADMIN,
      });
      const refreshToken = await generateRefreshToken({
        userId: admin._id as string,
        role: Roles.ADMIN,
      });
      await storeRefreshToken(admin._id as string, refreshToken);
      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateCompanyStatus(companyId: string): Promise<ICompany | null> {
    try {
      let updatedCompany = await this._adminRepository.updateCompanyStatus(
        companyId
      );
      return updatedCompany;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async updateInterviewerStatus(
    interviewerId: string
  ): Promise<IInterviewer | null> {
    try {
      let updatedInviewer = await this._adminRepository.updateInterviewerStatus(
        interviewerId
      );
      return updatedInviewer;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async handleCompanyVerification(
    companyId: string,
    isApproved: boolean
  ): Promise<ICompany | null> {
    try {
      const updatedCompany =
        await this._adminRepository.updateCompanyVerificationStatus(
          companyId,
          isApproved
        );
      return updatedCompany;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async handleInterviewerVerification(
    interviewerId: string,
    isApproved: boolean,
    interviewerName: string,
    interviewerEmail: string,
    reasonForRejection?: string
  ): Promise<IInterviewer | null> {
    try {
      const updatedInterviewer =
        await this._adminRepository.updateInterviewerVerificationStatus(
          interviewerId,
          isApproved
        );
      if (!isApproved) {
        const htmlContent = interviewerAccountRejectionHtml(
          interviewerName,
          reasonForRejection
        );
        await sendEmail(
          interviewerEmail,
          htmlContent,
          "Account Verification Status"
        );
      }
      return updatedInterviewer;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
