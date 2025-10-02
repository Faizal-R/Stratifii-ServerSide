import { IJob } from "../../models/job/Job";
import { Types } from "mongoose";
import { IInterviewSlot } from "../../models/slot/interviewSlot";
import { DelegatedCandidateForCompanyDTO } from "../../dto/response/candidate/DelegatedCandidateResponseDTO";
import { InterviewerResponseDTO } from "../../dto/response/interviewer/InterviewerResponseDTO";

export interface IJobService {
  createJob(job: IJob): Promise<IJob>;

  getJobs(company: string): Promise<IJob[] | []>;
  updateJob(job: IJob): Promise<IJob | null>;
  deleteJob(jobId: string): Promise<boolean>;
  createCandidatesFromResumes(
    jobId: Types.ObjectId,
    resumes: Express.Multer.File[],
    companyId: Types.ObjectId
  ): Promise<
    DelegatedCandidateForCompanyDTO[] | DelegatedCandidateForCompanyDTO
  >;
  getCandidatesByJob(
    jobId: string
  ): Promise<{
    candidates: DelegatedCandidateForCompanyDTO[];
    jobPaymentStatus: string | null;
  }>;

  getJobsInProgress(
    company: string
  ): Promise<{ job: IJob; qualifiedCandidatesCount: number }[]>;
  getMockQualifiedCandidatesByJob(
    job: string
  ): Promise<DelegatedCandidateForCompanyDTO[] | []>;
  getMatchedInterviewersByJobDescription(
    jobId: string
  ): Promise<
    { interviewer: InterviewerResponseDTO; slots: IInterviewSlot[] }[] | []
  >;
}
