import { Response } from "express";

export function createResponse<T>(
  response: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: T | null=null
): Response {
  return response.status(statusCode).json({
    success,
    message,
    data,
  });
}


