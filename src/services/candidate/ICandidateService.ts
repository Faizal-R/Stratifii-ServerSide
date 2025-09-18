import { ICandidate } from "../../models/candidate/Candidate";
import { IDelegatedCandidate } from "../../models/candidate/DelegatedCandidate";
export interface ICandidateService{
  setupCandiateProfile(avatar:Express.Multer.File,password:string,token:string):Promise<ICandidate|null>
  getCandidateProfile(candidateId:string):Promise<ICandidate|null>
  getDelegatedJobs(candidateId:string):Promise< {
      delegatedCandidateId: string;
      jobId: string;
      jobTitle: string;
      name: string;
      mockStatus: string;
      isQualifiedForFinal: boolean;
      mockInterviewDeadline: Date | string;
    }[]>
}