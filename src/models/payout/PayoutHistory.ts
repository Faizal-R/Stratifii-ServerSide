import mongoose, { Schema, Document,} from "mongoose";

export interface IPayoutHistory extends Document {
  interviewerId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  transferId: string;  
  payoutId?: string; 
  status: "pending" | "succeeded" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const payoutHistorySchema:Schema = new Schema(
  {
    interviewerId: { type: Schema.Types.ObjectId, ref: "Interviewer", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "inr" },
    transferId: { type: String, required: true },
    payoutId: { type: String },
    status: { type: String, enum: ["pending", "succeeded", "failed"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model<IPayoutHistory>("PayoutHistory", payoutHistorySchema);
