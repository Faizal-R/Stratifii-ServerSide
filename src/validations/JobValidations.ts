import { z } from "zod";

export const JobSchema = z.object({
    company: z.string().optional(),
  position: z
    .string({
      required_error: "Position is required",
    })
    .min(1, "Position cannot be empty"),

  description: z
    .string()
    .optional()
    .default(""),

  requiredSkills: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .default([]),

  status: z
    .enum(["open", "in-progress", "completed"])
    .default("open"),

  experienceRequired: z
    .number({
      required_error: "Experience is required",
      invalid_type_error: "Experience must be a number",
    })
    .min(0, "Experience cannot be negative"),
});

// Example TypeScript type
export type TJobInput = z.infer<typeof JobSchema>;
