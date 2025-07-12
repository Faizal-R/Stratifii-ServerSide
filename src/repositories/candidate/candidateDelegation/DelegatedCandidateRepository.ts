import { injectable } from "inversify";
import DelegatedCandidate, { IDelegatedCandidate } from "../../../models/candidate/DelegatedCandidate";
import { BaseRepository } from "../../base/BaseRepository";
import { IDelegatedCandidateRepository } from "./IDelegatedCandidateRepository";
@injectable()
export class DelegatedCandidateRepository extends BaseRepository<IDelegatedCandidate> implements IDelegatedCandidateRepository{
     constructor(){
        super(DelegatedCandidate)
     }
    async getCandidatesByJobId(jobId: string): Promise<IDelegatedCandidate[]> {
        return await DelegatedCandidate.find({ job: jobId }).populate("candidate").populate("company");
      
     }
}