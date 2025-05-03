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
import {PAYMENT_SUCCESS_MESSAGES} from "../../constants/messages/PaymentAndSubscriptionMessages"


export class CandidateController implements ICandidateController {
  constructor(private readonly _candidateService: ICandidateService) {}
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
}
