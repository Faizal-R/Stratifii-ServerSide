import { Types } from "mongoose";
import Job, {  IJob } from "../../models/job/Job";
import { BaseRepository } from "../base/BaseRepository";
import { IJobRepository } from "./IJobRepository";
import { ICandidate } from "../../models/candidate/Candidate";
import { CustomError } from "../../error/CustomError";
import { JOB_ERROR_MESSAGES,  JOB_SUCCESS_MESSAGES } from "../../constants/messages";
import DelegatedCandidate from "../../models/candidate/DelegatedCandidate";
import { injectable } from "inversify";

@injectable()
export class JobRepository extends BaseRepository<IJob> implements IJobRepository{
    constructor(){
        super(Job);
    }


 
}