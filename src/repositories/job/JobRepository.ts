import { Types } from "mongoose";
import Job, { ICandidateJob, IJob } from "../../models/job/Job";
import { BaseRepository } from "../base/BaseRepository";
import { IJobRepository } from "./IJobRepository";
import { ICandidate } from "../../models/candidate/Candidate";
import { CustomError } from "../../error/CustomError";
import { JOB_ERROR_MESSAGES,  JOB_SUCCESS_MESSAGES } from "../../constants/messages";

export class JobRepository extends BaseRepository<IJob> implements IJobRepository{
    constructor(){
        super(Job);
    }

    async addCandidatesToJob(jobId: string, candidates: {candidate: Types.ObjectId, interviewStatus: string}[]): Promise<IJob | null> {
      const updatedJob= await Job.findByIdAndUpdate(
            jobId,
            { $push: { candidates: { $each: candidates } } },
            { new: true }
        ).populate("candidates.candidate").exec();
        console.log("updatedJobInRepo",updatedJob)
        return updatedJob;
    }

    async getCandidatesByJobId(jobId: string): Promise<ICandidateJob[]> {
        const job = await Job.findById(jobId)
          .populate({
            path: "candidates.candidate",
            populate: {
              path: "companyId", // This will populate company inside candidate
              model: "Company",
            },
          })
          .exec();
      
        return job?.candidates as ICandidateJob[];
      }
      
    
      
 
}