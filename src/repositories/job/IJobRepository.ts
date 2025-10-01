
import {  IJob } from "../../models/job/Job";
import { IBaseRepository } from "../base/IBaseRepository";

import { IJobStats } from "../../types/ICompanyDashboardTypes";

export interface IJobRepository extends IBaseRepository<IJob>{
 getJobStatsForDashboard(companyId: string): Promise<IJobStats>
}