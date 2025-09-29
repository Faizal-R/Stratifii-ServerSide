import { Request, Response } from "express";

import { IInterviewSlot } from "../../models/slot/interviewSlot";

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