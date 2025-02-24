import { Document,ObjectId } from "mongoose";

export interface IAvailability {

}

export interface IInterviewer extends Document {
    name: string;
    position: string;
    email: string;
    phone: string;
    password:string;
    experience: number;
    linkedinProfile: string;
    duration?: number;
    location?: string;
    language: Record<string, string>;
    availability:{day:string,timeSlot:string[]}[];
    professionalSummary: string;
    expertise: string[];
    scheduleInterviews?: ObjectId[];
    avatar?: string;
    isVerified: boolean;
    rating?: number;
    reviews?: ObjectId[];
  }
  