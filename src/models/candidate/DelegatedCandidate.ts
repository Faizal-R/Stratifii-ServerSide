import mongoose, { Schema, Document, Types } from "mongoose";
import { ICandidate } from "./Candidate";
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
  recommendation?: "hire" | "no-hire" | "maybe"|"next-round";
  needsFollowUp?: boolean;
  suggestedFocusAreas?: string[];
  internalNotes?: string;
}

export interface IInterviewRound {
  roundNumber: number;
  type: "mock" | "final" | "followup";
  timeZone?: string;
  status:
    | "pending"
    | "followup"
    | "completed"
    | "cancelled";
  feedback?: IInterviewFeedback;
  interviewer: string | IInterviewer;
  isFollowUpScheduled: boolean;
}

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
    | "in_interview_process"
    | "hired"
    | "rejected";
  interviewRounds: IInterviewRound[];
  totalNumberOfRounds: number;
  isQualifiedForFinal?: boolean;
  aiMockResult?: {
    totalQuestions: number;
    correctAnswers: number;
    scoreInPercentage: number;
  };

  mockInterviewDeadline?: Date;
  isInterviewScheduled?: boolean;
}

const InterviewFeedbackSchema = new Schema<IInterviewFeedback>(
  {
    technicalScore: Number,
    communicationScore: Number,
    problemSolvingScore: Number,
    culturalFitScore: Number,
    overallScore: Number,
    strengths: String,
    areasForImprovement: String,
    comments: String,
    recommendation: {
      type: String,
      enum: ["hire", "no-hire", "maybe", "next-round"],
    },
    needsFollowUp: { type: Boolean, default: false },
    suggestedFocusAreas: [{ type: String }],
  },
  { _id: false }
);

const InterviewRoundSchema = new Schema<IInterviewRound>(
  {
    roundNumber: { type: Number, required: true },
    type: { type: String, enum: ["final", "followup"], required: true },
    timeZone: String,
    status: {
      type: String,
      enum: [ "followup", "completed", "cancelled"],
      default: "pending",
    },
    feedback: { type: InterviewFeedbackSchema },
    interviewer: { type: Types.ObjectId, ref: "Interviewer" },
    isFollowUpScheduled: { type: Boolean, default: false },
  },
  { _id: false }
);

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
        "in_interview_process",
        "hired",
        "rejected",
      ],
      default: "mock_pending",
    },
    totalNumberOfRounds: {
      type: Number,
      default: 0,
    },
    isInterviewScheduled: {
      type: Boolean,
      default: false,
    },
    interviewRounds: [InterviewRoundSchema],
    isQualifiedForFinal: {
      type: Boolean,
      default: false,
    },
    mockInterviewDeadline: Date,
    aiMockResult: {
      type: new Schema(
        {
          totalQuestions: { type: Number, required: true },
          correctAnswers: { type: Number, required: true },
          scoreInPercentage: { type: Number, required: true },
          status: { type: String },
        },
        { _id: false }
      ),
    },
  },
  { timestamps: true }
);

DelegatedCandidateSchema.index(
  { candidate: 1, company: 1, job: 1 },
  { unique: true }
);

const DelegatedCandidate = mongoose.model<IDelegatedCandidate>(
  "DelegatedCandidate",
  DelegatedCandidateSchema
);

export default DelegatedCandidate;
