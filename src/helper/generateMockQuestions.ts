import Groq from "groq-sdk";
import dotenv from "dotenv";
import { CustomError } from "../error/CustomError";
import { HttpStatus } from "../config/HttpStatusCodes";

dotenv.config({ path: "src/.env" });

// Initialize the Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Define the type for each mock question
export interface IQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: "A" | "B" | "C" | "D";
}

// Exported async function to generate questions
export async function generateMockQuestions(
  jobTitle: string,
  requiredExp: number,
  requiredSkills: string[],
  jobDesc: string
): Promise<IQuestion[] | void> {
  const prompt = `
You are an expert technical interviewer.

Generate 30 advanced multiple-choice questions for the following job post:

Job Title: ${jobTitle}  
Experience Level: ${requiredExp} year  
Required Skills: ${requiredSkills.join(", ")}  
Job Description: ${jobDesc}

Instructions:
- Return the result as a JSON array.
- Each question object must include:
  - "question": (string, the question text)
  - "options": (object with keys A, B, C, D and string values)
  - "answer": (the correct key, e.g., "C")

Guidelines:
- Do NOT return explanations or markdown.
- Make the questions confusing but solvable by skilled candidates and also a bit challenging.
- Questions should reflect real-world issues, edge cases, and traps.
- Only return valid JSON. No text before or after the array.
- Keep the total number of questions between 25 and 30.

Make sure all questions are based on the given skills and experience.
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices[0].message.content;

    if (!result) {
      throw new CustomError(
        "Empty response from Groq API",
        HttpStatus.BAD_REQUEST
      );
    }

    // Try to extract the first valid JSON array from the string
    const match = result.match(/\[\s*{[\s\S]*?}\s*\]/);

    if (!match) {
      throw new CustomError(
        "No valid JSON array found in model response",
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const parsed = JSON.parse(match[0]);
      if (!Array.isArray(parsed)) {
        throw new Error();
      }
      return parsed as IQuestion[];
    } catch {
      throw new CustomError(
        "Invalid JSON format received",
        HttpStatus.BAD_REQUEST
      );
    }
  } catch (err) {
    if (err instanceof CustomError) {
      console.error("❌ API Error or Invalid JSON:", err.message);
      throw err;
    }
  }
}
