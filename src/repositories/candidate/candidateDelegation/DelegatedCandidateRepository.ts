import { injectable } from "inversify";
import DelegatedCandidate, {
  IDelegatedCandidate,
} from "../../../models/candidate/DelegatedCandidate";
import { BaseRepository } from "../../base/BaseRepository";
import { IDelegatedCandidateRepository } from "./IDelegatedCandidateRepository";
import { FilterQuery } from "mongoose";
@injectable()
export class DelegatedCandidateRepository
  extends BaseRepository<IDelegatedCandidate>
  implements IDelegatedCandidateRepository
{
  constructor() {
    super(DelegatedCandidate);
  }
  async getCandidatesByJobId(jobId: string): Promise<IDelegatedCandidate[]> {
    return await DelegatedCandidate.find({ job: jobId })
      .populate("candidate")
      .populate("company")
      .populate({
    path: "job",
    populate: {
      path: "paymentTransaction", // nested populate
      model: "PaymentTransaction",
    },
  })
  }
  async getDelegatedJobsByCandidateId(
    candidateId: string
  ): Promise<IDelegatedCandidate[]> {
    return await DelegatedCandidate.find({ candidate: candidateId })
      .populate("job")
      .populate("company");
  }
  async getDelegationDetails(
    query: FilterQuery<IDelegatedCandidate>
  ): Promise<IDelegatedCandidate | null> {
    return await DelegatedCandidate.findOne(query)
      .populate("candidate")
      .populate("job")
      .populate("company");
  }
}
