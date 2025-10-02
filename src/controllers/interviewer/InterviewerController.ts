import { Request, Response } from "express";
import { IInterviewerService } from "../../services/interviewer/IInterviewerService";
import { IInterviewerController } from "./IInterviewerController";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import { HttpStatus } from "../../config/HttpStatusCodes";
import {
  INTERVIEWER__SUCCESS_MESSAGES,
  USER_COMMON_MESSAGES,
} from "../../constants/messages/UserProfileMessages";



import { inject, injectable } from "inversify";
import { DI_TOKENS } from "../../di/types";
import { IInterviewService } from "../../services/interview/IInterviewService";
import { IBankDetails } from "../../models/interviewer/Interviewer";
import { IWalletService } from "../../services/wallet/IWalletService";

@injectable()
export class InterviewerController implements IInterviewerController {
  constructor(
    @inject(DI_TOKENS.SERVICES.INTERVIEWER_SERVICE)
    private readonly _interviewerService: IInterviewerService,

    @inject(DI_TOKENS.SERVICES.INTERVIEW_SERVICE)
    private readonly _interviewService: IInterviewService,
    @inject(DI_TOKENS.SERVICES.WALLET_SERVICE)
    private readonly _walletService: IWalletService
  ) {}

  async getInterviewerProfile(request: Request, response: Response) {
    try {
      const interviewerId = request.user?.userId;
      const interviewer = await this._interviewerService.getInterviewerById(
        interviewerId!
      );
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        INTERVIEWER__SUCCESS_MESSAGES.INTERVIEWER_PROFILE_FETCHED,
        interviewer
      );
    } catch (error) {
      console.log("error while fetching", error);
      return errorResponse(response, error);
    }
  }
  async updateInterviewerProfile(request: Request, response: Response) {
    try {
      console.log(request.files, "files in update profile");

      const interviewerId = request.user?.userId ?? request.body.interviewerId;
      const interviewer = JSON.parse(request.body.interviewer); //request.body
      let avatar: Express.Multer.File | undefined;
      let resume: Express.Multer.File | undefined;
      if (request.files && !Array.isArray(request.files)) {
        avatar =
          (request.files["avatar"]?.[0] as Express.Multer.File) ?? undefined;
        resume =
          (request.files["resume"]?.[0] as Express.Multer.File) ?? undefined;
      }
      console.log("avatar", avatar);
      console.log("resume", resume);
      // if (!interviewer.success) {
      //   return createResponse(
      //     response,
      //     HttpStatus.BAD_REQUEST,
      //     false,
      //     interviewer.error.issues[0].message
      //   );
      // }

      const updatedInterviewer =
        this._interviewerService.updateInterviewerProfile(
          interviewerId!,
          interviewer,
          avatar,
          resume
        );
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        INTERVIEWER__SUCCESS_MESSAGES.INTERVIEWER_PROFILE_UPDATED,
        updatedInterviewer
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }

  async changePassword(request: Request, response: Response): Promise<void> {
    const passwordDetails = request.body;
    const interviewerId = request.user?.userId;
    if(!interviewerId){
      errorResponse(response,"Interviewer not found");
      return;
    }
    try {
      const interviewer = await this._interviewerService.changePassword(
        passwordDetails.currentPassword,
        passwordDetails.newPassword,
        interviewerId
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

  async addBankDetails(request: Request, response: Response): Promise<void> {
    const bankDetails: IBankDetails = request.body;
    console.log(bankDetails);
    const interviewerId = request.user?.userId;
    if(!interviewerId){
      errorResponse(response,"Interviewer not found");
      return;
    }
    try {
      await this._interviewerService.addBankDetails(
        bankDetails,
        interviewerId
      );
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        INTERVIEWER__SUCCESS_MESSAGES.INTERVIEWER_BANK_DETAILS_ADDED
      );
    } catch (error) {
      console.log(error);
      errorResponse(response, error);
    }
  }

  async getInterviewerWalletAndTransactions(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      console.log("entered getInterviewerWalletAndTransactions");
      const interviewerId = request.user?.userId;
      console.log(interviewerId);
      const { wallet, transactions } =
        await this._walletService.getUserWalletAndTransactions(interviewerId!);
      console.log(wallet);
      createResponse(
        response,
        HttpStatus.OK,
        true,
        INTERVIEWER__SUCCESS_MESSAGES.INTTERVIEWER_WALLET_FETCHED,
        { wallet, transactions }
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }

  async getUpcomingInterviews(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const interviewerId = request.user?.userId;
      if(!interviewerId){
        errorResponse(response,"Interviewer not found");
        return;
      }
      const upcomingInterviews =
        await this._interviewService.getUpcomingInterviews(interviewerId!);

      return createResponse(
        response,
        HttpStatus.OK,
        true,
        "Successfully fetched upcoming interviews",

        upcomingInterviews
      );
    } catch (error) {
      errorResponse(response, error);
    }
  }
}
