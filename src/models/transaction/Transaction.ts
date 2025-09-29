import { model, Types, Schema, Document } from "mongoose";

export type UserType = "interviewer" | "company";

export interface ITransaction extends Document {
  walletId: Types.ObjectId;
  type: "credit" | "debit";
  amount: number;
  currency: string;
  description?: string;
  referenceType: "interview" | "payout" | "adjustment";
  referenceId?: Types.ObjectId;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    description: { type: String },
    referenceType: {
      type: String,
      enum: ["interview", "payout", "adjustment"],
      required: true,
    },
    referenceId: { type: Schema.Types.ObjectId },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);




export const Transaction = model<ITransaction>(
  "Transaction",
  TransactionSchema
);
