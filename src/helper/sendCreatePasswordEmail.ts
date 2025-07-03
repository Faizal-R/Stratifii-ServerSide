import jwt from "jsonwebtoken";
import { sendEmail } from "./EmailService";
import { createPasswordHtml } from "./wrapHtml";
import { generateAccessToken } from "./generateTokens";
import { ICandidate } from "../models/candidate/Candidate";
import { Roles } from "../constants/roles";
import { ICompany } from "../models/company/Company";
import redis from "../config/RedisConfig";

import { config } from "dotenv";
config({ path: "src/.env" }) // Load environment variables from .env file
export const sendCreatePasswordEmail = async (candidates: ICandidate[]) => {
  const html = `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">

  <h2 style="color: #0b5ed7;">Action Required - Complete Your Account Setup for Your Interview Process</h2>

  <p>Hi {{candidateName}},</p>

  <p>
    You have been nominated by <strong>{{companyName}}</strong> to proceed with the interview process through our official interview management platform — <strong>Stratifii Interviews</strong>.
  </p>

  <p>
    In order to continue with your interview journey, you are required to set up your account by creating a password. This account will allow you to:
  </p>

  <ul>
    <li>Access your interview dashboard</li>
    <li>View interview schedules & updates</li>
    <li>Join mock & final interviews</li>
    <li>Receive feedback and results</li>
  </ul>

  <p style="color: #d9534f; font-weight: bold;">
    Please note: You have <strong>2 days</strong> to complete your account setup. After this time, your interview process may be delayed or cancelled.
  </p>

  <p>
    Click the button below to securely create your password and activate your account:
  </p>

  <p style="text-align: center; margin: 30px 0;">
    <a href="{{passwordCreationLink}}" style="background-color: #0b5ed7; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
      Create My Password
    </a>
  </p>

  <p>
    This step is mandatory to proceed further with the interview process initiated by <strong>{{companyName}}</strong>.
  </p>

  <p>If you were not expecting this email or have any concerns, please contact us at <a href="mailto:support@stratifii.com">support@stratifii.com</a>.</p>

  <p>Regards,<br/>Stratifii Interviews Team</p>

</div>
`;
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
      (candidate.companyId as ICompany).companyName,
      link
    );
    await sendEmail(
      candidate.email,
      html,
      "Action Required - Complete Your Account Setup for Your Interview Process"
    );
  }
};
