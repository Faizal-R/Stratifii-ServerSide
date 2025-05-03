import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriptionRecord extends Document {
  subscriberId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  status: "active" | "expired" | "canceled" | "pending";
  planDetails: Object;
  startDate: Date;
  endDate: Date;
  transactionId: string;
}

const SubscriptionRecordSchema = new Schema<ISubscriptionRecord>(
  {
    subscriberId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
    },
    planDetails: {
      type: Object,
    }, //(name, price, features)
    status: {
      type: String,
      enum: ["active", "expired", "canceled", "pending"],
      default: "pending",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    transactionId: { type: String, required: true },
  },
  { timestamps: true }
);

const SubscriptionRecord = mongoose.model<ISubscriptionRecord>(
  "SubscriptionRecord",
  SubscriptionRecordSchema
);
export default SubscriptionRecord;
