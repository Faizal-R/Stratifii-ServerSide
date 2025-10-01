import { Request, Response } from "express";


export interface ISlotController {
    bookSlotForCandidate (request:Request,response:Response):Promise<void>;
    createSlotGenerationRule(
    request: Request,
    response: Response
  ): Promise<void>;
    getSlotsByRule(
      request: Request,
      response: Response
    ): Promise<void>;
    getInterviewerSlotGenerationRule(
      request: Request,
      response: Response
    ): Promise<void>;
    
    updateInterviewerSlotGenerationRule(
      request: Request,
      response: Response
    ): Promise<void>;
    getAllSlotsByInterviewer(request:Request,response:Response):Promise<void>
}