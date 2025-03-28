import { NextFunction, Response, Request } from "express";
import { HttpStatus } from "../config/HttpStatusCodes";
import { createResponse } from "../helper/responseHandler";
import { TokenPayload } from "./Auth";
import { Roles } from "../constants/roles";
import { Interviewer, Company, Candidate } from "../models";
import { ICandidate } from "../models/candidate/Candidate";
import { ICompany } from "../models/company/Company";
import { IInterviewer } from "../models/interviewer/Interviewer";

export async function checkBlockedUser(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const role = request.user?.role;
  let user: IInterviewer | ICompany | ICandidate | null = null;

  if (!request.user) {
    console.log("helo ")
    switch (request.body.role) {
      case Roles.COMPANY:
        user = await Company.findOne({ email: request.body.email });
        break;
      case Roles.CANDIDATE:
        user = await Candidate.findOne({ email: request.body.email });
        break;
      case Roles.INTERVIEWER:
        user = await Interviewer.findOne({ email: request.body.email });
        break;
      default:
        user = null;
    }
  } else {
    switch (role) {
      case Roles.COMPANY:
        user = await Company.findById(request.user?.userId);
        break;
      case Roles.CANDIDATE:
        user = await Candidate.findById(request.user?.userId);
        break;
      case Roles.INTERVIEWER:
        user = await Interviewer.findById(request.user?.userId);
        break;
      default:
        user = null;
    }
  }

  if (!user) {
    return createResponse(
      response,
      HttpStatus.UNAUTHORIZED,
      false,
      "No User Found with this Email"
    );
  }

  if (user.isBlocked) {
    return createResponse(
      response,
      HttpStatus.FORBIDDEN,
      false,
      "Access denied. Your account has been blocked."
    );
  }

  next();
}
