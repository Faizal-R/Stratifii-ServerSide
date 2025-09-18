import { Schema, model, Types, Document } from "mongoose";
export interface IPayoutLog extends Document {
  payoutRequestId: Types.ObjectId;
  action: string;
  performedBy: Types.ObjectId;
  performedByRole: "admin" | "system" | "interviewer";
  createdAt: Date;
}

const PayoutLogSchema = new Schema<IPayoutLog>(
  {
    payoutRequestId: { type: Schema.Types.ObjectId, ref: "PayoutRequest" },
    action: { type: String, required: true },
    performedBy: { type: Schema.Types.ObjectId },
    performedByRole: { type: String, enum: ["admin", "system", "interviewer"] },
  },
  { timestamps: true }
);

export const PayoutLog = model<IPayoutLog>("PayoutLog", PayoutLogSchema);
