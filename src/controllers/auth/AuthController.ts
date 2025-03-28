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
import jwt from "jsonwebtoken";
import {
  AUTH_SUCCESS_MESSAGES,
  COMMON_MESSAGES,
  ERROR_MESSAGES,
} from "../../constants/messages";
import { TokenPayload } from "../../middlewares/Auth";
import { storeRefreshToken } from "../../helper/handleRefreshToken";

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
          ERROR_MESSAGES.INVALID_INPUT
        );
      }

      // Authenticate user
      const { accessToken, refreshToken, user } = await this._authService.login(
        role,
        email,
        password
      );

      // Set refresh token as an HTTP-only cookie
      response.cookie(`refreshToken`, refreshToken, COOKIE_OPTIONS);

      // Send success response
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_SUCCESS_MESSAGES.LOGGED_IN,
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

      const newCompany = await this._authService.registerCompany(companyData);

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
    const { otp, email } = request.body;
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
        COMMON_MESSAGES.ALREADY_EXIST
      );
    }
    try {
      await this._authService.authenticateOTP(otp, email);
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_SUCCESS_MESSAGES.OTP_VERIFIED
      );
    } catch (error) {
      console.log(error);
      return errorResponse(response, error);
    }
  }
  async googleAuthentication(request: Request, response: Response) {
    console.log(request.body);
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
      response.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
      console.log(refreshToken);
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_SUCCESS_MESSAGES.GOOGLE_AUTH_SUCCESS,
        { accessToken, user }
      );
    } catch (error) {
      console.log(error)
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

  // updateUserPassword(request: Request, response: Response):void {}
  async requestPasswordReset(request: Request, response: Response) {
    const { email, role } = request.body;
    console.log(email, role);
    if (!email) {
      return createResponse(
        response,
        HttpStatus.BAD_REQUEST,
        false,
        ERROR_MESSAGES.BAD_REQUEST
      );
    }
    try {
      await this._authService.requestPasswordReset(email, role);
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_SUCCESS_MESSAGES.PASSWORD_RESET_LINK_SENT
      );
    } catch (error) {
      console.log(error);
      return errorResponse(response, error);
    }
  }

  async resetUserPassword(request: Request, response: Response) {
    console.log(request.body);
    try {
      const { password, confirmPassword, token } = request.body;
      if (!password || !token) {
        return createResponse(
          response,
          HttpStatus.BAD_REQUEST,
          false,
          ERROR_MESSAGES.INVALID_INPUT
        );
      }
      await this._authService.resetUserPassword(
        password,
        confirmPassword,
        token
      );
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS
      );
    } catch (error) {
      console.log(error);
      return errorResponse(response, error);
    }
  }

  async refreshAccessToken(request: Request, response: Response) {
    console.log("inside refreshAccessToken method of AuthController.ts");
    try {
      const incomingRefreshToken = request.cookies.refreshToken;
      if (!incomingRefreshToken) {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_INPUT,
          HttpStatus.UNAUTHORIZED
        );
      }
      const { userId } = (await jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      )) as TokenPayload;


      const { accessToken, refreshToken } =
        await this._authService.refreshAccessToken(
          userId as string,
          incomingRefreshToken
        );
      response.cookie(`refreshToken`, refreshToken, COOKIE_OPTIONS);
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_SUCCESS_MESSAGES.ACCESS_TOKEN_REFRESHED,
        { accessToken }
      );
    } catch (error) {
      console.log(error);
      return errorResponse(response, error);
    }
  }
}
