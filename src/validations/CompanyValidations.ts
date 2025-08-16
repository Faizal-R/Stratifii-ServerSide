import { z } from "zod";

// Define company registration schema
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
   description:z.string().optional(),
   numberOfEmployees:z.string().optional() ,
   headquartersLocation:z.string().optional(),
   companySize:z.string().optional(),
   companyLogo:z.string().optional(),
});

export type ICompanyProfile = z.infer<typeof CompanyProfileSchema>;
