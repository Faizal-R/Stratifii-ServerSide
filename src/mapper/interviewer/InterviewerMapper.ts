import {
  InterviewerResponseDTO,
  InterviewerSummaryDTO,
} from "../../dto/response/interviewer/InterviewerResponseDTO";
import { IInterviewer } from "../../models/interviewer/Interviewer";

export const InterviewerMapper = {
  toSummary: (
    interviewer: IInterviewer,
    resumeUrl: string,
    avatarUrl: string | null
  ): InterviewerSummaryDTO => ({
    _id: interviewer._id.toString(),
    name: interviewer.name,
    position: interviewer.position,
    email: interviewer.email,
    avatar: avatarUrl,
    isVerified: interviewer.isVerified,
    status: interviewer.status,
    resume: resumeUrl,
  }),

  toResponse: (
    interviewer: IInterviewer,
    resumeUrl: string,
    avatarUrl: string | null = null
  ): InterviewerResponseDTO => ({
    _id: interviewer._id.toString(),
    name: interviewer.name,
    position: interviewer.position,
    email: interviewer.email,
    phone: interviewer.phone,
    experience: interviewer.experience,
    linkedinProfile: interviewer.linkedinProfile,
    expertise: interviewer.expertise?.map((exp) => ({
      skill: exp.skill,
      proficiencyLevel: exp.proficiencyLevel,
      yearsOfExperience: exp.yearsOfExperience,
      skillSource: exp.skillSource,
    })) as InterviewerResponseDTO["expertise"],
    avatar: avatarUrl || null,
    isVerified: interviewer.isVerified,
    status: interviewer.status,
    isBlocked: interviewer.isBlocked ?? false,
    stripeAccountId: interviewer.stripeAccountId,
    bankDetails: interviewer.bankDetails||null,
    resume: resumeUrl,
    resubmissionPeriod: interviewer.resubmissionPeriod
      ? new Date(interviewer.resubmissionPeriod).toISOString()
      : null,
    resubmissionNotes: interviewer.resubmissionNotes ?? null,
    resubmissionCount: interviewer.resubmissionCount ?? 0,
  }),
};
