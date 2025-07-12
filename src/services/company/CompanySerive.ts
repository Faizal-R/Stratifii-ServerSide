import { ICompanyService } from "./ICompanyService";
import { ICompanyRepository } from "../../repositories/company/ICompanyRepository";
import { ICompany } from "../../models/company/Company";
import { CustomError } from "../../error/CustomError";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import { ICompanyProfile } from "../../validations/CompanyValidations";
import { uploadOnCloudinary } from "../../helper/cloudinary";
import { comparePassword, hashPassword } from "../../utils/hash";
import { USER_COMMON_MESSAGES } from "../../constants/messages/UserProfileMessages";
import { inject, injectable } from "inversify";
import { DI_REPOSITORIES } from "../../di/types";

@injectable()
export class CompanyService implements ICompanyService {
  constructor(
    @inject(DI_REPOSITORIES.COMPANY_REPOSITORY)
    private _companyRepository: ICompanyRepository
  ) {}

  async getCompanyById(companyId: string): Promise<ICompany | null> {
    try {
      const company = await this._companyRepository.findById(companyId);
      if (!company)
        throw new CustomError("Company not found", HttpStatus.NOT_FOUND);
      return company;
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
  async updateCompanyProfile(
    companyId: string,
    company: ICompanyProfile,
    companyLogoFile?: Express.Multer.File
  ): Promise<ICompany | null> {
    try {
      if (companyLogoFile) {
        const uploadedLogoUrl = await uploadOnCloudinary(companyLogoFile.path);
        company.companyLogo = uploadedLogoUrl;
      }
      const updatedCompany = await this._companyRepository.update(
        companyId,
        company
      );
      return updatedCompany;
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
  async changePassword(
    currentPassword: string,
    newPassword: string,
    companyId: string
  ): Promise<ICompany | null> {
    try {
      const company = await this._companyRepository.findById(companyId);
      if (!company || !comparePassword(currentPassword, company.password)) {
        throw new CustomError(
          USER_COMMON_MESSAGES.CURRENT_PASSWORD_INCORRECT,
          HttpStatus.BAD_REQUEST
        );
      }
      const hashedPassword = await hashPassword(newPassword);
      const updatedCompany = await this._companyRepository.update(companyId, {
        password: hashedPassword,
      });
      return updatedCompany;
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
}
