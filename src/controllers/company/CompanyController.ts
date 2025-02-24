import { Request, Response } from "express";
import { CompanyService } from "../../services/company/CompanySerive";
import { ICompanyController } from "./ICompanyController";
import { createResponse } from "../../helper/responseHandler";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { COOKIE_OPTIONS } from "../../config/cookieConfig";

export class CompanyController implements ICompanyController {
    constructor(private readonly _companyService: CompanyService) { }
    async login(request: Request, response: Response) {
        const { email, password } = request.body;
        try {
            const { accessToken, refreshToken, user } =
                await this._companyService.login(email, password);
            if (!user) {
                createResponse(
                    response,
                    HttpStatus.OK,
                    false,
                    "Invalid email or password"
                );
                return;
            }
            response.cookie("accessToken", accessToken, COOKIE_OPTIONS);
            createResponse(
                response,
                HttpStatus.OK,
                true,
                "User LoggedIn Successfully",
                user
            );
            return;
        } catch (error) {
            if (error instanceof Error)
                createResponse(response, 500, false, error.message);
        }
    }
    async register(request: Request, response: Response) {
        const {
            companyName,
            email,
            companyWebsite,
            registrationCertificateNumber,
            linkedInProfile,
            phone,
            password,
            companyType,
        } = request.body;
   
         const newCompany=this._companyService.register(companyName,
            email,
            companyWebsite,
            registrationCertificateNumber,
            linkedInProfile,
            phone,
            password,
            companyType)

            createResponse(response,200,true,"Company Registration completed Successfully",newCompany)
    }
}
