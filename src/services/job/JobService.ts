import { IJob } from "../../models/job/Job";
import { IJobService } from "./IJobService";
import { IJobRepository } from "../../repositories/job/IJobRepository";
import { CustomError } from "../../error/CustomError";
import { ERROR_MESSAGES } from "../../constants/messages";
import { HttpStatus } from "../../config/HttpStatusCodes";

export class JobService implements IJobService {
  constructor(private readonly _jobRepository: IJobRepository) {}

  getJobById(jobId: string): Promise<IJob | null> {
    throw new Error("Method not implemented.");
  }
  async getJobs(): Promise<IJob[] | []> {
    try {
      const jobs = await this._jobRepository.findAll();
      return jobs;
    } catch (error) {
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
 async updateJob(job: IJob): Promise<IJob | null> {
    try {
      const updatedJob=await this._jobRepository.update(job._id as string,job)
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
     await this._jobRepository.delete(jobId)
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
      console.log(error)
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
