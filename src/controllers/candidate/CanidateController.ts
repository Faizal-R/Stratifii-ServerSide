import { Request, Response } from "express";
import { ICandidateController } from "./ICanidateController";
import { CandidateService } from "../../services/candidate/CandidateService";
import { comparePassword } from "../../utils/hash";
import { createResponse } from "../../helper/responseHandler";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { ERROR_MESSAGES } from "../../constants/messages";

export class CandidateController implements ICandidateController {
  constructor(private readonly _candidateService: CandidateService) {}

  async login(request: Request, response: Response): Promise<void> {
    try {
      const { email, password } = request.body;
      const { accessToken, refreshToken, user } =
        await this._candidateService.login(email, password);
      createResponse(
        response,
        HttpStatus.OK,
        true,
        "User LoggedIn Successfully",
        { accessToken, refreshToken, user }
      );
      
    } catch (error) {
    if(error instanceof Error)
        createResponse(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        false,
       error.message
      );
    }
  }
}
