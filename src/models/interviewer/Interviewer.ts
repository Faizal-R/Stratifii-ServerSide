import mongoose, { Document,ObjectId,Schema } from "mongoose";
interface ITimeSlot{
  startTime:string,
  endTime:string
}
type Availability = {
  day: string;
  timeSlot?: ITimeSlot[];
};

export type TStatus= "pending" | "approved" | "rejected"

export interface IInterviewer extends Document {
    name: string;
    position: string;
    email: string;
    phone: string;
    password:string;
    experience: number;
    linkedinProfile: string;
    location?: string;
    languages:{
      language:string;
      level:string;
    }[];
    availableDays:string[];
    availability?:Availability[];
    professionalSummary: string;
    expertise: string[];
    scheduleInterviews?: ObjectId[];
    avatar?: string;
    isVerified: boolean;
    rating?: number;
    reviews?: ObjectId[];
    status?:TStatus
    isBlocked?:boolean
  }

  export interface IGoogleInterviewer extends Document{
    name:string;
    email:string;
  }
  

const interviewerSchema: Schema = new Schema(
  {
    name: {
      type: String,
    },
    position: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,

      unique: true,
    },
    phone: {
      type: String,
    },
    experience: {
      type: Number,
    },
    linkedinProfile: {
      type: String,
    },
    duration: {
      type: Number,
    },
    location: {
      type: String,
    },
    language: [{
      language: { type: String },
      level: { type: String },
    }],
    availableDays: [{ type: String }],

    availability: [
      {
        type: Object,
      },
    ],
    professionalSummary: {
      type: String,
    },
    expertise: [
      {
        type: String,
      },
    ],
    scheduleInterviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview",
      },
    ],
    avatar: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,

      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    isBlocked:{
     type:Boolean,
     default:false
    },
  },
  {
    timestamps: true,
  }
);

const Interviewer = mongoose.model<IInterviewer>(
  "Interviewer",
  interviewerSchema
);

export default Interviewer;
