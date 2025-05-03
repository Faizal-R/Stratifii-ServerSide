import { Multer } from "multer";
import { ICandidateJob, IJob } from "../../models/job/Job";
import { Types } from "mongoose";
import { ICandidate } from "../../models/candidate/Candidate";

export interface IJobService {
  createJob(job: IJob): Promise<IJob>;
  getJobById(jobId: string): Promise<IJob | null>;
  getJobs(company: string): Promise<IJob[] | []>;
  updateJob(job: IJob): Promise<IJob | null>;
  deleteJob(jobId: string): Promise<boolean>;
  createCandidatesFromResumesAndAddToJob(
    jobId: string,
    resumes: Express.Multer.File[],
    companyId: Types.ObjectId
  ): Promise<ICandidateJob[]>;
  getCandidatesByJobId(jobId: string): Promise<ICandidateJob[] | []>;
}
