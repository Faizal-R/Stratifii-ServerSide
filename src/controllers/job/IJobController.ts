import { Request, Response } from "express";
import { IJob } from "../../models/job/Job";

export interface IJobController{
    getAllJobs(request:Request,response:Response):Promise<void>
    getJobById(request:Request,response:Response):Promise<void>
    createJob(request:Request,response:Response):Promise<void>
    updateJob(request:Request,response:Response):Promise<void>
    deleteJob(request:Request,response:Response):Promise<void>
    createCandidatesFromResumes(request:Request,response:Response):Promise<void>
    getCandidatesByJob(request:Request,response:Response):Promise<void>
    getJobsInProgress(request:Request,response:Response):Promise<void>
    getMockQualifiedCandidatesByJob(request:Request,response:Response):Promise<void>
    getMatchedInterviewersByJobDescription(request:Request,response:Response):Promise<void>
}