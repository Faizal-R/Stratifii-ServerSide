import { IInterviewer } from "../../interfaces/IInterviewerModel";

export interface IInterviewerRepository{
    findByEmail(email:string):Promise<IInterviewer | null>
}