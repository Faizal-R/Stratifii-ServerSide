import { Request, Response } from "express";
import { ICandidateController } from "./ICandidateController";
import { ICandidateService } from "../../services/candidate/ICandidateService";
import { comparePassword } from "../../utils/hash";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import { HttpStatus } from "../../config/HttpStatusCodes";
import {
  AUTH_MESSAGES,

} from "../../constants/messages/AuthMessages";
import  { ERROR_MESSAGES}from "../../constants/messages//ErrorMessages"
// import {PAYMENT_MESSAGES} from "../../constants/messages/PaymentAndSubscriptionMessages"
import { CANDIDATE_SUCCESS_MESSAGE } from "../../constants/messages/UserProfileMessages";
import { inject, injectable } from "inversify";
import { DiServices } from "../../di/types";

@injectable()
export class CandidateController implements ICandidateController {
  constructor(@inject(DiServices.CandidateService) private readonly _candidateService: ICandidateService) {}
  async setupCandidateProfile(
    request: Request,
    response: Response
  ): Promise<void> {
   try {
     const {candidatePassword:password,candidateConfirmPassword:confirmPassword,token  } = request.body;
      console.log(request.body);
   
     const avatar = request.file;
     console.log(avatar)
 
     if (!password || !confirmPassword || !token) {
       return createResponse(
         response,
         HttpStatus.BAD_REQUEST,
         false,
         ERROR_MESSAGES.INVALID_INPUT
       );
     }
 
     if (password !== confirmPassword) {
       return createResponse(
         response,
         HttpStatus.BAD_REQUEST,
         false,
         ERROR_MESSAGES.PASSWORD_MISMATCH
       );
     }
     console.log("all Cleared in setupCandidateProfile")
       
     const candidate=await this._candidateService.setupCandiateProfile(avatar!,password,token)
    console.log(candidate)
     return createResponse(
       response,
       HttpStatus.OK,
       true,
       AUTH_MESSAGES.CANDIDATE_SETUP_SUCCESS,
       candidate
     )
   } catch (error) {
    console.log("candidate error",error);
    errorResponse(response, error);
   }
  }
  async getCandidateProfile(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const candidateId = request.params.id;
      if (!candidateId) {
        return createResponse(
          response,
          HttpStatus.BAD_REQUEST,
          false,
          ERROR_MESSAGES.INVALID_INPUT
        );
      }
      const candidate = await this._candidateService.getCandidateProfile(candidateId);
      if (!candidate) {
        return createResponse(
          response,
          HttpStatus.NOT_FOUND,
          false,
          "Candidate not found",
          // ERROR_MESSAGES.CANDIDATE_NOT_FOUND
        );
      }
      return createResponse(
        response,
        HttpStatus.OK,
        true,
        CANDIDATE_SUCCESS_MESSAGE.CANDIDATE_PROFILE_FETCHED,
        candidate
      );
    } catch (error) {
      console.log("Error in getCandidateProfile", error);
      errorResponse(response, error);
    }
  }
}
