import { ICompanyService } from "./ICompanyService";
import { ICompanyRepository } from "../../repositories/company/ICompanyRepository";
import { ICompany } from "../../models/company/Company";
import { CustomError } from "../../error/CustomError";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { ERROR_MESSAGES } from "../../constants/messages";
import { ICompanyProfile } from "../../validations/CompanyValidations";

export class CompanyService implements ICompanyService {
  constructor(private _companyRepository: ICompanyRepository) {}

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
    company: ICompanyProfile
  ): Promise<ICompany | null> {
    try {
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
}
