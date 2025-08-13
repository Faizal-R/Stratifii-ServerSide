import mongoose, { Schema, Document, Types } from "mongoose";
import { ICandidate } from "../candidate/Candidate";
import { ICompany } from "../company/Company";
import { IJob } from "../job/Job";
import { IInterviewer } from "../interviewer/Interviewer";

export interface IInterviewFeedback {
  technicalScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  culturalFitScore?: number;
  overallScore?: number;
  strengths?: string;
  areasForImprovement?: string;
  comments?: string;
  recommendation?: "hire" | "no-hire" | "maybe";
}

export interface IInterview extends Document {
  candidate: string | ICandidate;
  interviewer: string | IInterviewer;
  bookedBy: string | ICompany;
  job: string | IJob;

  startTime: Date;
  endTime: Date;
  duration: number; // planned duration (minutes)
  actualDuration?: number;
  bufferDuration?: number;

  status: "booked" | "completed" | "cancelled" | "rescheduled" | "no_show";

  meetingLink?: string;
  rescheduledFrom?: Types.ObjectId;
  cancellationReason?: string;

  isRecorded: boolean;
  recordingUrl?: string;

  feedback?: IInterviewFeedback;

  payoutStatus: "pending" | "paid";

  createdAt?: Date;
  updatedAt?: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    candidate: { type: Types.ObjectId, ref: "Candidate", required: true },
    interviewer: { type: Types.ObjectId, ref: "Interviewer", required: true },
    bookedBy: { type: Types.ObjectId, ref: "Company", required: true },
    job: { type: Types.ObjectId, ref: "Job", required: true },

    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    actualDuration: { type: Number },
    bufferDuration: { type: Number },

    status: {
      type: String,
      enum: ["booked", "completed", "cancelled", "rescheduled", "no_show"],
      default: "booked",
      required: true,
    },

    meetingLink: { type: String },
    rescheduledFrom: { type: Types.ObjectId, ref: "Interview" },
    cancellationReason: { type: String },

    isRecorded: { type: Boolean, default: false },
    recordingUrl: { type: String },

    feedback: {
      technicalScore: { type: Number },
      communicationScore: { type: Number },
      problemSolvingScore: { type: Number },
      culturalFitScore: { type: Number },
      overallScore: { type: Number },
      strengths: { type: String },
      areasForImprovement: { type: String },
      comments: { type: String },
      recommendation: {
        type: String,
        enum: ["hire", "no-hire", "maybe"],
      },
    },

    payoutStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IInterview>("Interview", InterviewSchema);
