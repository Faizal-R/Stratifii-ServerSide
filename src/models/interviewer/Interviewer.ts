import mongoose, { Document, Schema, Types } from "mongoose";
import { TStatus } from "../../types/sharedTypes";

export interface IGoogleInterviewer extends Document {
  name: string;
  email: string;
  avatar?:string;
}

export type TProficiencyLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type TSkillSource = "professional" | "academic" | "personal" | "certification";

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
  avatar?: string;
  isVerified: boolean;
  rating?: number;
  status?: TStatus;
  isBlocked?: boolean;
  resume?: string | Express.Multer.File;
}


// Skill expertise sub-schema
const skillExpertiseSchema = new Schema({
  skill: {
    type: String,
    trim: true
  },
  proficiencyLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", "expert"],
    default: "beginner"
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    default: 0 
  },
  skillSource: [{
    type: String,
    enum: ["professional", "academic", "personal", "certification"],
  }]
}, { _id: false });

// Main interviewer schema
const interviewerSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
     
      trim: true
    },
    linkedinProfile: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      
      minlength: 6
    },
    experience: {
      type: Number,
     
      min: 0
    },
    expertise: {
      type: [skillExpertiseSchema],
      // validate: {
      //   validator: function(v: ISkillExpertise[]) {
      //     return v.length > 0;
      //   },
      //   message: "At least one skill expertise is required"
      // }
    },
    avatar: {
      type: String,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"]
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    resume: {
      type: String,
      default: null
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