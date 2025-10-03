import { FilterQuery } from "mongoose";
import { IInterview } from "../../models/interview/Interview";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IInterviewRepository extends IBaseRepository<IInterview> {
  getInterviewDetails(query: FilterQuery<IInterview>): Promise<IInterview[]>;
  getCompletedInterviewsPerMonth(): Promise<
    {
      _id: number;
      numberOfInterviews: number;
    }[]
  >
}
