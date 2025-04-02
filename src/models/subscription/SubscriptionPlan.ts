import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriptionPlan extends Document {
  name: "Base" | "Premium" | "Elite";
  price: number;
  features: string[];
  isActive:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: {
      type: String,
      enum: ["Base", "Premium", "Elite"],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    features: {
      type: [String],
      required: true,
    },
    isActive:{
      type: Boolean,
      default: false,
      required: true,
    }
  },
  { timestamps: true }
);

const SubscriptionPlan = mongoose.model<ISubscriptionPlan>(
  "SubscriptionPlan",
  SubscriptionPlanSchema
);

export default SubscriptionPlan