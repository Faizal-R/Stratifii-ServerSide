import { IInterviewer } from "../../models/interviewer/Interviewer"
import { Interviewer } from "../../models";
import { BaseRepository } from "../base/BaseRepository";
import { IInterviewerRepository } from "./IInterviewerRepository";
import { injectable } from "inversify";

@injectable()
export class InterviewerRepository extends BaseRepository<IInterviewer> implements IInterviewerRepository {
    constructor(){
        super(Interviewer)
    }
   async findByEmail(email: string): Promise<IInterviewer | null> {
        return await this.model.findOne({email}).exec()
    }
   async  getInterviewersWithJoinedMonth(): Promise<{ _id: number; numberOfInterviewers: number; }[]>{
      return await this.model.aggregate([
        {
            $group:{
                _id:{$month:"$createdAt"},
                numberOfInterviewers:{$sum:1}   
            }
        }
      ])
      
    }
}