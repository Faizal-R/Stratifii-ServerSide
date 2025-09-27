import { Request, Response } from "express";

export interface IPayoutController {
  createPayoutRequest(request: Request, response: Response): Promise<void>;
 
  getAllInterviewersPayoutRequest(request: Request, response: Response): Promise<void>; 
  updateInterviewersPayoutRequestStatus(request: Request, response: Response): Promise<void>
}
