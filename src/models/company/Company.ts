import mongoose, { Schema, Document, Types } from "mongoose";
import { TStatus } from "../interviewer/Interviewer";
// import { TStatus } from "./IInterviewerModel"; // Ensure this module exists or remove if not needed

export interface ICompany extends Document {
  companyName: string;
  email: string;
  companyLogo?: string;
  headquartersLocation?: string;
  companyWebsite: string;
  registrationCertificateNumber: string;
  linkedInProfile: string;
  phone: string;
  password: string;
  companyType: string;
  isVerified?: boolean;
  status?: TStatus;
  isBlocked?: boolean;
  description?: string;
  companySize?: string;
  numberOfEmployees?: string;
  activePlan?: Types.ObjectId | null;
  usage?: {
    candidatesAddedThisMonth: number;
    jobPostsThisMonth: number;
  };
}

const CompanySchema: Schema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    companyWebsite: {
      type: String,
      required: true,
      trim: true,
    },
    registrationCertificateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    linkedInProfile: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    companyType: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },
    companySize: {
      type: String,
      enum: ["Small", "Medium", "Startup", "Enterprise"],
    },
    numberOfEmployees: {
      type: String,
    },
    headquartersLocation: {
      type: String,
    },
    companyLogo: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    activePlan: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionRecord",
      default: null,
    },
    usage: {
      jobPostsThisMonth: {
        type: Number,
        default: 0,
      },
      candidateAddedThisMonth: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model<ICompany>("Company", CompanySchema);

export default Company;
