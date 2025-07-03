import { Schema,Document, Types,model } from 'mongoose';

export interface IInterviewSlot extends Document {
  interviewerId: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  duration: number;
  isAvailable: boolean;
  status: 'available' | 'booked' | 'completed' | 'cancelled' | 'expired';
  bookedBy?: Types.ObjectId | null;
  meetingLink?: string;
  ruleId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}


const interviewSlotSchema = new Schema({
  interviewerId: {
    type: Types.ObjectId,
    ref: "Interviewer",
    required: true
  },

  startTime: {
    type: Date,
    required: true
  },

  endTime: {
    type: Date,
    required: true
  },

  duration: {
    type: Number,
    required: true
  },

  isAvailable: {
    type: Boolean,
    default: true
  },

  status: {
    type: String,
    enum: ['available', 'booked', 'completed', 'cancelled', 'expired'],
    default: 'available'
  },

  bookedBy: {
    type: Types.ObjectId,
    ref: "Company",
    default: null
  },

  meetingLink: {
    type: String
  },

  ruleId: {
  type:Types.ObjectId,
  ref: "SlotGenerationRule"
}


}, { timestamps: true });

 const InterviewSlot = model<IInterviewSlot>("InterviewSlot", interviewSlotSchema);
export default InterviewSlot
