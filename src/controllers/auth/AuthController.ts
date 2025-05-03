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
import { AUTH_MESSAGES } from "../../constants/messages/AuthMessages";
import { ERROR_MESSAGES } from "../../constants/messages//ErrorMessages";
import { TokenPayload } from "../../middlewares/Auth";
import {
  deleteRefreshToken,
  storeRefreshToken,
} from "../../helper/handleRefreshToken";
import { VALIDATION_MESSAGES } from "../../constants/messages/ValidationMessages";
import { INTERVIEWER__SUCCESS_MESSAGES } from "../../constants/messages/UserProfileMessages";

export class AuthController implements IAuthController {
  constructor(private readonly _authService: IAuthService) { }

  async login(request: Request, response: Response): Promise<void> {
    try {
      const { role, email, password } = request.body;

      // Validate request body
      if (!role || !email || !password) {
        return createResponse(
          response,
          HttpStatus.BAD_REQUEST,
          false,
          VALIDATION_MESSAGES.ALL_FIELDS_REQUIRED
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
      response.cookie(`${role}RefreshToken`, refreshToken, COOKIE_OPTIONS);

      // Send success response
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_MESSAGES.LOGGED_IN,
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
        AUTH_MESSAGES.COMPANY_REGISTERED,
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
        AUTH_MESSAGES.INTERVIEWER_REGISTERED,
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

  async setupInterviewerAccount(
    request: Request,
    response: Response
  ): Promise<void> {
    const { interviewer, interviewerId } = request.body;

    try {
      const { accessToken, refreshToken, setupedInterviewer } =
        await this._authService.setupInterviewerAccount(
          interviewerId,
          interviewer
        );
      response.cookie(`${Roles.INTERVIEWER}RefreshToken`, refreshToken, COOKIE_OPTIONS);
      createResponse(
        response,
        HttpStatus.OK,
        true,
        INTERVIEWER__SUCCESS_MESSAGES.INTERVIEWER_PROFILE_UPDATED,
        { interviewer: setupedInterviewer, accessToken }
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
  async authenticateOTP(request: Request, response: Response): Promise<void> {
    const { otp, email, role } = request.body;

    if (otp.length !== 6) {
      return createResponse(
        response,
        HttpStatus.BAD_REQUEST,
        false,
        AUTH_MESSAGES.INVALID_OTP_FORMAT
      );
    }
    if (!email) {
      return createResponse(
        response,
        HttpStatus.BAD_REQUEST,
        false,
        ERROR_MESSAGES.BAD_REQUEST
      );
    }
    try {
      await this._authService.authenticateOTP(otp, email, role);
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_MESSAGES.OTP_VERIFIED
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
          VALIDATION_MESSAGES.ALL_FIELDS_REQUIRED,
          HttpStatus.BAD_REQUEST
        );
      }
      const { accessToken, refreshToken, user, isRegister } =
        await this._authService.googleAuthentication(email, name);
      if (isRegister) {
        return createResponse(
          response,
          HttpStatus.OK,
          true,
          AUTH_MESSAGES.GOOGLE_AUTH_SUCCESS,
          { user }
        );
      }
      
      response.cookie(`${Roles.INTERVIEWER}RefreshToken`, refreshToken, COOKIE_OPTIONS);

      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_MESSAGES.GOOGLE_AUTH_SUCCESS,
        { accessToken, user }
      );
    } catch (error) {
      console.log(error);
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
        AUTH_MESSAGES.RESEND_OTP_SUCCESS
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }

  // updateUserPassword(request: Request, response: Response):void {}
  async requestPasswordReset(request: Request, response: Response) {
    const { email, role } = request.body;

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
        AUTH_MESSAGES.PASSWORD_RESET_LINK_SENT
      );
    } catch (error) {
      console.log(error);
      return errorResponse(response, error);
    }
  }

  async resetUserPassword(request: Request, response: Response) {
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
        AUTH_MESSAGES.PASSWORD_RESET_SUCCESS
      );
    } catch (error) {
      console.log(error);
      return errorResponse(response, error);
    }
  }

  async refreshAccessToken(request: Request, response: Response) {
    try {
      const incomingRole=request.body.role

      const incomingRefreshToken = request.cookies[`${incomingRole}RefreshToken`];
      console.log(request.cookies)
      if (!incomingRefreshToken) {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_INPUT,
          HttpStatus.UNAUTHORIZED
        );
      }
      const { userId,role } = (await jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      )) as TokenPayload;

      const { accessToken, refreshToken } =
        await this._authService.refreshAccessToken(
          userId as string,
          incomingRefreshToken
        );
      response.cookie(`${role}RefreshToken`, refreshToken, COOKIE_OPTIONS);
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_MESSAGES.ACCESS_TOKEN_REFRESHED,
        { accessToken }
      );
    } catch (error) {
      console.log(error);
      return errorResponse(response, error);
    }
  }
  async verifyUserAccount(request: Request, response: Response): Promise<void> {
    const { email } = request.body;
    console.log("enter in the otp controller");
    try {
      await this._authService.sendVerificationCode(email);
      createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_MESSAGES.VERIFICATION_CODE_SENT
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }

  signout(request: Request, response: Response): void {
    try {
      const user = request.user;
      response.clearCookie(`${user?.role}RefreshToken`);
      deleteRefreshToken(user?.userId as string);

      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_MESSAGES.LOGGED_OUT
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
}
