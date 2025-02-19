import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/database";

dotenv.config({ path: "src/.env" });
const PORT = process.env.PORT;

const app = express();

app.use(cookieParser());

connectDB();


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
