import { Schema, model, Types, Document } from "mongoose";

export interface IPaymentTransaction extends Document {
  company: Types.ObjectId;
  job: Types.ObjectId;
  candidatesCount: number;
  pricePerInterview: number;
  totalAmount: number;
  taxAmount: number;
  platformFee: number;
  finalPayableAmount: number;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  paymentGatewayTransactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PaymentTransactionSchema: Schema = new Schema(
  {
    company: { type: Types.ObjectId, ref: "Company", required: true },
    job: { type: Types.ObjectId, ref: "Job", required: true },
    candidatesCount: { type: Number, required: true },
    pricePerInterview: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    finalPayableAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },

    paymentGatewayTransactionId: { type: String },
  },
  { timestamps: true }
);

export const PaymentTransaction = model<IPaymentTransaction>(
  "PaymentTransaction",
  PaymentTransactionSchema
);
