import { Document } from "mongoose";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helper/generateTokens";
import { IInterviewer } from "../../interfaces/IInterviewerModel";
import { InterviewerRepository } from "../../repositories/interviewer/InterviewerRepository";
import { comparePassword, hashPassword } from "../../utils/hash";
import { IInterviewerService } from "./IInterviewerService";

export class InterviewerService implements IInterviewerService {
  constructor(private readonly _interviewerRepository: InterviewerRepository) {}

  async login(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IInterviewer;
  }> {
    const user = await this._interviewerRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    const accessToken = generateAccessToken(user._id as string);
    const refreshToken = generateRefreshToken(user._id as string);
    return { accessToken, refreshToken, user };
  }
  async register(
    name: string,
    email: string,
    position: string,
    password: string,
    phone: string,
    experience: number,
    linkedinProfile: string,
    language: Record<string, string>,
    availability: { day: string; timeSlot: string[] }[],
    professionalSummary: string,
    expertise: string[]
  ): Promise<IInterviewer> {
    // Check if email already exists
    const existingUser = await this._interviewerRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
    
     //Removing the unnecessary Documents properites
    type InterviewerInput = Omit<IInterviewer, keyof Document>;

    // Create the interviewer object
    const newInterviewer: InterviewerInput = {
      name,
      email,
      position,
      password: hashedPassword,
      phone,
      experience,
      linkedinProfile,
      language,
      availability,
      professionalSummary,
      expertise,
      isVerified: false,
    };

  
    return await this._interviewerRepository.create(
        newInterviewer
      );
  
  }
}
