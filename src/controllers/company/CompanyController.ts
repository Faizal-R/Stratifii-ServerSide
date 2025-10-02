import { Request, Response } from "express";
import { ICompanyService } from "../../services/company/ICompanyService";
import { ICompanyController } from "./ICompanyController";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import { HttpStatus } from "../../config/HttpStatusCodes";
import {
  COMPANY_SUCCESS_MESSAGES,
  USER_COMMON_MESSAGES,
} from "../../constants/messages/UserProfileMessages";
import { CompanyProfileSchema } from "../../validations/CompanyValidations";
import { inject, injectable } from "inversify";
import {  DI_TOKENS } from "../../di/types";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";

@injectable()
export class CompanyController implements ICompanyController {
  constructor(
@inject(DI_TOKENS.SERVICES.COMPANY_SERVICE)
private readonly _companyService: ICompanyService
  ) {}

  async getCompanyProfile(request: Request, response: Response) {
    try {
      const companyId = request.user?.userId;
      const company = await this._companyService.getCompanyProfile(companyId!);
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        "fetch Company details successfully",
        company
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
  async updateCompanyProfile(request: Request, response: Response) {
    try {
      const companyId = request.user?.userId;
      const parsedCompany = JSON.parse(request.body.company);
      const companyLogoFile = request.file;
      

      const validatedCompany = CompanyProfileSchema.safeParse(parsedCompany);
      
      if (!validatedCompany.success) {
        
        return createResponse(
          response,
          HttpStatus.BAD_REQUEST,
          false,
          "Some fields in your company profile contain invalid data.",
          validatedCompany.error.format()
        );
      }

      const updatedCompany = await this._companyService.updateCompanyProfile(
        companyId!,
        validatedCompany.data,
        companyLogoFile
      );
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        COMPANY_SUCCESS_MESSAGES.COMPANY_PROFILE_UPDATED,
        updatedCompany
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
  async changePassword(request: Request, response: Response): Promise<void> {
    const passwordDetails = request.body;
    const companyId = request.user?.userId;
    if(!companyId){
      return createResponse(
        response,
        HttpStatus.UNAUTHORIZED,
        false,
       ERROR_MESSAGES.BAD_REQUEST
      );
    }
    try {
      const interviewer = await this._companyService.changePassword(
        passwordDetails.currentPassword,
        passwordDetails.newPassword,
        companyId
      );
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        USER_COMMON_MESSAGES.PASSWORD_CHANGED,
        interviewer
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }

  async getCompanyDashboard(request: Request, response: Response): Promise<void> {
    try {
      const companyId = request.user?.userId;
      
      const dashboardData = await this._companyService.getCompanyDashboard(companyId!);
      
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        "Company dashboard data fetched successfully",
        dashboardData
      );
    } catch (error) {
      errorResponse(response, error);
    } 
  }
}
