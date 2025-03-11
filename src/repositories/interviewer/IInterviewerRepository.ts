import { IInterviewer } from "../../models/interviewer/Interviewer";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IInterviewerRepository extends IBaseRepository<IInterviewer>{
    findByEmail(email:string):Promise<IInterviewer | null>
}