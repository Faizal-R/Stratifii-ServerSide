import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helper/generateTokens";
import { ICandidate } from "../../interfaces/ICandidateModel";
import { CandidateRepository } from "../../repositories/candidate/CandidateRepository";
import { comparePassword } from "../../utils/hash";
import { ICanidateService } from "./ICanidateService";

export class CandidateService implements ICanidateService {
  constructor(private readonly candidateRepository: CandidateRepository) { }
  
  async login(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: ICandidate;
  }> {
    const user = await this.candidateRepository.findByEmail(email);
    if (!user || !(await comparePassword(password, user.password))) {
      throw new Error("Invalid Email or Password");
    }
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
