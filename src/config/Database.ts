import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "src/.env" });
export default async function connectDB() {
  try {

    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("MongoDB Connected");

  } catch (error) {

    console.error(error);
    process.exit(1);
    
  }
}
