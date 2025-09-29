import { z } from "zod";
export const statusEnum = z.enum(["pending", "approved", "rejected"]);

export const SkillProficiencyLevels = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;
export const SkillSources = [
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