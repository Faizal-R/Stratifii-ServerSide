import { ICandidateJob, IJob } from "../../models/job/Job";
import { IJobService } from "./IJobService";
import { IJobRepository } from "../../repositories/job/IJobRepository";
import { CustomError } from "../../error/CustomError";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import { HttpStatus } from "../../config/HttpStatusCodes";
import extractDetailsFromPDF from "../../utils/extractDetailsFromPDF";
import { uploadOnCloudinary } from "../../helper/cloudinary";
import { ICandidateRepository } from "../../repositories/candidate/ICandidateRepository";
import { Types } from "mongoose";

export class JobService implements IJobService {
  constructor(
    private readonly _jobRepository: IJobRepository,
    private readonly _candidateRepository: ICandidateRepository
  ) {}

  getJobById(jobId: string): Promise<IJob | null> {
    throw new Error("Method not implemented.");
  }
  async getJobs(company: string): Promise<IJob[] | []> {
    try {
      const jobs = await this._jobRepository.findAll({ company });
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
    jobId: string,
    resumes: Express.Multer.File[],
    companyId: Types.ObjectId
  ): Promise<ICandidateJob[]> {
    const candidates = [];
    try {
      for (let resume of resumes) {
        const candidateData = await extractDetailsFromPDF(resume.path);
        const resumeUrl = await uploadOnCloudinary(resume.path, "raw");
        const candidate = await this._candidateRepository.create({
          ...candidateData,
          resume: resumeUrl,
          companyId,
          status: "pending",
          isBlocked: false,
        });
        candidates.push({
          candidate: candidate._id as Types.ObjectId,
          interviewStatus: "pending",
        });
      }
      console.log("candidates in the service", candidates);
      const updatedJob = await this._jobRepository.addCandidatesToJob(
        jobId,
        candidates
      );
      console.log(updatedJob);
      return updatedJob?.candidates!;
    } catch (error) {
      console.log(error);
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  getCandidatesByJobId(jobId: string): Promise<ICandidateJob[] | []> {
    try {
      const candidates = this._jobRepository.getCandidatesByJobId(jobId);
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
