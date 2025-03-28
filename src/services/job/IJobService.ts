import { IJob } from "../../models/job/Job";

export interface IJobService {
    createJob(job: IJob): Promise<IJob>;
    getJobById(jobId: string): Promise<IJob | null>;
    getJobs(): Promise<IJob[]|[]>;
    updateJob(job: IJob): Promise<IJob | null>;
    deleteJob(jobId: string): Promise<boolean>;
}