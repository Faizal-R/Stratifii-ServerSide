import { Request, Response } from "express";
import { ICompanyService } from "../../services/company/ICompanyService";
import { ICompanyController } from "./ICompanyController";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { COMPANY_SUCCESS_MESSAGES } from "../../constants/messages";
import { CompanyProfileSchema } from "../../validations/CompanyValidations";


export class CompanyController implements ICompanyController {
  constructor(private readonly _companyService: ICompanyService) {}

  async getCompanyById(request: Request, response: Response) {
    try {
      const companyId = request.user?.userId;
      const company = await this._companyService.getCompanyById(companyId!);
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        "Company Found",
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
      console.log("companyLogoFile", companyLogoFile);

      const validatedCompany = CompanyProfileSchema.safeParse(parsedCompany);
      console.log("validated Company", validatedCompany);
      if (!validatedCompany.success) {
        console.log(validatedCompany.error);
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
}
