import mongoose, { Schema, Document } from "mongoose";

export interface ICandidate extends Document {
  email: string;
  password?: string;
  name: string;
  resume: string;
  avatar?: string;
  status?: "active" | "pending" | "deactive";
  isBlocked?: boolean;
}

const CandidateSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String },
    name: { type: String, required: true, trim: true },
    avatar: { type: String },
    resume: { type: String },
    status: { type: String, enum: ["active", "pending", "deactive"], default: "pending" },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Candidate = mongoose.model<ICandidate>("Candidate", CandidateSchema);
export default Candidate;
