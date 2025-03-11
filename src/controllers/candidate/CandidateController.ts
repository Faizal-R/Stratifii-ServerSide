import { Request, Response } from "express";
import { ICandidateController } from "./ICandidateController";
import { ICandidateService } from "../../services/candidate/ICandidateService";
import { comparePassword } from "../../utils/hash";
import { createResponse } from "../../helper/responseHandler";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { ERROR_MESSAGES } from "../../constants/messages";

export class CandidateController implements ICandidateController {
  constructor(private readonly _candidateService: ICandidateService) {}

 
}
