export interface companyRegisterRequestDTO {
    name: string;
    email: string;
    password: string;
}
import { z } from "zod";

const statusEnum = z.enum(["pending", "approved", "rejected"]);

const SkillProficiencyLevels = ["beginner", "intermediate", "advanced", "expert"] as const;
const SkillSources = ["professional", "academic", "personal", "certification"] as const;

// Skill Expertise Zod schema
export const SkillExpertiseSchema = z.object({
  skill: z.string().min(1, "Skill name is required"),
  proficiencyLevel: z.enum(SkillProficiencyLevels, {
    errorMap: () => ({ message: "Invalid proficiency level" }),
  }),
  yearsOfExperience: z.number().min(0, "Experience must be a positive number").optional(),
  skillSource: z
    .array(z.enum(SkillSources))
    .min(1, "At least one skill source is required"),
});

export const InterviewerRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  linkedinProfile: z.string().url("Invalid LinkedIn profile URL"),
  position: z.string().min(2, "Position must be at least 2 characters long"),
  experience: z.number().min(0, "Experience cannot be negative"),
  expertise: z
    .array(SkillExpertiseSchema)
    .min(1, "At least one expertise area is required"),

  // resume: z
  //   .custom<File | null>((file) => file instanceof File, {
  //     message: "Resume file is required",
  //   }),
  status: statusEnum.default("pending").optional(),
  isVerified: z.boolean().optional(),
});

export type InterviewerRegisterRequestDTO = z.infer<typeof InterviewerRegisterSchema>;


