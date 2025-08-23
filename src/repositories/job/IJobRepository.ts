import { Types } from "mongoose";
import {  IJob } from "../../models/job/Job";
import { IBaseRepository } from "../base/IBaseRepository";
import { ICandidate } from "../../models/candidate/Candidate";
import { IJobStats } from "../../types/ICompanyDashboardTypes";

export interface IJobRepository extends IBaseRepository<IJob>{
 getJobStatsForDashboard(companyId: string): Promise<IJobStats>
}