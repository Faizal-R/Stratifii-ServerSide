import { Document } from "mongoose";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helper/generateTokens";
import { IInterviewer } from "../../models/interviewer/Interviewer";
import { IInterviewerRepository } from "../../repositories/interviewer/IInterviewerRepository";

import { IInterviewerService } from "./IInterviewerService";
import { IInterviewerProfile } from "../../validations/InterviewerValidations";
import { CustomError } from "../../error/CustomError";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { ERROR_MESSAGES } from "../../constants/messages";

export class InterviewerService implements IInterviewerService {
  constructor(private readonly _interviewerRepository: IInterviewerRepository) {}
 async getInterviewerById(interviewerId: string): Promise<IInterviewer | null> {
      try {
         const interviewer = await this._interviewerRepository.findById(interviewerId);
         if(!interviewer) throw new CustomError('Interviewer Not Found',HttpStatus.NOT_FOUND)
          return interviewer
      } catch (error) {
        if(error instanceof CustomError){
          throw error
        }
        throw new CustomError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,HttpStatus.INTERNAL_SERVER_ERROR)
      }
  }
 async updateInterviewerProfile(interviewerId: string, interviewer: IInterviewerProfile): Promise<IInterviewer | null> {
    try {
      const updatedInterviewer =await  this._interviewerRepository.update(interviewerId, interviewer);
      return updatedInterviewer
    } catch (error) {
      console.log("updateing Interviewer",error)
      if(error instanceof CustomError){
        throw error
      }
      throw new CustomError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


 
  
}
