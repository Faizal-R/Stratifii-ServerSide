import { Request, Response } from "express";
import { Roles } from "../../constants/roles";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import { IAuthService } from "../../services/auth/IAuthService";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { IAuthController } from "./IAuthController";
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../../config/CookieConfig";
import { ICompany } from "../../models/company/Company";

import { AUTH_MESSAGES } from "../../constants/messages/AuthMessages";
import { ERROR_MESSAGES } from "../../constants/messages//ErrorMessages";
// import { TokenPayload } from "../../middlewares/Auth";
import { deleteRefreshToken } from "../../helper/handleRefreshToken";
import { VALIDATION_MESSAGES } from "../../constants/messages/ValidationMessages";
import { INTERVIEWER__SUCCESS_MESSAGES } from "../../constants/messages/UserProfileMessages";
import { inject, injectable } from "inversify";
import { DiServices } from "../../di/types";
import { LoginRequestDTO } from "../../dto/request/auth/LoginRequestDTO";
import { InterviewerRegisterRequestDTO } from "../../dto/request/auth/RegisterRequestDTO";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(DiServices.AuthService)
    private readonly _authService: IAuthService
  ) {}

  async login(request: Request, response: Response): Promise<void> {
    try {
      const loginData: LoginRequestDTO = request.body;
      console.log(request.body);

      // Authenticate user
      const { accessToken, refreshToken, user, subscription } =
        await this._authService.login(loginData);
      console.log(accessToken);

      response.cookie(`accessToken`, accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

      response.cookie(
        `refreshToken`,
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
      const interviewer: InterviewerRegisterRequestDTO = JSON.parse(
        request.body.data
      );

      console.log(interviewer);

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
      console.log(error);
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
    const { interviewer, interviewerId } = JSON.parse(request.body.data);
    const resume = request.file as Express.Multer.File;
    console.log("resumeRequest", request.file);

    try {
      const { accessToken, refreshToken, setupedInterviewer } =
        await this._authService.setupInterviewerAccount(
          interviewerId,
          interviewer,
          resume
        );

      //setting Access Token
      response.cookie(`accessToken`, accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

      //setting Refresh Token

      response.cookie(
        `refreshToken`,
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
      const { email, name, avatar } = request.body;

      const { accessToken, refreshToken, user, isRegister } =
        await this._authService.googleAuthentication(email, name, avatar);
      console.log(user);
      console.log("isRegister", isRegister);
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);

      if (isRegister) {
        return createResponse(
          response,
          HttpStatus.OK,
          true,
          AUTH_MESSAGES.GOOGLE_AUTH_SUCCESS,
          user
        );
      }
      response.cookie(`accessToken`, accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
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

  // async refreshAccessToken(request: Request, response: Response) {
  //   try {
  //     console.log("refreshAccessToken");
  //     const incomingRefreshToken = request.cookies[`refreshToken`];
  //     console.log("incomingRefreshToken", incomingRefreshToken);
  //     console.log("cookies", request.cookies);
  //     if (!incomingRefreshToken) {
  //       return createResponse(
  //         response,
  //         HttpStatus.UNAUTHORIZED,
  //         false,
  //         ERROR_MESSAGES.INVALID_INPUT
  //       );
  //     }
  //     const { userId } = (await jwt.verify(
  //       incomingRefreshToken,
  //       process.env.REFRESH_TOKEN_SECRET as string
  //     )) as TokenPayload;

  //     const { accessToken, refreshToken } =
  //       await this._authService.refreshAccessToken(
  //         userId as string,
  //         incomingRefreshToken
  //       );

  //     response.cookie(`accessToken`, accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
  //     response.cookie(
  //       `refreshToken`,
  //       refreshToken,
  //       REFRESH_TOKEN_COOKIE_OPTIONS
  //     );
  //     return createResponse(
  //       response,
  //       HttpStatus.OK,
  //       true,
  //       AUTH_MESSAGES.ACCESS_TOKEN_REFRESHED
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     return errorResponse(response, error);
  //   }
  // }
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
      const user = request.user;
      console.log("beforeClearCookie", request.cookies);

      response.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
      });

      response.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
      });

      console.log("Cookies", request.cookies);
      // Delete refresh token from Redis
      await deleteRefreshToken(user?.userId as string);

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
