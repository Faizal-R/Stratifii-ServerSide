import { Schema, model, Types, Document } from "mongoose";

export interface IJob extends Document {
  companyId: Types.ObjectId; 
  position: string;
  description?: string;
  requiredSkills: string[];
  deadline: Date;
  status: "open" | "in-progress" | "completed";
  experienceRequired: number;
  candidates?: ICandidateJob[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICandidateJob {
  candidateId: Types.ObjectId;
  interviewStatus:
    | "pending"
    | "mock_started"
    | "mock_completed"
    | "shortlisted"
    | "final_scheduled"
    | "final_completed"
    | "rejected";
  interviewerId?: Types.ObjectId | null;
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

    candidates: [
      {
        candidateId: {
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
      },
    ],
  },
  { timestamps: true }
);

const Job = model<IJob>("Job", JobSchema);

export default Job;
