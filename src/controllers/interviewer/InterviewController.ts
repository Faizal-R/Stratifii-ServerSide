import { Request, Response } from "express";
import { InterviewerService } from "../../services/interviewer/InterviewerService";
import { IInterviewerController } from "./IInterviewerController";
import { createResponse } from "../../helper/responseHandler";
import {  HttpStatus,  } from "../../config/HttpStatusCodes";
import { COOKIE_OPTIONS } from "../../config/cookieConfig";

export class InterviewController {
  constructor(private readonly _interviewerService: InterviewerService) {}
  async login(request: Request, response: Response) {
    const { email, password } = request.body;
    const { accessToken, refreshToken, user } =
      await this._interviewerService.login(email, password);
    if (!user) {
      createResponse(response,HttpStatus.OK, false, "Invalid email or password");
      return;
    }
    response.cookie("accessToken",accessToken,COOKIE_OPTIONS);
    createResponse(response,HttpStatus.OK,true,"User LoggedIn Successfully",user)
    return
  }
  async register(request: Request, response: Response) {
    try {
      // Extract data from request body
      const {
        name,
        email,
        position,
        password,
        phone,
        experience,
        linkedinProfile,
        language,
        availability,
        professionalSummary,
        expertise,
      } = request.body;

      // Basic validation (ensure required fields are present)
      if (!name || !email || !password || !phone || !experience) {
        createResponse(response, HttpStatus.BAD_REQUEST, false, "Missing required fields");
        return;
      }

     
      const newInterviewer = await this._interviewerService.register(
        name,
        email,
        position,
        password,
        phone,
        experience,
        linkedinProfile,
        language,
        availability,
        professionalSummary,
        expertise
      );

      createResponse(
        response,
        HttpStatus.OK,
        true,
        "Interviewer Registration Successfully Completed",
        { interviewer: newInterviewer }
      );
      return;
    } catch (error) {
      console.log(error);
      createResponse(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        false,
        "A error occur while registering interveiwer"
      );
      return;
    }
  }
}
