import Groq from "groq-sdk";
import dotenv from "dotenv";
import { CustomError } from "../error/CustomError";
import { HttpStatus } from "../config/HttpStatusCodes";

dotenv.config();

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
You are a senior-level technical interviewer with 15+ years of real-world industry experience.  

Your task is to generate **40 advanced and highly challenging multiple-choice technical questions** for the following job post:

Job Title: ${jobTitle}  
Experience Level: ${requiredExp} years  
Required Skills: ${requiredSkills}  
Job Description: ${jobDesc}  

### Output Format (STRICT):
Return ONLY a valid JSON array of 40 objects.  
Each object must have the following structure:
{
  "question": "string",
  "options": {
    "A": "string",
    "B": "string",
    "C": "string",
    "D": "string"
  },
  "answer": "A" | "B" | "C" | "D"
}

### Question Guidelines:
1. Difficulty: Extremely challenging — only strong, skilled candidates should be able to solve them.  
2. Content:  
   - Cover edge cases, tricky scenarios, and real-world system-level problems.  
   - Include performance bottlenecks, scalability trade-offs, debugging traps, and security pitfalls.  
   - For coding-related skills, focus on algorithmic complexity, memory optimization, concurrency, and architectural decisions.  
3. Style:  
   - Questions must feel like they could come directly from a **high-bar technical interview (FAANG-level)**.  
   - Avoid theory-only; prioritize applied, practical, real-world challenges.  
   - Each question must be unique and non-repetitive.  
4. Answer Rules:  
   - Ensure exactly one correct answer.  
   - Do not include explanations, reasoning, or markdown formatting.  
   - No text before or after the JSON array.  

### Important:
- Return exactly 40 questions.  
- Output must be **strict JSON** with no additional text, comments, or formatting.  

`;


  try {
   
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });
  
     console.log("completion",completion);

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
      console.log("parsed questions",parsed);
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
    console.log("Error while generating mock questions",err)
    if (err instanceof CustomError) {
      console.error("❌ API Error or Invalid JSON:", err.message);
      throw err;
    }
  }
}
