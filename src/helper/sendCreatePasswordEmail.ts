import jwt from "jsonwebtoken";
import { sendEmail } from "./EmailService";
import { createPasswordHtml } from "./wrapHtml";
import { ICandidate } from "../models/candidate/Candidate";
import { Roles } from "../constants/enums/roles";
import { ICompany } from "../models/company/Company";
import redis from "../config/RedisConfig";

import { config } from "dotenv";
config({ path: "src/.env" }) // Load environment variables from .env file
export const sendCreatePasswordEmail = async (candidates: ICandidate[],companyName:string) => {
 
  const frontendBaseUrl = process.env.FRONTEND_URL; // e.g., https://yourdomain.com

  for (const candidate of candidates) {
    const token = await jwt.sign(
      {
        userId: candidate._id as string,
        role: Roles.CANDIDATE,
        email: candidate.email,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "2d" }
    );
    
   await redis.setex(`createPasswordToken:${candidate._id}`, 172800, token);
    const link = `${frontendBaseUrl}/create-password?token=${token}`;
     
    const html = createPasswordHtml(
      candidate.name,
    companyName,
      link
    );
    await sendEmail(
      candidate.email,
      html,
      
      "Action Required - Complete Your Account Setup for Your Interview Process"
    );
  }
};
