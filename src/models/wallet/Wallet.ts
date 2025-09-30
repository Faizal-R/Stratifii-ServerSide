import { Schema, model, Types, Document } from "mongoose";
import { Roles } from "../../constants/enums/roles";

// Transaction interface
interface ITransaction {
  type: "credit" | "debit";
  amount: number;
  source?: string;
  referenceId?: Types.ObjectId;
  createdAt?: Date;
}

export interface IWallet extends Document {
  userId: Types.ObjectId;
  userType: Roles.COMPANY | Roles.INTERVIEWER;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  updatedAt: Date;
}

const WalletSchema: Schema = new Schema({
  userId: { type: Types.ObjectId, required: true },
  userType: {
    type: String,
    enum: [Roles.INTERVIEWER, Roles.COMPANY],
    required: true,
  },

  balance: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },

  updatedAt: { type: Date, default: Date.now },
});

// Auto-update updatedAt
WalletSchema.pre<IWallet>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Wallet = model<IWallet>("Wallet", WalletSchema);
