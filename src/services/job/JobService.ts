import { IJob } from "../../models/job/Job";
import { IJobService } from "./IJobService";
import { IJobRepository } from "../../repositories/job/IJobRepository";
import { CustomError } from "../../error/CustomError";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import { HttpStatus } from "../../config/HttpStatusCodes";
import extractDetailsFromPDF from "../../utils/extractDetailsFromPDF";
import { uploadOnCloudinary } from "../../helper/cloudinary";
import { ICandidateRepository } from "../../repositories/candidate/ICandidateRepository";
import { Types } from "mongoose";
import { IDelegatedCandidateRepository } from "../../repositories/candidate/candidateDelegation/IDelegatedCandidateRepository";
import { inject, injectable } from "inversify";
import { DiRepositories } from "../../di/types";
import { stat } from "fs";

injectable();
export class JobService implements IJobService {
  constructor(
    @inject(DiRepositories.JobRepository)
    private readonly _jobRepository: IJobRepository,

    @inject(DiRepositories.CandidateRepository)
    private readonly _candidateRepository: ICandidateRepository,

    @inject(DiRepositories.DelegatedCandidateRepository)
    private readonly _delegatedCandidateRepository: IDelegatedCandidateRepository
  ) {}

  getJobById(jobId: string): Promise<IJob | null> {
    throw new Error("Method not implemented.");
  }
  async getJobs(company: string, status?: string): Promise<IJob[] | []> {
    try {
      let jobs;
      if (status === "1") {
        jobs = await this._jobRepository.findAll({ company });
      } else {
        jobs = await this._jobRepository.findAll({ company, status });
      }

      return jobs;
    } catch (error) {
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async updateJob(job: Partial<IJob>): Promise<IJob | null> {
    try {
      const updatedJob = await this._jobRepository.update(
        job._id as string,
        job
      );
      return updatedJob;
    } catch (error) {
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async deleteJob(jobId: string): Promise<boolean> {
    try {
      await this._jobRepository.delete(jobId);
      return true;
    } catch (error) {
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createJob(job: IJob): Promise<IJob> {
    try {
      const createdJob = await this._jobRepository.create(job);
      return createdJob;
    } catch (error) {
      console.log(error);
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createCandidatesFromResumesAndAddToJob(
    jobId: Types.ObjectId,
    resumes: Express.Multer.File[],
    companyId: Types.ObjectId
  ): Promise<Types.ObjectId[]> {
    const addedDelegations: Types.ObjectId[] = [];

    try {
      for (let resume of resumes) {
        const candidateData = await extractDetailsFromPDF(resume.path);
        const resumeUrl = await uploadOnCloudinary(resume.path, "raw");

        // Check if candidate already exists
        let candidate = await this._candidateRepository.findByEmail(
          candidateData.email
        );

        if (!candidate) {
          candidate = await this._candidateRepository.create({
            ...candidateData,
            resume: resumeUrl,
            status: "pending",
            isBlocked: false,
          });
        }

        // Check if already delegated to this job
        const alreadyDelegated =
          await this._delegatedCandidateRepository.findOne({
            candidate: candidate._id,
            job: jobId,
            company: companyId,
          });

        if (!alreadyDelegated) {
          const delegation = await this._delegatedCandidateRepository.create({
            candidate: candidate._id as Types.ObjectId,
            company: companyId,
            job: jobId,
            status: "mock_pending",
          });

          addedDelegations.push(delegation._id as Types.ObjectId);
        }
      }

      return addedDelegations;
    } catch (error) {
      console.error("Error in createCandidatesFromResumesAndAddToJob:", error);
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  getCandidatesByJobId(jobId: string): Promise<any[] | []> {
    try {
      const candidates =
        this._delegatedCandidateRepository.getCandidatesByJobId(jobId);
      if (!candidates) {
        throw new CustomError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      return candidates;
    } catch (error) {
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
