import mongoose, { Document, Schema, Types } from "mongoose";
import { TStatus } from "../../types/sharedTypes";

export interface IGoogleInterviewer extends Document {
  name: string;
  email: string;
  avatar?: string;
}
export interface IBankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifsc: string;
  upiId?: string;
  addedAt?: string;
  updatedAt?: string;
}

export type TProficiencyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";
export type TSkillSource =
  | "professional"
  | "academic"
  | "personal"
  | "certification";

export interface ISkillExpertise {
  skill: string;
  proficiencyLevel: TProficiencyLevel;
  yearsOfExperience?: number;
  skillSource: TSkillSource[];
}

export interface IInterviewer extends Document {
  _id: string | Types.ObjectId;
  name: string;
  position?: string;
  email: string;
  phone?: string;
  password?: string;
  experience?: number;
  linkedinProfile?: string;
  expertise?: ISkillExpertise[];
  avatarKey?: string;
  isVerified: boolean;
  status?: TStatus;
  isBlocked?: boolean;
  stripeAccountId?:string;
  bankDetails?: IBankDetails;
  resumeKey?: string 
  resubmissionPeriod?:string|null;
  resubmissionNotes:string;
  resubmissionCount:number;
   isBannedPermanently:boolean ;
  createdAt: Date;
  updatedAt?: Date;
}

// Skill expertise sub-schema
const skillExpertiseSchema = new Schema(
  {
    skill: {
      type: String,
      trim: true,
    },
    proficiencyLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "beginner",
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      default: 0,
    },
    skillSource: [
      {
        type: String,
        enum: ["professional", "academic", "personal", "certification"],
      },
    ],
  },
  { _id: false }
);

// Main interviewer schema
const interviewerSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,

      trim: true,
    },
    linkedinProfile: {
      type: String,
      trim: true,
    },
    password: {
      type: String,

      minlength: 6,
    },
    experience: {
      type: Number,
      min: 0,
    },
    expertise: {
      type: [skillExpertiseSchema],
    },
    avatarKey: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
   
    stripeAccountId:{
      type: String
    },
    bankDetails: {
      type:{

        accountHolderName: String,
        accountNumber: String,
        ifsc: String,
        upiId: String,
        addedAt: Date,
        updatedAt: Date,
      },
      default:null
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
    resumeKey: {
      type: String,
      default: null,
    },
     isBannedPermanently: { type: Boolean, default: false },
    resubmissionPeriod:{
      type:Date,
      default:null
    },
    resubmissionNotes:{
      type:String,
      default:null
    },
    resubmissionCount:{
      type:Number,
      default:0
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
interviewerSchema.index({ email: 1 });
interviewerSchema.index({ status: 1 });
interviewerSchema.index({ isVerified: 1 });
interviewerSchema.index({ "expertise.skill": 1 });
interviewerSchema.index({ "expertise.proficiencyLevel": 1 });

const Interviewer = mongoose.model<IInterviewer>(
  "Interviewer",
  interviewerSchema
);

export default Interviewer;
