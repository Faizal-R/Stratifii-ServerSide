import { IInterviewer } from "../../models/interviewer/Interviewer";

export interface IInterviewerService{
    getInterviewerById(interviewerId: string): Promise<IInterviewer | null>;
    updateInterviewerProfile(interviewerId:string,interviewer: any,avatar?: Express.Multer.File,resume?: Express.Multer.File): Promise<IInterviewer|null>;
     changePassword(currentPassword:string,newPassword:string,interviewerId:string): Promise<IInterviewer|null>;
}
