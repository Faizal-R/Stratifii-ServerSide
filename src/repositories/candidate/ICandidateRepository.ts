import { ICandidate } from "../../models/candidate/Candidate";
import { IBaseRepository } from "../base/IBaseRepository";

export interface ICandidateRepository extends IBaseRepository<ICandidate> {
   findByEmail(email:string):Promise<ICandidate | null>
}