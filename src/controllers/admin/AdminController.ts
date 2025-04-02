import { createResponse, errorResponse } from "../../helper/responseHandler";
import { IAdminService } from "../../services/admin/IAdminService";
import { IAdminController } from "./IAdminController";
import { Request, Response } from "express";
import { HttpStatus } from "../../config/HttpStatusCodes";
import z from "zod";
import {
  ADMIN_SUCCESS_MESSAGES,
  AUTH_SUCCESS_MESSAGES,
} from "../../constants/messages";
import { Roles } from "../../constants/roles";
import { COOKIE_OPTIONS } from "../../config/CookieConfig";
import { storeRefreshToken } from "../../helper/handleRefreshToken";

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export class AdminController implements IAdminController {
  constructor(private readonly _adminService: IAdminService) {}
  async signin(request: Request, response: Response): Promise<void> {
    try {
 
      const { email, password } = request.body;
      // Validate input using Zod
      const parsedData = adminLoginSchema.parse({ email, password });
      console.log(parsedData);
      const { accessToken, refreshToken } = await this._adminService.login(
        parsedData.email,
        parsedData.password
      );
      response.cookie(
        `refreshToken`,
        refreshToken,
        COOKIE_OPTIONS
      );
      
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        // AUTH_SUCCESS_MESSAGES.LOGGED_IN,
        "Admin logged  in successfully",
        accessToken
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
  async getAllCompanies(request: Request, response: Response): Promise<void> {
    try {
      const status = request.query.status;
      const companies = await this._adminService.getAllCompanies(
        status as string
      );
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        ADMIN_SUCCESS_MESSAGES.ADMIN_USER_FETCHED,
        companies
      );
    } catch (error) {
      return errorResponse(response, error);
    }
  }
  async getAllInterviewers(
    request: Request,
    response: Response
  ): Promise<void> {
    const {status}=request.query
    try {
      const interviewers = await this._adminService.getAllInterivewers(status as string);
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        ADMIN_SUCCESS_MESSAGES.ADMIN_USER_FETCHED,
        interviewers
      );
    } catch (error) {
      return errorResponse(response, error);
    }
  }

  async updateCompanyStatus(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const companyId = request.body.companyId;
      let updatedCompany = await this._adminService.updateCompanyStatus(
        companyId
      );
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        ADMIN_SUCCESS_MESSAGES.ADMIN_USER_UPDATED,
        updatedCompany
      );
    } catch (error) {
      return errorResponse(response, error);
    }
  }
  async updateInterviewerStatus(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const interviewerId = request.body.interviewerId;
      let updatedCompany = await this._adminService.updateInterviewerStatus(
        interviewerId
      );
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        ADMIN_SUCCESS_MESSAGES.ADMIN_USER_UPDATED,
        updatedCompany
      );
    } catch (error) {
      console.log(error);
      return errorResponse(response, error);
    }
  }

  async updateCompanyVerificationStatus(
    request: Request,
    response: Response
  ): Promise<void> {
    const companyId = request.params.companyId;
    const isApproved = request.body.isApproved;
    if (!companyId) {
      return createResponse(
        response,
        HttpStatus.BAD_REQUEST,
        false,
        "Company ID is required"
      );
    }

    try {
      const updatedCompany = await this._adminService.handleCompanyVerification(
        companyId,
        isApproved
      );
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        ADMIN_SUCCESS_MESSAGES.ADMIN_USER_UPDATED,
        updatedCompany
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
  async updateInterviewerVerificationStatus(
    request: Request,
    response: Response
  ): Promise<void> {
   const {interviewerId}=request.params
   const {isApproved}=request.body
    if (!interviewerId) {
      return createResponse(
        response,
        HttpStatus.BAD_REQUEST,
        false,
        "Interviewer ID is required"
      );
    }

    try {
      const updatedInterviewer = await this._adminService.handleInterviewerVerification(
        interviewerId,
        isApproved
      );
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        ADMIN_SUCCESS_MESSAGES.ADMIN_USER_UPDATED,
        updatedInterviewer
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
   
}
