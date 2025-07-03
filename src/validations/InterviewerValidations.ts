import { z } from "zod";
;
// Define allowed status values
const statusEnum = z.enum(["pending", "approved", "rejected"]);

// Define interviewer schema 
export const interviewerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  position: z.string().min(2, "Position must be at least 2 characters long"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  experience: z.number().min(0, "Experience cannot be negative"),
  linkedinProfile: z.string().url("Invalid LinkedIn profile URL"),
  location: z.string().optional(),
  languages: z.array(z.object({ language: z.string(), level: z.string() })).optional(), 
  availableDays: z.array(z.string()).nonempty("At least one available day is required"),
  availability: z.array(z.object({
    day: z.string(),
    startTime: z.string(),
    endTime: z.string()
  })).optional(),
  isBlocked:z.boolean().optional(),
  professionalSummary: z.string().min(10, "Professional summary must be at least 10 characters"),
  expertise: z.array(z.string()).nonempty("At least one expertise area is required"),
  scheduleInterviews: z.array(z.string()).optional(), // Array of ObjectIds (strings)
  avatar: z.string().optional(),
  isVerified: z.boolean().default(false),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.array(z.string()).optional(), // Array of ObjectIds (strings)
  status: statusEnum.default("pending").optional(), // Default status is "pending"
  resume: z
  .custom<Express.Multer.File>((file) => file instanceof File, {
    message: "Resume file is required",
  }).optional()
});




export const InterviewerProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Invalid phone number"),
  experience: z.number().min(0, "Experience must be a positive number"),
  linkedinProfile: z.string().url("Invalid LinkedIn profile URL"),
  duration: z.number().optional(),
  location: z.string().optional(),
  languages: z.array(z.object({ language: z.string(), level: z.string() })).optional(), 
  availableDays: z.array(z.string()).min(1, "At least one available day is required"),
  professionalSummary: z.string().min(1, "Professional summary is required"),
  expertise: z.array(z.string()).min(1, "At least one expertise is required"),
  avatar: z.string().url("Invalid avatar URL").optional(),
  rating: z.number().min(0).max(5).optional(),
  status: z.enum(["approved", "pending", "rejected"]),
});



export type IInterviewerProfile = z.infer<typeof InterviewerProfileSchema>;

