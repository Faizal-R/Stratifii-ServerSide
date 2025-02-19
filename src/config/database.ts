import mongoose from "mongoose";

export default async function connectDB() {
  try {

    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("MongoDB Connected");

  } catch (error) {

    console.error(error);
    process.exit(1);
    
  }
}
