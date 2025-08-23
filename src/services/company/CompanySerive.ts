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
import { DiRepositories } from "../../di/types";
import { IDelegatedCandidateRepository } from "../../repositories/candidate/candidateDelegation/IDelegatedCandidateRepository";
import { IJobRepository } from "../../repositories/job/IJobRepository";

@injectable()
export class CompanyService implements ICompanyService {
  constructor(
    @inject(DiRepositories.CompanyRepository)
    private _companyRepository: ICompanyRepository,
    @inject(DiRepositories.DelegatedCandidateRepository)
    private _delegatedCandidateRepository: IDelegatedCandidateRepository,
    @inject(DiRepositories.JobRepository)
    private readonly _jobRepository: IJobRepository
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

  async getCompanyDashboard(companyId: string): Promise<any> {
    try {
      // const jobMetrics = await this._jobRepository.getJobStatsForDashboard(
      //   companyId
      // );
      // console.log("jobMetrics", jobMetrics);

      const AllJobs= await this._jobRepository.find({company:companyId});
      const totalJobsCount=AllJobs.length;

      const openJobsCount=AllJobs.filter((job)=>job.status==="open").length;
      const inProgressJobs=AllJobs.filter((job)=>job.status==="in-progress").length;
      const completedJobs=AllJobs.filter((job)=>job.status==="completed").length;
      const jobMetrics = {
        total: totalJobsCount,
        open: openJobsCount,
        inProgress: inProgressJobs,
        completed: completedJobs,
      };

      const totalDelegatedCandidates =
        await this._delegatedCandidateRepository.find({ company: companyId });
      const totalDelegatedCandidatesCount = totalDelegatedCandidates.length;
      const interviewedCandidatesCount = totalDelegatedCandidates.filter(
        (candidate) => candidate.status === "final_completed"
      ).length;
      const shortlistedCandidatesCount = totalDelegatedCandidates.filter(
        (candidate) => candidate.status === "shortlisted"
      ).length;
      const rejectedCandidatesCount = totalDelegatedCandidates.filter(
        (candidate) => candidate.status === "rejected"
      ).length;
      const mockPendingCandidatesCount = totalDelegatedCandidates.filter(
        (candidate) => candidate.status === "mock_pending"
      ).length;

      const candidateMetrics = {
        total: totalDelegatedCandidatesCount,
        finalCompleted: interviewedCandidatesCount,
        shortlisted: shortlistedCandidatesCount,
        rejected: rejectedCandidatesCount,
        mockPending: mockPendingCandidatesCount,
      };

      return {
        jobMetrics,
        candidateMetrics: candidateMetrics,
      };
    } catch (error) {}
  }
}
