import Job, { IJob } from "../../models/job/Job";
import { BaseRepository } from "../base/BaseRepository";
import { IJobRepository } from "./IJobRepository";

export class JobRepository extends BaseRepository<IJob> implements IJobRepository{
    constructor(){
        super(Job);
    }
 
}