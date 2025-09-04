import { Request, Response } from "express";
import { ICompany } from "../../models/company/Company";

export interface ICompanyController{
  getCompanyProfile(request: Request, response: Response): Promise<void>;
  updateCompanyProfile(request: Request, response: Response): Promise<void>;
  changePassword(request: Request, response: Response): Promise<void>;
  getCompanyDashboard(request: Request, response: Response): Promise<void>;
}