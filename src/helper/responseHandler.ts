import { Response } from "express";
import { HttpStatus } from "../config/HttpStatusCodes";
import { CustomError } from "../error/CustomError";

export function createResponse<T>(
  response: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: T | null=null
):void {
  response.status(statusCode).json({
    success,
    message,
    data,
  });
}

export const errorResponse = (response: Response, error: unknown): void => {
  const errorMessage = error instanceof CustomError ? error.message : "Something went wrong";
  createResponse(response, HttpStatus.INTERNAL_SERVER_ERROR, false, errorMessage);
};
