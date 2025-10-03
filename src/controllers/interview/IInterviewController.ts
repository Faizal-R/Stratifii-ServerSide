
import { Request,Response } from "express";
export interface IInterviewController{
    updateAndSubmitFeedback(request:Request,response:Response): Promise<void>
    getScheduledInterviews(request:Request,response:Response): Promise<void>
    getAllInterviewsByCandidateId(request:Request,response:Response): Promise<void>
    completeCandidateInterviewProcess(request:Request,response:Response): Promise<void>
}