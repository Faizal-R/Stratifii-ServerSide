import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICandidate extends Document {
  _id:Types.ObjectId | string;
  email: string;
  password?: string;
  name: string;
  resumeKey: string;
  avatarKey?: string;
  status?: "active" | "pending" | "deactive";
  isBlocked?: boolean;
}

const CandidateSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String },
    name: { type: String, required: true, trim: true },
    avatarKey: { type: String },
    resumeKey: { type: String },
    status: { type: String, enum: ["active", "pending", "deactive"], default: "pending" },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Candidate = mongoose.model<ICandidate>("Candidate", CandidateSchema);
export default Candidate;
