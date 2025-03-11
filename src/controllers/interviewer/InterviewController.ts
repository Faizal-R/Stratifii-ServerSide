import { Request, Response } from "express";
import { IInterviewerService } from "../../services/interviewer/IInterviewerService";
import { IInterviewerController } from "./IInterviewerController";
import { createResponse, errorResponse } from "../../helper/responseHandler";
import {  HttpStatus,  } from "../../config/HttpStatusCodes";
import { INTERVIEWER__SUCCESS_MESSAGES } from "../../constants/messages";

import { InterviewerProfileSchema } from "../../validations/InterviewerValidations";

export class InterviewController implements IInterviewerController {
  constructor(private readonly _interviewerService: IInterviewerService) {}

  async getInterviewerProfile(request: Request, response: Response) {
      try {

        const interviewerId=request.user?.userId
        console.log(interviewerId)
        const interviewer= await this._interviewerService.getInterviewerById(interviewerId!)
        console.log(interviewer)
        return createResponse(response,HttpStatus.OK,true,INTERVIEWER__SUCCESS_MESSAGES.INTERVIEWER_PROFILE_FETCHED,interviewer)
      } catch (error) {

        console.log("error while fetching",error)
        return errorResponse(response,error)
      }
  }
  async updateInterviewerProfile(request: Request, response: Response) {
      try {
        console.log(request.body)
        const interviewerId=request.user?.userId
        const interviewer =InterviewerProfileSchema.safeParse(request.body)
          if(!interviewer.success){
            return createResponse(response,HttpStatus.BAD_REQUEST,false,interviewer.error.message)
          } 
        
        const updatedInterviewer = this._interviewerService.updateInterviewerProfile(interviewerId!,interviewer.data)
        return createResponse(response,HttpStatus.OK,true,INTERVIEWER__SUCCESS_MESSAGES.INTERVIEWER_PROFILE_UPDATED,updatedInterviewer)
      } catch (error) {
        errorResponse(response,error)
      }
  }
      
}
