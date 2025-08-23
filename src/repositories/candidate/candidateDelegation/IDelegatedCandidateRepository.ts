import { FilterQuery } from "mongoose";
import { IDelegatedCandidate } from "../../../models/candidate/DelegatedCandidate";
import { IBaseRepository } from "../../base/IBaseRepository";

export interface IDelegatedCandidateRepository extends IBaseRepository<IDelegatedCandidate>{
    getCandidatesByJob(jobId: string,query?: FilterQuery<IDelegatedCandidate>): Promise<IDelegatedCandidate[]>;
    getDelegatedJobsByCandidateId(candidateId:string):Promise<IDelegatedCandidate[]>
     getDelegationDetails(
        query: FilterQuery<IDelegatedCandidate>
      ): Promise<IDelegatedCandidate | null>
getDelegatedCandidatesByCompanyId(
    companyId: string
  ): Promise<IDelegatedCandidate[]>
}