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
import { ISubscriptionRecordRepository } from "../../repositories/subscription/subscription-record/ISubscriptionRecordRepository";
import { convertNumberToMonth } from "../../utils/convertNumberToMonth";
import { ISubscriptionRecord } from "../../models/subscription/SubscriptionRecord";
import { JobMapper } from "../../mapper/job/JobMapper";
import { PaymentTransactionBasicDTO } from "../../dto/response/payment/PaymentTransactionDTO";
import { PaymentMapper } from "../../mapper/payment/PaymentMapper";

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
    private readonly _paymentTransactionRepository: IPaymentTransactionRepository,
    @inject(DI_TOKENS.REPOSITORIES.SUBSCRIPTION_RECORD_REPOSITORY)
    private readonly _subscriptionRecordRepository: ISubscriptionRecordRepository
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
    monthlySpend: {
      month: string;
      subscription: number;
      interviews: number;
    }[];
  }> {
    const jobs = await this._jobRepository.find({ company: companyId });
    const candidates = await this._delegatedCandidateRepository.find({
      company: companyId,
    });
    const payments = await this._paymentTransactionRepository.find({
      company: companyId,
    });
    const spendsOnSubscription =
      await this._subscriptionRecordRepository.getTotalSubscriptionRevenueOfCompanyWithMonth(
        companyId
      );
  
    const amountSpendOnInterviews =
      await this._paymentTransactionRepository.getCompaniesTotalAmountSpendOnInterviewsPerMonth(
        companyId
      );
   
    const monthlySpendOnSubscriptionAndInterviews = [];
    for (let i = 1; i <= 12; i++) {
      monthlySpendOnSubscriptionAndInterviews.push({
        month: convertNumberToMonth(i),
        subscription:
          spendsOnSubscription.find((item) => item._id === i)?.totalRevenue ||
          0,
        interviews:
          amountSpendOnInterviews.find((item) => item._id === i)
            ?.totalRevenue || 0,
      });
    }
  
 

    return {
      jobs,
      candidates,
      payments,
      monthlySpend: monthlySpendOnSubscriptionAndInterviews,
    };
  }

  async getCompanyPaymentHistory(companyId: string): Promise<{
    subscriptionPayments: ISubscriptionRecord[];
    interviewProcessPayments: PaymentTransactionBasicDTO[];
    totalSpendOnInterview: number;
    totalSpendOnSubscription?: number;
  }> {
    try {
      const subscriptionPayments =
        await this._subscriptionRecordRepository.find({
          subscriberId: companyId,
        });
   
      const interviewProcessPayments =
        await this._paymentTransactionRepository.getPaymentTransactionsDetailsByCompanyId(
          companyId
        );

      const mappedInterviewProcessPayments = interviewProcessPayments.map(
        (payment: IPaymentTransaction) => {
          return PaymentMapper.toSummary(payment);
        }
      );
      const totalAmountSpendOnInterview =
        await this._paymentTransactionRepository.getTotalAmountSpendOnInterviewsByCompany(
          companyId
        );
      const totalAmountSpendOnSubscription =
        await this._subscriptionRecordRepository.getTotalAmountSpendOnSubscriptionByCompany(
          companyId
        );
     

      return {
        subscriptionPayments,
        interviewProcessPayments: mappedInterviewProcessPayments,
        totalSpendOnInterview: totalAmountSpendOnInterview,
        totalSpendOnSubscription: totalAmountSpendOnSubscription,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "An error occurred while fetching payment history",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
