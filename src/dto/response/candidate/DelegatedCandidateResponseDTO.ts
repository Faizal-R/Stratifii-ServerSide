import { IInterviewRound } from "../../../models/candidate/DelegatedCandidate";
import { CandidateDTO } from "./CandidateResponseDTO";

export interface DelegatedCandidateForCompanyDTO {
  _id: string;
  candidate:CandidateDTO
  isQualifiedForFinal: boolean;
  isInterviewScheduled: boolean;
  status: string; 
  interviewRounds: IInterviewRound[]; 
  totalNumberOfRounds: number;
}