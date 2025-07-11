import { Request, Response } from "express";

export interface ICandidateController{
   setupCandidateProfile (request: Request, response: Response): Promise<void>
   getCandidateProfile (request: Request, response: Response): Promise<void>
}