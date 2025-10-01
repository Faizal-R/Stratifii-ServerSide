import { Request, Response } from "express";


import { createResponse, errorResponse } from "../../helper/responseHandler";
import { IAuthService } from "../../services/auth/IAuthService";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { IAuthController } from "./IAuthController";
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../../config/CookieConfig";


import { AUTH_MESSAGES } from "../../constants/messages/AuthMessages";
import { ERROR_MESSAGES } from "../../constants/messages//ErrorMessages";
import { INTERVIEWER__SUCCESS_MESSAGES } from "../../constants/messages/UserProfileMessages";
import { inject, injectable } from "inversify";
import { DI_TOKENS } from "../../di/types";
import { LoginRequestDTO } from "../../dto/request/auth/LoginRequestDTO";
import {
  AuthenticateOTPRequestDTO,
  CompanyRegisterRequestDTO,
  InterviewerRegisterRequestDTO,
} from "../../dto/request/auth/RegisterRequestDTO";
import { Tokens } from "../../constants/enums/token";
import { InterviewerAccountSetupRequestDTO } from "../../dto/request/auth/AccountSetupRequestDTO";
import { GoogleAuthRequestDTO } from "../../dto/request/auth/GoogleAuthRequestDTO";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(DI_TOKENS.SERVICES.AUTH_SERVICE)
    private readonly _authService: IAuthService
  ) {}

  async login(request: Request, response: Response): Promise<void> {
    try {
      const loginData: LoginRequestDTO = request.body;
      // Authenticate user
      const { accessToken, refreshToken, user, subscription } =
        await this._authService.login(loginData);

      response.cookie(
        Tokens.ACCESS_TOKEN,
        accessToken,
        ACCESS_TOKEN_COOKIE_OPTIONS
      );

      response.cookie(
        Tokens.REFRESH_TOKEN,
        refreshToken,
        REFRESH_TOKEN_COOKIE_OPTIONS
      );

      // Send success response
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_MESSAGES.LOGGED_IN,
        {
          user,
          subscription,
        }
      );
    } catch (error) {
      return errorResponse(response, error);
    }
  }

  async registerCompany(request: Request, response: Response): Promise<void> {
    try {
      // Extract request body
      const companyData: CompanyRegisterRequestDTO = request.body;

      const newCompany = await this._authService.registerCompany(companyData);

      return createResponse(
        response,
        HttpStatus.CREATED,
        true,
        AUTH_MESSAGES.COMPANY_REGISTERED,
        newCompany
      );
    } catch (error) {
      return errorResponse(response, error);
    }
  }

  async registerInterviewer(request: Request, response: Response) {
    try {
      const interviewer: InterviewerRegisterRequestDTO = JSON.parse(
        request.body.data
      );

      const newInterviewer = await this._authService.registerInterviewer(
        interviewer,
        request.file
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
    const {
      interviewer,
      interviewerId,
    }: {
      interviewer: InterviewerAccountSetupRequestDTO;
      interviewerId: string;
    } = JSON.parse(request.body.data);
    const resume = request.file as Express.Multer.File;

    try {
      const {
        accessToken,
        refreshToken,
        user: setupedInterviewer,
      } = await this._authService.setupInterviewerAccount(
        interviewerId,
        interviewer,
        resume
      );

      response.cookie(
        Tokens.ACCESS_TOKEN,
        accessToken,
        ACCESS_TOKEN_COOKIE_OPTIONS
      );

      response.cookie(
        Tokens.REFRESH_TOKEN,
        refreshToken,
        REFRESH_TOKEN_COOKIE_OPTIONS
      );

      createResponse(
        response,
        HttpStatus.OK,
        true,
        INTERVIEWER__SUCCESS_MESSAGES.INTERVIEWER_PROFILE_UPDATED,
        { interviewer: setupedInterviewer }
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
  async authenticateOTP(request: Request, response: Response): Promise<void> {
    const authenticateOTPRequestBody: AuthenticateOTPRequestDTO = request.body;

    try {
      await this._authService.authenticateOTP(authenticateOTPRequestBody);
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_MESSAGES.OTP_VERIFIED
      );
    } catch (error) {
      return errorResponse(response, error);
    }
  }
  async googleAuthentication(request: Request, response: Response) {
    try {
      const GoogleAuthRequesBody: GoogleAuthRequestDTO = request.body;

      const { accessToken, refreshToken, user, isRegister } =
        await this._authService.googleAuthentication(GoogleAuthRequesBody);

      if (isRegister) {
        return createResponse(
          response,
          HttpStatus.OK,
          true,
          AUTH_MESSAGES.GOOGLE_AUTH_SUCCESS,
          user
        );
      }
      response.cookie(
        Tokens.ACCESS_TOKEN,
        accessToken,
        ACCESS_TOKEN_COOKIE_OPTIONS
      );
      response.cookie(
        `refreshToken`,
        refreshToken,
        REFRESH_TOKEN_COOKIE_OPTIONS
      );
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        AUTH_MESSAGES.GOOGLE_AUTH_SUCCESS,
        user
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
      return errorResponse(response, error);
    }
  }

  async verifyUserAccount(request: Request, response: Response): Promise<void> {
    const { email } = request.body;
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

  async signout(request: Request, response: Response): Promise<void> {
    try {
      const refreshToken = request.cookies[Tokens.REFRESH_TOKEN];

      await this._authService.signout(refreshToken);
      response.clearCookie(Tokens.ACCESS_TOKEN);

      response.clearCookie(Tokens.REFRESH_TOKEN);

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
