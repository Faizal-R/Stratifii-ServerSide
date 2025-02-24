import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { IInterviewer } from "../../interfaces/IInterviewerModel";
import { string } from "zod";

const interviewerSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    password:{
      type:String,
      required:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    linkedinProfile: {
      type: String,
      required:true
    },
    duration: {
      type: Number,
    },
    location: {
      type: String,
    },
    language: {
      type: Object,
      required: false,
    },
    availability: [
      {
        type: Object, 
      },
    ],
    professionalSummary: {
      type: String,
      required: false,
    },
    expertise: [
      {
        type: String,
        required: false,
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
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      required: false,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review", 
      },
    ],
  },
  {
    timestamps: true, 
  }
);

const Interviewer=mongoose.model<IInterviewer>("Interviewer", interviewerSchema);

export default Interviewer
