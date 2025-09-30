import { CompanyResponseDTO } from "../company/CompanyResponseDTO";


export interface JobBasicDTO {
  _id: string;
  position: string;
  status: "open" | "in-progress" | "completed";
  experienceRequired: number;
  description?: string;
 requiredSkills: string[];
}

export interface JobDetailsDTO {
  _id: string;
  position: string;
  description?: string;
  requiredSkills: string[];
  status: "open" | "in-progress" | "completed";
  experienceRequired: number;
  company: string | CompanyResponseDTO;
  paymentTransaction?: string;
  createdAt: Date;
  updatedAt: Date;
}

