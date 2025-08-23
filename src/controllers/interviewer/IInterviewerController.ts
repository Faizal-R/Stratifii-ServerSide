import { Request, Response } from "express";

export interface IInterviewerController{
    getInterviewerProfile(request: Request, response: Response): Promise<void>;
    updateInterviewerProfile(request: Request, response: Response): Promise<void>;
    changePassword(request: Request, response: Response): Promise<void>;
  getUpcomingInterviews(request: Request, response: Response): Promise<void>
    
}