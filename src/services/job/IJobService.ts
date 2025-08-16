import { Multer } from "multer";
import {  IJob } from "../../models/job/Job";
import { Types } from "mongoose";
import { ICandidate } from "../../models/candidate/Candidate";
import { IDelegatedCandidate } from "../../models/candidate/DelegatedCandidate";
import { IInterviewer } from "../../models/interviewer/Interviewer";
import { IInterviewSlot } from "../../models/slot/interviewSlot";

export interface IJobService {
  createJob(job: IJob): Promise<IJob>;
  getJobById(jobId: string): Promise<IJob | null>;
  getJobs(company: string): Promise<IJob[] | []>;
  updateJob(job: IJob): Promise<IJob | null>;
  deleteJob(jobId: string): Promise<boolean>;
 createCandidatesFromResumes(
    jobId: Types.ObjectId,
    resumes: Express.Multer.File[],
    companyId: Types.ObjectId
  ): Promise<IDelegatedCandidate[]|IDelegatedCandidate|null>
  getCandidatesByJob(jobId: string): Promise<IDelegatedCandidate[] | []>;

  getJobsInProgress(company: string): Promise<{ job: IJob; qualifiedCandidatesCount: number }[]>
  getMockQualifiedCandidatesByJob(job:string):Promise<IDelegatedCandidate[]|[]>
  getMatchedInterviewersByJobDescription(jobId: string): Promise<{interviewer:IInterviewer,slots:IInterviewSlot[]}[] | []>
}
