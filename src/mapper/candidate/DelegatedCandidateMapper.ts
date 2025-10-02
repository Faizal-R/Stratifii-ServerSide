import { DelegatedCandidateForCompanyDTO } from "../../dto/response/candidate/DelegatedCandidateResponseDTO";
import { ICandidate } from "../../models/candidate/Candidate";
import { IDelegatedCandidate } from "../../models/candidate/DelegatedCandidate";
import { CandidateMapper } from "./CandidateMapper";

export const DelegatedCandidateMapper = {
  toShowCompany: (
    delegatedCandidate: IDelegatedCandidate,
    candidateAvatarUrl: string|null,
    candidateResumeUrl: string
  ):DelegatedCandidateForCompanyDTO => ({
    _id: delegatedCandidate._id as string,

    candidate: CandidateMapper.toResponse(
      delegatedCandidate.candidate as ICandidate,
      candidateAvatarUrl||null,
      candidateResumeUrl!
    ),
    isQualifiedForFinal: delegatedCandidate.isQualifiedForFinal!,
    isInterviewScheduled: delegatedCandidate.isInterviewScheduled!,
    status: delegatedCandidate.status,
    interviewRounds: delegatedCandidate.interviewRounds,
    totalNumberOfRounds:delegatedCandidate.totalNumberOfRounds
  }),
  
};
