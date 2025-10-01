import { IAdminRepository } from "../../repositories/admin/IAdminRepository";
import { IAdminService } from "./IAdminService";

import { CustomError } from "../../error/CustomError";
import { HttpStatus } from "../../config/HttpStatusCodes";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTokenId,
} from "../../helper/generateTokens";
import { Roles } from "../../constants/enums/roles";
import { ICompany } from "../../models/company/Company";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import { IInterviewer } from "../../models/interviewer/Interviewer";

import { sendEmail } from "../../helper/EmailService";
import {
  companyAccountRejectionHtml,
  companyAccountVerificationEmailHtml,
  interviewerAccountRejectionHtml,
  interviewerAccountVerificationEmailHtml,
} from "../../helper/wrapHtml";
import { inject, injectable } from "inversify";
import { DI_TOKENS } from "../../di/types";
import { IPaymentTransactionRepository } from "../../repositories/payment/IPaymentTransactionRepository";
import { ISubscriptionRecordRepository } from "../../repositories/subscription/subscription-record/ISubscriptionRecordRepository";
import { convertNumberToMonth } from "../../utils/convertNumberToMonth";
import { IInterviewerRepository } from "../../repositories/interviewer/IInterviewerRepository";
import { ICompanyRepository } from "../../repositories/company/ICompanyRepository";
import { CompanyMapper } from "../../mapper/company/CompanyMapper";

