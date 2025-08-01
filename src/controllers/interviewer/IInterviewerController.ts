import { Request, Response } from "express";

export interface IInterviewerController{
    getInterviewerProfile(request: Request, response: Response): Promise<void>;
    updateInterviewerProfile(request: Request, response: Response): Promise<void>;
    changePassword(request: Request, response: Response): Promise<void>;
    getSlotsByInterviewerId(request: Request, response: Response): Promise<void>;
    generateSlots(request: Request, response: Response): Promise<void>;
    
}