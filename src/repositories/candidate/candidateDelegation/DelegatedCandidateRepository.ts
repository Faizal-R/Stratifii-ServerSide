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
  async getCandidatesByJob(
    jobId: string,
    query?: FilterQuery<IDelegatedCandidate>
  ): Promise<IDelegatedCandidate[]> {
    return await this.model
      .find({ job: jobId, ...query })
      .populate("candidate")
      .populate("company")
      .populate({
        path: "job",
        populate: {
          path: "paymentTransaction", // nested populate
          model: "PaymentTransaction",
        },
      })
      .populate("interviewRounds.interviewer");
  }
  async getDelegatedJobsByCandidateId(
    candidateId: string
  ): Promise<IDelegatedCandidate[]> {
    return await this.model
      .find({ candidate: candidateId })
      .populate("job")
      .populate("company");
  }

  async getDelegatedCandidatesByCompanyId(
    companyId: string
  ): Promise<IDelegatedCandidate[]> {
    return await this.model
      .find({ company: companyId })
      .populate("candidate")
      .populate("job")
      .populate("interviewRounds.interviewer");
  }
  async getDelegationDetails(
    query: FilterQuery<IDelegatedCandidate>
  ): Promise<IDelegatedCandidate | null> {
    return await this.model
      .findOne(query)
      .populate("candidate")
      .populate("job")
      .populate("company");
  }
  // delegatedCandidate.repository.ts
  async markLastRoundAsFollowUpScheduled(
    delegatedCandidateId: string
  ): Promise<void> {
    await this.model.updateOne({ _id: delegatedCandidateId }, [
      {
        $set: {
          interviewRounds: {
            $concatArrays: [
              {
                $slice: [
                  "$interviewRounds",
                  { $subtract: [{ $size: "$interviewRounds" }, 1] },
                ],
              },
              [
                {
                  $mergeObjects: [
                    { $arrayElemAt: ["$interviewRounds", -1] },
                    { isFollowUpScheduled: true },
                  ],
                },
              ],
            ],
          },
        },
      },
    ]);
  }
}
