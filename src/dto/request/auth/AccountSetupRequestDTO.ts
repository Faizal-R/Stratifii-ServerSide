import { z } from "zod";
import { SkillExpertiseSchema, statusEnum } from "../shared/SharedRequestDTO";

export const InterviewerAccountSetupSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  linkedinProfile: z.string().url("Invalid LinkedIn profile URL"),
  position: z.string().min(2, "Position must be at least 2 characters long"),
  experience: z.number().min(0, "Experience cannot be negative"),
  expertise: z
    .array(SkillExpertiseSchema)
    .min(1, "At least one expertise area is required"),
  status: statusEnum.default("pending").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isVerified: z.boolean().optional(),
});

export type InterviewerAccountSetupRequestDTO = z.infer<
  typeof InterviewerAccountSetupSchema
>;
