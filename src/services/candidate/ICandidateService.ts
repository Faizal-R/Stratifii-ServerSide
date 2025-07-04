import { ICandidate } from "../../models/candidate/Candidate";
export interface ICandidateService{
  setupCandiateProfile(avatar:Express.Multer.File,password:string,token:string):Promise<ICandidate|null>
  getCandidateProfile(candidateId:string):Promise<ICandidate|null>
}