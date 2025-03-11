import { Request, Response } from "express";

export interface IAdminController {
  login(
    request: Request,
    response: Response
  ): Promise<void>;
}
