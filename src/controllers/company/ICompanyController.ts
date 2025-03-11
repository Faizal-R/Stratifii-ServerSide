import { Request, Response } from "express";
import { ICompany } from "../../models/company/Company";

export interface ICompanyController{
  getCompanyById(request: Request, response: Response): Promise<void>;
  updateCompanyProfile(request: Request, response: Response): Promise<void>;
}