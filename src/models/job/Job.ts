import mongoose, { Schema, Document, Types } from "mongoose";

export interface IJob extends Document {
  company: Types.ObjectId;
  position: string;
  description?: string;
  requiredSkills: string[];
  deadline: Date;
  status: "open" | "in-progress" | "completed";
  experienceRequired: number;
  paymentTransactionId?: Types.ObjectId;
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
    },
    description: {
      type: String,
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
    },
    paymentTransactionId: {
      type: Types.ObjectId,
      ref: "PaymentTransaction",
    },
  },
  { timestamps: true }
);

const Job = mongoose.model<IJob>("Job", JobSchema);
export default Job;
