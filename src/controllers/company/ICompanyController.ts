import { Request, Response } from "express";
import { ICompany } from "../../interfaces/ICompanyModel";

export interface ICompanyController{
    login(request:Request,response:Response):void
    register(request:Request,response:Response):void

}