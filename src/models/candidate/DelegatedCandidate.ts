import mongoose, { Schema, Document, Types } from "mongoose";
import { ICandidate } from "./Candidate";

export interface IDelegatedCandidate extends Document {
  candidate: Types.ObjectId|ICandidate;
  company: Types.ObjectId;
  job: Types.ObjectId;
  status:
    | "mock_pending"
    | "mock_started"
    | "mock_completed"
    | "shortlisted"
    | "final_scheduled"
    | "final_completed"
    | "rejected";
  assignedInterviewer?: Types.ObjectId;
  scheduledTime?: Date;
  interviewTimeZone?: string;
  feedback?: string;
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
        "shortlisted",
        "final_scheduled",
        "final_completed",
        "rejected",
      ],
      default: "mock_pending",
    },
    assignedInterviewer: {
      type: Types.ObjectId,
      ref: "Interviewer",
    },
    scheduledTime: {
      type: Date,
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
