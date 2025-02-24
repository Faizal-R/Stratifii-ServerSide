import { Request, Response } from "express";

export interface IInterviewerController{
    login(request:Request,response:Response):void
    register(request:Request,response:Response):void
}