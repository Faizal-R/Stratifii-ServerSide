import { Request, Response } from "express";

export interface IInterviewerController{
    getInterviewerProfile(request: Request, response: Response): Promise<void>;
    updateInterviewerProfile(request: Request, response: Response): Promise<void>;
    changePassword(request: Request, response: Response): Promise<void>;
    createSlotGenerationRule(request: Request, response: Response): Promise<void>;
    getSlotsByRule(
    request: Request,
    response: Response
  ): Promise<void>
  getInterviewerSlotGenerationRule(request: Request, response: Response): Promise<void>
    
}