import {
  CompanyBasicDTO,
  CompanyResponseDTO,
} from "../../dto/response/company/CompanyResponseDTO";
import { generateSignedUrl } from "../../helper/s3Helper";
import { InterviewerResponseDTO } from "../../dto/response/interviewer/InterviewerResponseDTO";
import { InterviewerMapper } from "../../mapper/interviewer/InterviewerMapper";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(DI_TOKENS.REPOSITORIES.ADMIN_REPOSITORY)
    private readonly _adminRepository: IAdminRepository,
    @inject(DI_TOKENS.REPOSITORIES.PAYMENT_TRANSACTION_REPOSITORY)
    private readonly _paymentTransactionRepository: IPaymentTransactionRepository,
    @inject(DI_TOKENS.REPOSITORIES.SUBSCRIPTION_RECORD_REPOSITORY)
    private readonly _subscriptionRecordRepository: ISubscriptionRecordRepository,
    @inject(DI_TOKENS.REPOSITORIES.INTERVIEWER_REPOSITORY)
    private readonly _interviewerRepository: IInterviewerRepository,
    @inject(DI_TOKENS.REPOSITORIES.COMPANY_REPOSITORY)
    private readonly _companyRepository: ICompanyRepository
  ) {}
  async getAllCompanies(status: string): Promise<CompanyResponseDTO[]> {
    try {
      const companies = await this._adminRepository.getAllCompanies(status);

      if (!companies || companies.length === 0) {
        throw new CustomError(
          `No companies found with status: ${status}`,
          HttpStatus.NOT_FOUND
        );
      }

      return companies.map((company: ICompany) =>
        CompanyMapper.toResponse(company)
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Failed to fetch companies.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllInterivewers(status: string): Promise<InterviewerResponseDTO[]> {
    try {
      const interviewers =
        await this._adminRepository.getAllInterviewers(status);

      if (!interviewers || interviewers.length === 0) {
        throw new CustomError(
          `No interviewers found with status: ${status}`,
          HttpStatus.NOT_FOUND
        );
      }

      const mappedInterviewersWithResumeAttached = await Promise.all(
        interviewers.map(async (interviewer) => {
          const resumeUrl = await generateSignedUrl(interviewer.resumeKey!);

          return InterviewerMapper.toResponse(interviewer, resumeUrl as string);
        })
      );

      return mappedInterviewersWithResumeAttached;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Failed to fetch interviewers.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const admin = await this._adminRepository.findByEmail(email);
      const isPassMatch = admin?.password === password;
      console.log(admin?.password, password);
      console.log(isPassMatch);
      if (!admin || !isPassMatch) {
        throw new CustomError(
          "Incorrect Email or password",
          HttpStatus.BAD_REQUEST
        );
      }
      const accessToken = await generateAccessToken({
        userId: admin._id as string,
        role: Roles.ADMIN,
      });

      const refreshToken = generateRefreshToken({
        userId: admin._id as string,
        role: Roles.ADMIN,
        jti: generateTokenId(),
      });
      return { accessToken, refreshToken };
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

  async updateCompanyStatus(
    companyId: string
  ): Promise<CompanyResponseDTO | null> {
    try {
      const updatedCompany =
        await this._adminRepository.updateCompanyStatus(companyId);
      return CompanyMapper.toResponse(updatedCompany!);
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
      const updatedInviewer =
        await this._adminRepository.updateInterviewerStatus(interviewerId);
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
    isApproved: boolean,
    reasonForRejection?: string
  ): Promise<ICompany | null> {
    try {
      const updatedCompany =
        await this._adminRepository.updateCompanyVerificationStatus(
          companyId,
          isApproved
        );
      if (!isApproved) {
        const htmlContent = companyAccountRejectionHtml(
          updatedCompany?.name as string,
          reasonForRejection
        );
        await sendEmail(
          updatedCompany?.email as string,
          htmlContent,
          "Account Verification Status"
        );
      } else {
        const htmlContent = companyAccountVerificationEmailHtml(
          updatedCompany?.name as string
        );
        await sendEmail(
          updatedCompany?.email as string,
          htmlContent,
          "Account Verification Status"
        );
      }

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
      } else {
        const htmlContent =
          interviewerAccountVerificationEmailHtml(interviewerName);
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
  async getAdminDashboard(): Promise<{
    keyMetrics: {
      activeCompanies: number;
      totalInterviewers: number;
      totalRevenue: number;
      totalActiveSubscription: number;
    };
    monthlyRevenue: {
      month: string;
      interviews: number;
      subscriptions: number;
      total: number;
    }[];
    monthlyUserGrowth: {
      month: string;
      companies: number;
      interviewers: number;
    }[];
    subscriptionDistribution: {
      name: string;
      value: number;
    }[];
    recentCompanies: CompanyBasicDTO[];
  }> {
    const activeCompanies = (
      await this._adminRepository.getAllCompanies("approved")
    ).length;

    const totalInterviewers = (
      await this._adminRepository.getAllInterviewers("approved")
    ).length;

    const totalRevenueFromInterview =
      await this._paymentTransactionRepository.getTotalRevenueFromInterview();
    const totalActiveSubscription = (
      await this._subscriptionRecordRepository.find({ status: "active" })
    ).length;

    //subscription and interview revenue with month
    const subscriptionRevenue =
      await this._subscriptionRecordRepository.getTotalSubscriptionRevenueWithMonth();
    const interviewRevenue =
      await this._paymentTransactionRepository.getTotalRevenueFromInterviewWithMonth();
    console.log("interviewRevenueWithMonth", interviewRevenue);
    const monthlyRevenue = [];
    for (let i = 1; i <= 12; i++) {
      monthlyRevenue.push({
        month: convertNumberToMonth(i),
        subscriptions:
          subscriptionRevenue.find((r) => r._id === i)?.totalRevenue || 0,
        interviews:
          interviewRevenue.find((r) => r._id === i)?.totalRevenue || 0,
        total:
          (subscriptionRevenue.find((r) => r._id === i)?.totalRevenue || 0) +
          (interviewRevenue.find((r) => r._id === i)?.totalRevenue || 0),
      });
    }
    console.log("monthlyRevenue", monthlyRevenue);

    const getInterviewersWithJoinedMonth =
      await this._interviewerRepository.getInterviewersWithJoinedMonth();

    const getCompaniesWithJoinedMonth =
      await this._companyRepository.getCompaniesWithJoinedMonth();

    const monthlyUserGrowth = [];
    for (let i = 1; i <= 12; i++) {
      monthlyUserGrowth.push({
        month: convertNumberToMonth(i),
        interviewers:
          getInterviewersWithJoinedMonth.find((r) => r._id === i)
            ?.numberOfInterviewers || 0,
        companies:
          getCompaniesWithJoinedMonth.find((r) => r._id === i)
            ?.numberOfCompanies || 0,
      });
    }

    const subscriptionDistribution =
      await this._subscriptionRecordRepository.getSubscriptionDistribution();
    console.log("subscriptionDistribution", subscriptionDistribution);

    const recentCompanies = await this._companyRepository.find({}, 5, {
      createdAt: -1,
    });

    const recentCompanyWithLogoAttached = await Promise.all(
      recentCompanies.map(async (company) => {
        const companyLogoUrl = await generateSignedUrl(company.companyLogoKey!);
        return CompanyMapper.toSummary(company, companyLogoUrl);
      })
    );
    return {
      keyMetrics: {
        activeCompanies,
        totalInterviewers,
        totalRevenue: totalRevenueFromInterview,
        totalActiveSubscription,
      },
      monthlyRevenue,
      monthlyUserGrowth,
      subscriptionDistribution,
      recentCompanies: recentCompanyWithLogoAttached,
    };
  }
}
