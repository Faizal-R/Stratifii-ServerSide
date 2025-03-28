import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helper/generateTokens";
import { ICandidate } from "../../models/candidate/Candidate";
import { ICandidateRepository } from "../../repositories/candidate/ICandidateRepository";
import { comparePassword } from "../../utils/hash";
import { ICandidateService } from "./ICandidateService";

export class CandidateService implements ICandidateService {
  constructor(private readonly candidateRepository: ICandidateRepository) { }
  
}
