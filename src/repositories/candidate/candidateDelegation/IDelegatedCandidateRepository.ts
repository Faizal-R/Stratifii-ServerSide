import { FilterQuery } from "mongoose";
import { IDelegatedCandidate } from "../../../models/candidate/DelegatedCandidate";
import { IBaseRepository } from "../../base/IBaseRepository";

export interface IDelegatedCandidateRepository extends IBaseRepository<IDelegatedCandidate>{
    getCandidatesByJobId(jobId: string): Promise<IDelegatedCandidate[]>;
    getDelegatedJobsByCandidateId(candidateId:string):Promise<IDelegatedCandidate[]>
     getDelegationDetails(
        query: FilterQuery<IDelegatedCandidate>
      ): Promise<IDelegatedCandidate | null>

}