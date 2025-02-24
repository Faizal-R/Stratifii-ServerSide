import { Request, Response } from "express";

export interface ICandidateController{
    login(request:Request,response:Response):Promise<void>
}