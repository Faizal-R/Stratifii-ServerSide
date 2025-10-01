import { ICompanyService } from "./ICompanyService";
import { ICompanyRepository } from "../../repositories/company/ICompanyRepository";

import { CustomError } from "../../error/CustomError";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import { ICompanyProfile } from "../../validations/CompanyValidations";

import { comparePassword, hashPassword } from "../../utils/hash";
import { USER_COMMON_MESSAGES } from "../../constants/messages/UserProfileMessages";
import { inject, injectable } from "inversify";
import { DI_TOKENS } from "../../di/types";
import { IDelegatedCandidateRepository } from "../../repositories/candidate/candidateDelegation/IDelegatedCandidateRepository";
import { IJobRepository } from "../../repositories/job/IJobRepository";
import { CompanyMapper } from "../../mapper/company/CompanyMapper";
import {
  CompanyBasicDTO,
  CompanyResponseDTO,
} from "../../dto/response/company/CompanyResponseDTO";
import { IJob } from "../../models/job/Job";
import { IDelegatedCandidate } from "../../models/candidate/DelegatedCandidate";
import { IPaymentTransactionRepository } from "../../repositories/payment/IPaymentTransactionRepository";
import { IPaymentTransaction } from "../../models/payment/PaymentTransaction";
import { generateSignedUrl, uploadFileToS3 } from "../../helper/s3Helper";

@injectable()
export class CompanyService implements ICompanyService {
  constructor(
    @inject(DI_TOKENS.REPOSITORIES.COMPANY_REPOSITORY)
    private readonly _companyRepository: ICompanyRepository,

    @inject(DI_TOKENS.REPOSITORIES.DELEGATED_CANDIDATE_REPOSITORY)
    private readonly _delegatedCandidateRepository: IDelegatedCandidateRepository,

    @inject(DI_TOKENS.REPOSITORIES.JOB_REPOSITORY)
    private readonly _jobRepository: IJobRepository,
    @inject(DI_TOKENS.REPOSITORIES.PAYMENT_TRANSACTION_REPOSITORY)
    private readonly _paymentTransactionRepository: IPaymentTransactionRepository
  ) {}

  async getCompanyProfile(
    companyId: string
  ): Promise<CompanyResponseDTO | null> {
    try {
      const company = await this._companyRepository.findById(companyId);
      if (!company)
        throw new CustomError("Company not found", HttpStatus.NOT_FOUND);
      const companyLogo = await generateSignedUrl(company.companyLogoKey!);
      return CompanyMapper.toResponse(company, companyLogo);
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
  ): Promise<CompanyResponseDTO | null> {
    try {
      if (companyLogoFile) {
        const companyLogoKey = await uploadFileToS3(companyLogoFile);
        company.companyLogoKey = companyLogoKey;
      }
      const updatedCompany = await this._companyRepository.update(
        companyId,
        company
      );
      const companyLogo = await generateSignedUrl(company.companyLogoKey!);
      return CompanyMapper.toResponse(updatedCompany!, companyLogo);
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
  ): Promise<CompanyBasicDTO | null> {
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
      return CompanyMapper.toSummary(updatedCompany!);
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

  async getCompanyDashboard(companyId: string): Promise<{
    jobs: IJob[];
    candidates: IDelegatedCandidate[];
    payments: IPaymentTransaction[];
  }> {

      const jobs = await this._jobRepository.find({ company: companyId });
      const candidates = await this._delegatedCandidateRepository.find({
        company: companyId,
      });
      const payments = await this._paymentTransactionRepository.find({
        company: companyId,
      });

      return {
        jobs,
        candidates,
        payments,
      };
    
  }
}
