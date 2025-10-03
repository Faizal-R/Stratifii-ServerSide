import { FilterQuery } from "mongoose";
import { IInterview } from "../../models/interview/Interview";
import Interview from "../../models/interview/Interview";
import { BaseRepository } from "../base/BaseRepository";
import { IInterviewRepository } from "./IInterviewRepository";

export class InterviewRepository
  extends BaseRepository<IInterview>
  implements IInterviewRepository
{
  constructor() {
    super(Interview);
  }

  async getInterviewDetails(
    query: FilterQuery<IInterview>
  ): Promise<IInterview[]> {
    return this.model
      .find(query)
      .populate("candidate")
      .populate("job")
      .populate("interviewer")
      .populate("bookedBy");
  }
  async getCompletedInterviewsPerMonth(): Promise<
    {
      _id: number;
      numberOfInterviews: number;
    }[]
  > {
    return await this.model.aggregate([
      {
        $match: { status: "completed" },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          numberOfInterviews: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }
}
