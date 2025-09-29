import { Document, model, Schema, Types } from "mongoose";
export type PayoutStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "processing"
  | "completed"
  | "failed";

export interface IPayoutRequest extends Document {
  interviewerId: Types.ObjectId;
  amount: number;
  status: PayoutStatus;
  requestedAt: Date;
  approvedAt?: Date;
  processedAt?: Date;
  payoutId?: string; // Razorpay payout id
  failureReason?: string;
  adminId?: Types.ObjectId;
  interviewerName:string;
}

const PayoutRequestSchema:Schema = new Schema({
  interviewerName: { type: String },
  interviewerId: { type: Schema.Types.ObjectId, ref: "Interviewer", required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String,
    enum: ["pending", "approved", "rejected", "processing", "completed", "failed"],
    default: "pending"
  },
  requestedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  processedAt: { type: Date },
  payoutId: { type: String },
  failureReason: { type: String },
  adminId: { type: Schema.Types.ObjectId, ref: "Admin" },
});

 const PayoutRequest = model<IPayoutRequest>("PayoutRequest", PayoutRequestSchema);
export default PayoutRequest