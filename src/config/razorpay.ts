import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

import razorpayXSDK from "razorpayx-nodejs-sdk";

// Initialize RazorpayX SDK
export const { Contact, FundAccount, Payout } = razorpayXSDK(
 process.env.RAZORPAY_API_KEY!,
  process.env.RAZORPAY_SECRET_KEY!
);