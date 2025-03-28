import { Request, Response } from "express";
import { IJob } from "../../models/job/Job";

export interface IJobController{
    getAllJobs(request:Request,response:Response):Promise<void>
    getJobById(request:Request,response:Response):Promise<void>
    createJob(request:Request,response:Response):Promise<void>
    updateJob(request:Request,response:Response):Promise<void>
    deleteJob(request:Request,response:Response):Promise<void>
}