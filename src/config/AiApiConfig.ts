import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config({ path: "src/.env" });

// Initialize the Groq client
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

