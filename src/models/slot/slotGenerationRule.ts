import { Schema, model, Types, Document } from "mongoose";

export interface ISlotGenerationRule extends Document {
  interviewerId: Types.ObjectId;
  availableDays: number[]; // 0 = Sunday, ..., 6 = Saturday
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  duration: number;
  buffer: number;
  timezone?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const slotGenerationRuleSchema = new Schema(
  {
    interviewerId: { type: Types.ObjectId, ref: "Interviewer", required: true },
    availableDays: {
      type: [Number],
      required: true,
      validate: {
        validator: (days: number[]) =>
          days.every((day) => day >= 0 && day <= 6),
        message: "Available days must be between 0 (Sunday) and 6 (Saturday).",
      },
    },
    startHour: { type: Number, required: true, min: 0, max: 23 },
    startMinute: { type: Number, required: true, min: 0, max: 59, default: 0 },
    endHour: { type: Number, required: true, min: 1, max: 24 },
    endMinute: { type: Number, required: true, min: 0, max: 59, default: 0 },
    duration: { type: Number, required: true, min: 15, max: 180 },
    buffer: { type: Number, required: true, min: 0, max: 60 },
    timezone: { type: String, default: "UTC" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

slotGenerationRuleSchema.index({ interviewerId: 1 }, { unique: true });

const SlotGenerationRule = model<ISlotGenerationRule>(
  "SlotGenerationRule",
  slotGenerationRuleSchema
);

export default SlotGenerationRule;
