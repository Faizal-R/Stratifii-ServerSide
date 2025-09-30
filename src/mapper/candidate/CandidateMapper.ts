import { CandidateDTO } from "../../dto/response/candidate/CandidateResponseDTO";
import { ICandidate } from "../../models/candidate/Candidate";

export const CandidateMapper = {
  toResponse: (
    candidate: ICandidate,
    avatarUrl: string|null,
    resumeUrl: string
  ): CandidateDTO => ({
    _id: candidate._id as string,
    name: candidate.name,
    email: candidate.email,
    avatar: avatarUrl||null,
    resume: resumeUrl,
    status: candidate.status ?? "pending",
    isBlocked: candidate.isBlocked ?? false,
  }),
};
