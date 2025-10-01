import { Request, Response } from "express";


export interface ICompanyController{
  getCompanyProfile(request: Request, response: Response): Promise<void>;
  updateCompanyProfile(request: Request, response: Response): Promise<void>;
  changePassword(request: Request, response: Response): Promise<void>;
  getCompanyDashboard(request: Request, response: Response): Promise<void>;
}