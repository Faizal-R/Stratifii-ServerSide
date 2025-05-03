import { Schema, model, Types, Document } from "mongoose";
import { ICandidate } from "../candidate/Candidate";

export interface IJob extends Document {
  companyId: Types.ObjectId;
  position: string;
  description?: string;
  requiredSkills: string[];
  deadline: Date;
  status: "open" | "in-progress" | "completed";
  experienceRequired: number;
  candidates?: ICandidateJob[];
  paymentTransactionId?: Types.ObjectId;
  interviewDuration: number; // In minutes, e.g., 60 (for 1 hour)
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICandidateJob {
  candidate: ICandidate;
  interviewStatus: string;
  interviewerId?: Types.ObjectId | null;
  scheduledTime?: Date; // The confirmed scheduled time for the interview
  interviewTimeZone?: string; // Optional: Time zone of the interview
}

const JobSchema: Schema = new Schema(
  {
    company: {
      type: Types.ObjectId,
      ref: "Company",
      required: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed"],
      default: "open",
    },
    experienceRequired: {
      type: Number,
      required: true,
      min: 0,
    },
    interviewDuration: {  // Duration of the interview in minutes (e.g., 60 for 1 hour)
      type: Number,
      required: true,
      default: 60,
    },
    paymentTransactionId: {
      type: Types.ObjectId,
      ref: "PaymentTransaction",
      default: null,
    },

    candidates: [
      {
        candidate: {
          type: Types.ObjectId,
          ref: "Candidate",
          required: true,
        },
        interviewStatus: {
          type: String,
          enum: [
            "pending",
            "mock_started",
            "mock_completed",
            "shortlisted",
            "final_scheduled",
            "final_completed",
            "rejected",
          ],
          default: "pending",
        },
        interviewerId: {
          type: Types.ObjectId,
          ref: "Interviewer",
          default: null,
        },
        scheduledTime: {  // The final confirmed scheduled time for the interview
          type: Date,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const Job = model<IJob>("Job", JobSchema);

export default Job;
