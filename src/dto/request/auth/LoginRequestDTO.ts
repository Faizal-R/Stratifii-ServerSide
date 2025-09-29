// src/schemas/LoginRequestSchema.ts
import { z } from "zod";
import { Roles } from "../../../constants/enums/roles";

export const LoginRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(Object.values(Roles) as [string, ...string[]], {
    required_error: "Role is required",
    invalid_type_error: "Invalid role",
  }),
});

export type LoginRequestDTO = z.infer<typeof LoginRequestSchema>;
