import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriptionFeatures {
  candidateSlotPerMonth: number;
  finalInterviewAccess: boolean;
  interviewRecordingAccess: boolean;
  feedbackDownloadAccess: boolean;
  jobPostLimitPerMonth: number;
  companySpecificQuestionAccess: boolean;
}

export interface ISubscriptionPlan extends Document {
  name: string; // Plan Name (Basic, Pro, Elite etc.)
  price: number; // Price of Plan
  isActive: boolean;
  features: ISubscriptionFeatures; // Plan Features
}

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    isActive: { type: Boolean, required: true },
    features: {
      candidateSlotPerMonth: { type: Number, required: true },
      finalInterviewAccess: { type: Boolean, required: true },
      interviewRecordingAccess: { type: Boolean, required: true },
      feedbackDownloadAccess: { type: Boolean, required: true },
      jobPostLimitPerMonth: { type: Number, required: true },
      companySpecificQuestionAccess: { type: Boolean, required: true },
    },
  },         
  { timestamps: true }
);

const SubscriptionPlan = mongoose.model<ISubscriptionPlan>(
  "SubscriptionPlan",
  subscriptionPlanSchema
);

export default SubscriptionPlan;
