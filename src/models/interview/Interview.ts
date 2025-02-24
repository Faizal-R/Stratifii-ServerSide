import mongoose, { Document, Schema, ObjectId } from "mongoose";

export interface IInterview extends Document {
  companyId: ObjectId;
  feedback: string[];
  position: string;
  experience: number;
  isCancelled: boolean;
  candidateId: ObjectId;
  score: string;
  type: string;
  status: string;
  meetingId: string;
  scheduledDate: Date;
  duration: number;
}

const InterviewSchema: Schema = new Schema(
  {
    feedback: [
      {
        type: String,
      },
    ],
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    score: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    meetingId: {
      type: String,
      required: false,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model<IInterview>("Interview", InterviewSchema);

export default Interview;
