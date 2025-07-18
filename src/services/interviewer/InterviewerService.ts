import { IInterviewer } from "../../models/interviewer/Interviewer";
import { IInterviewerRepository } from "../../repositories/interviewer/IInterviewerRepository";

import { IInterviewerService } from "./IInterviewerService";
import { IInterviewerProfile } from "../../validations/InterviewerValidations";
import { CustomError } from "../../error/CustomError";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helper/generateTokens";
import { Roles } from "../../constants/roles";
import { storeRefreshToken } from "../../helper/handleRefreshToken";
import { comparePassword, hashPassword } from "../../utils/hash";
import { USER_COMMON_MESSAGES } from "../../constants/messages/UserProfileMessages";
import { inject, injectable } from "inversify";
import { DiRepositories } from "../../di/types";

@injectable()
export class InterviewerService implements IInterviewerService {
  constructor(
    @inject(DiRepositories.InterviewerRepository)
    private readonly _interviewerRepository: IInterviewerRepository
  ) {}
  async getInterviewerById(
    interviewerId: string
  ): Promise<IInterviewer | null> {
    try {
      const interviewer = await this._interviewerRepository.findById(
        interviewerId
      );
      if (!interviewer)
        throw new CustomError("Interviewer Not Found", HttpStatus.NOT_FOUND);
      return interviewer;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async updateInterviewerProfile(
    interviewerId: string,
    interviewer: IInterviewerProfile
  ): Promise<IInterviewer | null> {
    try {
      const updatedInterviewer = await this._interviewerRepository.update(
        interviewerId,
        interviewer
      );
      return updatedInterviewer;
    } catch (error) {
      console.log("updateing Interviewer", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    interviewerId: string
  ): Promise<IInterviewer | null> {
    try {
      const interviewer = await this._interviewerRepository.findById(
        interviewerId
      );
      if (
        !interviewer ||
        !comparePassword(currentPassword, interviewer.password)
      ) {
        throw new CustomError(
          USER_COMMON_MESSAGES.CURRENT_PASSWORD_INCORRECT,
          HttpStatus.BAD_REQUEST
        );
      }
      const hashedPassword = await hashPassword(newPassword);
      const updatedInterviewer = await this._interviewerRepository.update(
        interviewerId,
        { password: hashedPassword }
      );
      return updatedInterviewer;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
