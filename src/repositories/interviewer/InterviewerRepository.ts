import { IInterviewer } from "../../models/interviewer/Interviewer"
import { Interviewer } from "../../models";
import { BaseRepository } from "../base/BaseRepository";
import { IInterviewerRepository } from "./IInterviewerRepository";

export class InterviewerRepository extends BaseRepository<IInterviewer> implements IInterviewerRepository {
    constructor(){
        super(Interviewer)
    }
   async findByEmail(email: string): Promise<IInterviewer | null> {
        return Interviewer.findOne({email}).exec()
    }
}