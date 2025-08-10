import mongoose, { Schema, Document, Types } from "mongoose";
import { ICandidate } from "./Candidate";
import { ICompany } from "../company/Company";
import { IJob } from "../job/Job";

export interface IDelegatedCandidate extends Document {
  candidate: Types.ObjectId | ICandidate;
  company: Types.ObjectId | ICompany;
  job: Types.ObjectId | IJob;
  status:
    | "mock_pending"
    | "mock_started"
    | "mock_completed"
    | "mock_failed"
    | "shortlisted"
    | "final_scheduled"
    | "final_completed"
    | "rejected";
 isInterviewScheduled?:boolean;
  interviewTimeZone?: string;
  feedback?: string;
  aiMockResult?: {
    totalQuestions: number;
    correctAnswers: number;
    scoreInPercentage: number;
  };
  isQualifiedForFinal?: boolean;
}

const DelegatedCandidateSchema: Schema = new Schema(
  {
    candidate: {
      type: Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    company: {
      type: Types.ObjectId,
      ref: "Company",
      required: true,
    },
    job: {
      type: Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "mock_pending",
        "mock_started",
        "mock_completed",
        "mock_failed",
        "shortlisted",
        "final_scheduled",
        "final_completed",
        "rejected",
      ],
      default: "mock_pending",
    },
    isQualifiedForFinal: {
      type: Boolean,
      default: false,
    },

    aiMockResult: {
      type: new Schema(
        {
          totalQuestions: { type: Number, required: true },
          correctAnswers: { type: Number, required: true },
          scoreInPercentage: { type: Number, required: true },
        },
        { _id: false }
      ),
    },
    isInterviewScheduled: {
      type: Boolean,
    },
    interviewTimeZone: {
      type: String,
    },
    feedback: {
      type: String,
    },
  },
  { timestamps: true }
);

const DelegatedCandidate = mongoose.model<IDelegatedCandidate>(
  "DelegatedCandidate",
  DelegatedCandidateSchema
);

DelegatedCandidateSchema.index(
  { candidate: 1, company: 1, job: 1 },
  { unique: true }
);

export default DelegatedCandidate;
