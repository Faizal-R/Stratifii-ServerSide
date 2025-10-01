import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriptionFeatures {
  candidateSlotPerMonth: number;
  finalInterviewAccess: boolean;
  interviewRecordingAccess: boolean;
  feedbackDownloadAccess: boolean;
  jobPostLimitPerMonth: number;
  companySpecificQuestionAccess: boolean;
}
export interface ISubscriptionPlanDetails{
  name:string;
  price:number;
  features:ISubscriptionFeatures
}

export interface ISubscriptionRecord extends Document {
  subscriberId: mongoose.Types.ObjectId | string;
  planId: mongoose.Types.ObjectId|string;
  status: "active" | "expired" | "canceled" | "pending";
  planDetails: object |ISubscriptionPlanDetails;
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
