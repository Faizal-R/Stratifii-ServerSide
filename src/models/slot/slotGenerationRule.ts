import { Schema, model, Types, Document } from "mongoose";

export interface ISlotGenerationRule extends Document {
  interviewerId: Types.ObjectId;
  availableDays: number[]; // 0 = Sunday, ..., 6 = Saturday
  startHour: number; // 0 to 23
  endHour: number; // 1 to 24
  duration: number; // 15 to 180
  buffer: number; // in minutes
  timezone?: string; // default: 'UTC'
  generatedSlotCount?: number; // default: 0
  createdAt?: Date;
  updatedAt?: Date;
}

const slotGenerationRuleSchema = new Schema(
  {
    interviewerId: {
      type: Types.ObjectId,
      ref: "Interviewer",
      required: true,
    },
    availableDays: {
      type: [Number],
      required: true,
      validate: {
        validator: (days: number[]) =>
          days.every((day) => day >= 0 && day <= 6),
        message: "Available days must be between 0 (Sunday) and 6 (Saturday).",
      },
    },

    startHour: {
      type: Number,
      required: true,
      min: 0,
      max: 23,
    },

    endHour: {
      type: Number,
      required: true,
      min: 1,
      max: 24,
    },

    duration: {
      type: Number,
      required: true,
      min: 15,
      max: 180,
    },

    buffer: {
      type: Number,
      required: true,
      min: 0,
      max: 60,
    },

    timezone: {
      type: String,
      default: "UTC",
    },

    generatedSlotCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const SlotGenerationRule = model<ISlotGenerationRule>(
  "SlotGenerationRule",
  slotGenerationRuleSchema
);

export default SlotGenerationRule;
