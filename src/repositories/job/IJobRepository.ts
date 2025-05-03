import { Types } from "mongoose";
import { ICandidateJob, IJob } from "../../models/job/Job";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IJobRepository extends IBaseRepository<IJob>{
    addCandidatesToJob(jobId: string, candidates: {candidate:Types.ObjectId,interviewStatus:string}[]): Promise<IJob|null>;
    getCandidatesByJobId(jobId: string): Promise<ICandidateJob[]>;
}