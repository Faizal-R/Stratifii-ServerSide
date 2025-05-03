import { IInterviewer } from "../../models/interviewer/Interviewer";
import { IInterviewerProfile } from "../../validations/InterviewerValidations";
export interface IInterviewerService{
    getInterviewerById(interviewerId: string): Promise<IInterviewer | null>;
    updateInterviewerProfile(interviewerId:string,company: IInterviewerProfile): Promise<IInterviewer|null>;
     changePassword(currentPassword:string,newPassword:string,interviewerId:string): Promise<IInterviewer|null>;
}
