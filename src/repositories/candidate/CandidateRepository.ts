import { injectable } from "inversify";
import { Candidate } from "../../models";
import { ICandidate } from "../../models/candidate/Candidate";
import { BaseRepository } from "../base/BaseRepository";
import { ICandidateRepository } from "./ICandidateRepository";

@injectable()
export class CandidateRepository
    extends BaseRepository<ICandidate>
    implements ICandidateRepository {
    constructor() {
        super(Candidate);
    }
    async findByEmail(email: string): Promise<ICandidate | null> {
        return this.model.findOne({ email }).exec();
    }
}
