import { Request, Response } from "express";
import { Roles } from "../../constants/roles";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import { IAuthService } from "../../services/auth/IAuthService";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { IAuthController } from "./IAuthController";
import { COOKIE_OPTIONS } from "../../config/CookieConfig";
import { ICompany } from "../../models/company/Company";
import { CustomError } from "../../error/CustomError";
import { IInterviewer } from "../../models/interviewer/Interviewer";
import { AUTH_SUCCESS_MESSAGES } from "../../constants/messages";

export class AuthController implements IAuthController {
  constructor(private readonly _authService: IAuthService) {}

  async login(request: Request, response: Response): Promise<void> {
    try {
      const { role, email, password } = request.body;
      console.log(request.body);

      // Validate request body
      if (!role || !email || !password) {
        return createResponse(
          response,
          HttpStatus.BAD_REQUEST,
          false,
          "All fields are required"
        );
      }

      // Validate role
      if (!Object.values(Roles).includes(role)) {
        return createResponse(
          response,
          HttpStatus.BAD_REQUEST,
          false,
          "Invalid Role"
        );
      }

      // Authenticate user
      const { accessToken, refreshToken, user } = await this._authService.login(
        role,
        email,
        password
      );

      // Set refresh token as an HTTP-only cookie
      response.cookie(`${role}RefreshToken`, refreshToken, COOKIE_OPTIONS);

      // Send success response
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        "Logged in successfully",
        {
          accessToken,
          user,
        }
      );
    } catch (error) {
      console.log("auth:", error);
      return errorResponse(response, error);
    }
  }

  async registerCompany(request: Request, response: Response): Promise<void> {
    try {
      // Extract request body
      const companyData: ICompany = request.body;

      //  Call the service layer to handle registration
      const newCompany = await this._authService.registerCompany(companyData);

      //  Send verification code
      await this._authService.sendVerificationCode(newCompany.email);

      return createResponse(
        response,
        HttpStatus.CREATED,
        true,
        AUTH_SUCCESS_MESSAGES.COMPANY_REGISTERED,
        newCompany
      );
    } catch (error) {
      console.error("Error in registerCompany:", error);
      return errorResponse(response, error);
    }
  }

  async registerInterviewer(request: Request, response: Response) {
    try {
      const interviewer: IInterviewer = request.body;
      const newInterviewer = await this._authService.registerInterviewer(
        interviewer
      );
      await this._authService.sendVerificationCode(newInterviewer.email);
      return createResponse(
        response,
        HttpStatus.CREATED,
        true,
        AUTH_SUCCESS_MESSAGES.INTERVIEWER_REGISTERED,
        newInterviewer
      );
    } catch (error) {
      if (error instanceof Error)
        createResponse(
          response,
          HttpStatus.INTERNAL_SERVER_ERROR,
          false,
          error.message
        );
      return;
    }
  }
  async authenticateOTP(request: Request, response: Response): Promise<void> {
    const { otp, email} = request.body;
    console.log(request.body);
    if (otp.length !== 6) {
      return createResponse(
        response,
        HttpStatus.BAD_REQUEST,
        false,
        "Invalid OTP"
      );
    }
    if (!email) {
      return createResponse(
        response,
        HttpStatus.BAD_REQUEST,
        false,
        "Email is required"
      );
    }
    try {
      await this._authService.authenticateOTP(otp, email);
      return createResponse(response, HttpStatus.OK, true, AUTH_SUCCESS_MESSAGES.OTP_VERIFIED);
    } catch (error) {
      console.log(error);
      return errorResponse(response, error);
    }
  }
  async googleAuthentication(request: Request, response: Response) {
    try {
      const { email, name } = request.body;

      if (!email || !name) {
        return createResponse(
          response,
          HttpStatus.BAD_REQUEST,
          false,
          "Email and name are required",
          HttpStatus.BAD_REQUEST
        );
      }
      const { accessToken, refreshToken, user } =
        await this._authService.googleAuthentication(email, name);
      response.cookie(
        `${Roles.INTERVIEWER}RefreshToken`,
        refreshToken,
        COOKIE_OPTIONS
      );
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_SUCCESS_MESSAGES.GOOGLE_AUTH_SUCCESS,
        { accessToken, user }
      );
    } catch (error) {
      return errorResponse(response, error);
    }
  }

  async triggerOtpResend(request: Request, response: Response) {
    try {
      const { email } = request.body;
      await this._authService.sendVerificationCode(email);

      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_SUCCESS_MESSAGES.RESEND_OTP_SUCCESS
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
}
