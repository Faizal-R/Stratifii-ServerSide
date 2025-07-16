import { Request, Response } from "express";

export interface ICandidateController {
  setupCandidateProfile(request: Request, response: Response): Promise<void>;
  getCandidateProfile(request: Request, response: Response): Promise<void>;
  getDelegatedJobs(request: Request, response: Response): Promise<void>;
  generateCandidateMockInterviewQuestions(
    request: Request,
    response: Response
  ): Promise<void>;
  finalizeAIMockInterview(request: Request, response: Response): Promise<void>;
}
