import mongoose, { Schema, Document, Types } from "mongoose";
import { ICompany } from "../company/Company";

export interface IJob extends Document {
  _id:string;
  company: Types.ObjectId | ICompany;
  position: string;
  description?: string;
  requiredSkills: string[];
  status: "open" | "in-progress" | "completed";
  experienceRequired: number;
  paymentTransaction?: Types.ObjectId;
  createdAt:Date;
  updatedAt:Date;
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
    status: {
      type: String,
      enum: ["open", "in-progress", "completed"],
      default: "open",
    },
    experienceRequired: {
      type: Number,
      required: true,
    },
    paymentTransaction: {
      type: Types.ObjectId,
      ref: "PaymentTransaction",
    },
  },
  { timestamps: true }
);

const Job = mongoose.model<IJob>("Job", JobSchema);
export default Job;
