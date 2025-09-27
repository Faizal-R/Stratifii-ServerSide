import {
  IBankDetails,
  ISkillExpertise,
} from "../../../models/interviewer/Interviewer";

// Bank details DTO

// Summary DTO - lightweight
export interface InterviewerSummaryDTO {
  _id: string;
  name: string;
  position?: string;
  email: string;
  avatar?: string | null;
  isVerified: boolean;
  status?: "pending" | "approved" | "rejected";
  resume: string;
}

// Details DTO - full profile (excluding password)
export interface InterviewerResponseDTO {
  _id: string;
  name: string;
  position?: string;
  email: string;
  phone?: string;
  experience?: number;
  linkedinProfile?: string;
  expertise?: ISkillExpertise;
  avatar: string|null;
  isVerified: boolean;
  status?: "pending" | "approved" | "rejected";
  isBlocked?: boolean;
  stripeAccountId?: string;
  bankDetails?: IBankDetails|null;
  resume: string;
  resubmissionPeriod?: string | null;
  resubmissionNotes?: string | null;
  resubmissionCount: number;

}

// Input DTO (for create/update)
