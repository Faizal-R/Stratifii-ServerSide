export interface companyRegisterRequestDTO {
  name: string;
  email: string;
  password: string;
}
import { z } from "zod";

const statusEnum = z.enum(["pending", "approved", "rejected"]);

const SkillProficiencyLevels = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;
const SkillSources = [
  "professional",
  "academic",
  "personal",
  "certification",
] as const;

// Skill Expertise Zod schema
export const SkillExpertiseSchema = z.object({
  skill: z.string().min(1, "Skill name is required"),
  proficiencyLevel: z.enum(SkillProficiencyLevels, {
    errorMap: () => ({ message: "Invalid proficiency level" }),
  }),
  yearsOfExperience: z
    .number()
    .min(0, "Experience must be a positive number")
    .optional(),
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

export const companyRegistrationSchema = z.object({
  name: z.string().min(3, "Company name must be at least 3 characters."),
  email: z.string().email("Invalid email format."),
  companyWebsite: z.string().url("Invalid website URL."),
  registrationCertificateNumber: z
    .string()
    .min(5, "Registration Certificate Number must be at least 5 characters."),
  linkedInProfile: z.string().url("Invalid LinkedIn URL."),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits.")
    .max(15, "Phone number must not exceed 15 digits."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one digit.")
    .regex(
      /[@$!%*?&]/,
      "Password must contain at least one special character."
    ),
  companyType: z.enum(["product-based", "service-based"], {
    message: "Company type must be one of: ServiceBased or ProductBased.",
  }),
  isBlocked: z.boolean().optional()
});

export type CompanyRegisterRequestDTO = z.infer<
  typeof companyRegistrationSchema
>;

export type InterviewerRegisterRequestDTO = z.infer<
  typeof InterviewerRegisterSchema
>;
