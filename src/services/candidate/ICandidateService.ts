import { CandidateDTO } from "../../dto/response/candidate/CandidateResponseDTO";
import {  CompanyBasicDTO  } from "../../dto/response/company/CompanyResponseDTO";
import { JobBasicDTO } from "../../dto/response/job/JobResponseDTO";
import { ICandidate } from "../../models/candidate/Candidate";
import { IDelegatedCandidate } from "../../models/candidate/DelegatedCandidate";
export interface ICandidateService{
  setupCandiateProfile(avatar:Express.Multer.File,password:string,token:string):Promise<CandidateDTO>
  getCandidateProfile(candidateId:string):Promise<CandidateDTO>
  getDelegatedJobs(candidateId:string):Promise< {
      delegatedCandidateId: string;
     job:JobBasicDTO;
     companyName:string;
      mockStatus: string;
      isQualifiedForFinal: boolean;
      mockInterviewDeadline: Date | string;
    }[]>
}