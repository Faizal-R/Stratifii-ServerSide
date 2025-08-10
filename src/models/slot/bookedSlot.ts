import mongoose, { Schema, Document, Types } from "mongoose";
import { ICandidate } from "../candidate/Candidate";
import { ICompany } from "../company/Company";
import { IJob } from "../job/Job";
import { IInterviewer } from "../interviewer/Interviewer";

export interface IBookedSlot extends Document {
  candidate: string | ICandidate;
  interviewer: string | IInterviewer;
  bookedBy: string | ICompany;
  job: string | IJob;

  startTime: Date;
  endTime: Date;
  duration: number; // in minutes

  status: "booked" | "completed" | "cancelled" | "rescheduled" | "no_show";

  meetingLink?: string;
  rescheduledFrom?: Types.ObjectId;
  cancellationReason?: string;

  isRecorded?: boolean;
}

const BookedSlotSchema: Schema = new Schema(
  {
    candidate: { type: Types.ObjectId, ref: "Candidate", required: true },
    interviewer: { type: Types.ObjectId, ref: "Interviewer", required: true },
    bookedBy: { type: Types.ObjectId, ref: "Company", required: true },
    job: { type: Types.ObjectId, ref: "Job", required: true },

    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true }, // in minutes
   
    status: {
      type: String,
      enum: ["booked", "completed", "cancelled", "rescheduled", "no_show"],
      default: "booked",
    },

    meetingLink: { type: String },
    rescheduledFrom: { type: Types.ObjectId, ref: "BookedSlot" },
    cancellationReason: { type: String },

    isRecorded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

BookedSlotSchema.index(
  { candidate: 1, interviewer: 1, startTime: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: "cancelled" } } }
);

export default mongoose.model<IBookedSlot>("BookedSlot", BookedSlotSchema);
