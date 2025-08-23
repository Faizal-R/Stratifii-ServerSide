import { Types } from "mongoose";
import Job, { IJob } from "../../models/job/Job";
import { BaseRepository } from "../base/BaseRepository";
import { IJobRepository } from "./IJobRepository";
import { ICandidate } from "../../models/candidate/Candidate";
import { CustomError } from "../../error/CustomError";
import {
  JOB_ERROR_MESSAGES,
  JOB_SUCCESS_MESSAGES,
} from "../../constants/messages";
import DelegatedCandidate from "../../models/candidate/DelegatedCandidate";
import { injectable } from "inversify";
import { IJobStats } from "../../types/ICompanyDashboardTypes";



@injectable()
export class JobRepository
  extends BaseRepository<IJob>
  implements IJobRepository
{
  constructor() {
    super(Job);
  }

  async getJobStatsForDashboard(companyId: string): Promise<IJobStats> {
    const result= await Job.aggregate([
      {
        $match: { company: companyId },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
          },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          open: {
            $sum: { $cond: [{ $eq: ["$status", "open"] }, 1, 0] },
          },
        },
      },
    ]);
    return result[0] || { _id: null, total: 0, inProgress: 0, completed: 0, open: 0
}
}
}
