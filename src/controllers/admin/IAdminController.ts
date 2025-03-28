import { Request, Response } from "express";

export interface IAdminController {
  signin(request: Request, response: Response): Promise<void>;

  getAllCompanies(request: Request, response: Response): Promise<void>;

  updateCompanyStatus(request: Request, response: Response): Promise<void>;

  getAllInterviewers(request: Request, response: Response): Promise<void>;

  updateCompanyVerificationStatus(
    request: Request,
    response: Response
  ): Promise<void>;
  updateInterviewerVerificationStatus(
    request: Request,
    response: Response
  ): Promise<void>;
}
