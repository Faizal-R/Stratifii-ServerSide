import { createResponse, errorResponse } from "../../helper/responseHandler";
import { IAdminService } from "../../services/admin/IAdminService";
import { IAdminController } from "./IAdminController";
import { Request, Response } from "express";
import { HttpStatus } from "../../config/HttpStatusCodes";
import z from "zod";
import { AUTH_SUCCESS_MESSAGES } from "../../constants/messages";

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export class AdminController implements IAdminController {
  constructor(private readonly _adminService: IAdminService) {}
  async login(request: Request, response: Response): Promise<void> {
    try {
      const { email, password } = request.body;
      // Validate input using Zod
      const parsedData = adminLoginSchema.parse({ email, password });

      await this._adminService.login(parsedData.email, parsedData.password);
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_SUCCESS_MESSAGES.LOGGED_IN
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return createResponse(
          response,
          HttpStatus.BAD_REQUEST,
          false,
          error.errors[0].message
        );
      }
      return errorResponse(response, error);
    }
  }
}
