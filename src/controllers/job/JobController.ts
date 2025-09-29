import { Request, Response } from "express";
import { IJob } from "../../models/job/Job";
import { IJobService } from "../../services/job/IJobService";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { JOB_SUCCESS_MESSAGES } from "../../constants/enums/messages";
import { IJobController } from "./IJobController";
import mongoose from "mongoose";
import { inject, injectable } from "inversify";
import { DI_TOKENS } from "../../di/types";

@injectable()
export class JobController implements IJobController {
  constructor(
    @inject(DI_TOKENS.SERVICES.JOB_SERVICE)
    private readonly _jobService: IJobService
  ) {}

  async getAllJobs(request: Request, response: Response): Promise<void> {
    const companyId = request.user?.userId;

    try {
      const jobs = await this._jobService.getJobs(companyId!);

      createResponse(
        response,
        HttpStatus.OK,
        true,
        JOB_SUCCESS_MESSAGES.JOB_FETCHED,
        jobs
      );
    } catch (error) {
      console.log(error);
      errorResponse(response, error);
    }
  }

  async createJob(request: Request, response: Response): Promise<void> {
    try {
      const jobData: IJob = { ...request.body, company: request.user?.userId };
      console.log(jobData);
      const job = await this._jobService.createJob(jobData);
      console.log(job);
      createResponse(
        response,
        HttpStatus.CREATED,
        true,
        JOB_SUCCESS_MESSAGES.JOB_CREATED,
        job
      );
    } catch (error) {
      console.log(error);
      errorResponse(response, error);
    }
  }

  async updateJob(request: Request, response: Response): Promise<void> {
    console.log(request.body);
    // console.log(job);
    try {
      const updatedJob = await this._jobService.updateJob(request.body);
      console.log(updatedJob);
      createResponse(
        response,
        HttpStatus.OK,
        true,
        JOB_SUCCESS_MESSAGES.JOB_UPDATED
      );
    } catch (error) {
      console.log(error);
      errorResponse(response, error);
    }
  }
  async deleteJob(request: Request, response: Response): Promise<void> {
    const { jobId } = request.params;
    console.log(jobId);
    try {
      await this._jobService.deleteJob(jobId);
      createResponse(
        response,
        HttpStatus.OK,
        true,
        JOB_SUCCESS_MESSAGES.JOB_DELETED
      );
    } catch (error) {
      console.log(error);
      errorResponse(response, error);
    }
  }

  async createCandidatesFromResumes(
    request: Request,
    response: Response
  ): Promise<void> {
    const { jobId: SJobId } = request.params;
    console.log(SJobId, request.params);
    const resumes = request.files as Express.Multer.File[];
    try {
      const companyId = new mongoose.Types.ObjectId(request.user?.userId);
      const jobId = new mongoose.Types.ObjectId(SJobId);
      console.log(resumes);
      const candidates = await this._jobService.createCandidatesFromResumes(
        jobId,
        resumes,
        companyId
      );
      console.log(candidates);
      createResponse(
        response,
        HttpStatus.CREATED,
        true,
        JOB_SUCCESS_MESSAGES.CREATED_CANDIDATES_ADDED_TO_JOB,
        candidates
      );
    } catch (error) {
      console.log(error);
      errorResponse(response, error);
    }
  }

  async getCandidatesByJob(
    request: Request,
    response: Response
  ): Promise<void> {
    const { jobId } = request.params;
    try {
      const candidates = await this._jobService.getCandidatesByJob(jobId);

      createResponse(
        response,
        HttpStatus.OK,
        true,
        JOB_SUCCESS_MESSAGES.CANDIDATES_FETCHED,
        candidates
      );
    } catch (error) {
      console.log(error);
      errorResponse(response, error);
    }
  }

  async getJobsInProgress(request: Request, response: Response): Promise<void> {
    console.log(request.user?.userId);

    try {
      const jobs = await this._jobService.getJobsInProgress(
        request.user?.userId!
      );
      console.log(jobs);
      createResponse(
        response,
        HttpStatus.OK,
        true,
        JOB_SUCCESS_MESSAGES.JOB_FETCHED,
        jobs
      );
    } catch (error) {
      console.log(error);
      errorResponse(response, error);
    }
  }

  async getMockQualifiedCandidatesByJob(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const job = request.params.jobId;
      console.log(job);
      console.log("entered GetMockQualified");
      const candidates = await this._jobService.getMockQualifiedCandidatesByJob(
        job!
      );
      console.log(candidates);
      createResponse(
        response,
        HttpStatus.OK,
        true,
        JOB_SUCCESS_MESSAGES.CANDIDATES_FETCHED,
        candidates
      );
    } catch (error) {
      console.log(error);
      errorResponse(response, error);
    }
  }
  async getMatchedInterviewersByJobDescription(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const job = request.params.jobId;
      console.log(job);
      console.log("entered GetMockQualified");
      const candidates =
        await this._jobService.getMatchedInterviewersByJobDescription(job!);
      console.log(candidates);
      createResponse(
        response,
        HttpStatus.OK,
        true,
        JOB_SUCCESS_MESSAGES.CANDIDATES_FETCHED,
        candidates
      );
    } catch (error) {
      console.log(error);
      errorResponse(response, error);
    }
  }
}
