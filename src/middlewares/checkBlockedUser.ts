import { NextFunction, Response, Request } from "express";
import { HttpStatus } from "../config/HttpStatusCodes";
import { createResponse } from "../helper/responseHandler";

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
  const { role, userId } = request.user || {};
  let user: IInterviewer | ICompany | ICandidate | null = null;

  const reqRole = role || request.body.role;
  const identifier = userId || request.body.email;

  switch (reqRole) {
    case Roles.COMPANY:
      user = userId
        ? await Company.findById(userId)
        : await Company.findOne({ email: identifier });
      break;
    case Roles.CANDIDATE:
      user = userId
        ? await Candidate.findById(userId)
        : await Candidate.findOne({ email: identifier });
      break;
    case Roles.INTERVIEWER:
      user = userId
        ? await Interviewer.findById(userId)
        : await Interviewer.findOne({ email: identifier });
      break;
  }

  // If user not found, silently continue
  if (!user) {
    return next();
  }

  // If user is blocked, stop the request
  if (user.isBlocked) {
    return createResponse(
      response,
      HttpStatus.LOCKED,
      false,
      "Access denied. Your account has been blocked."
    );
  }

  // If user is fine, continue
  next();
}
