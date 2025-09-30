import { z } from "zod";

export const statusEnum = z.enum(["approved", "pending", "rejected"], {
  message: "Status must be one of: approved, pending, rejected.",
});

export const CompanyProfileSchema = z.object({
  name: z.string().min(1, "Company name is required").trim(),
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .trim(),
  companyWebsite: z.string().url("Invalid Website URL format").trim(),
  registrationCertificateNumber: z
    .string()
    .min(1, "Registration certificate number is required")
    .trim(),
  linkedInProfile: z
    .string()
    .url("Invalid LinkedIn profile URL")
    .trim()
    .optional(),
  phone: z.string().min(1, "Phone number is required"),
  status: statusEnum.optional().default("approved"),
  companyType: z.string().optional(),
  description: z.string().optional(),
  numberOfEmployees: z.string().optional(),
  headquartersLocation: z.string().optional(),
  companySize: z.string().optional(),
  companyLogoKey: z.string().optional(),
});

export type ICompanyProfile = z.infer<typeof CompanyProfileSchema>;
