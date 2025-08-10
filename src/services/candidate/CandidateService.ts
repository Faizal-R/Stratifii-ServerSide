import { inject, injectable } from "inversify";
import { HttpStatus } from "../../config/HttpStatusCodes";
import redis from "../../config/RedisConfig";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import { CustomError } from "../../error/CustomError";
import { uploadOnCloudinary } from "../../helper/cloudinary";
import { TokenPayload } from "../../middlewares/Auth";
import { ICandidate } from "../../models/candidate/Candidate";
import { ICandidateRepository } from "../../repositories/candidate/ICandidateRepository";
import { comparePassword, hashPassword } from "../../utils/hash";
import { ICandidateService } from "./ICandidateService";
import jwt from "jsonwebtoken";
import { DiRepositories } from "../../di/types";
import { IDelegatedCandidate } from "../../models/candidate/DelegatedCandidate";
import { IDelegatedCandidateRepository } from "../../repositories/candidate/candidateDelegation/IDelegatedCandidateRepository";
import { IJob } from "../../models/job/Job";
import { ICompany } from "../../models/company/Company";

@injectable()
export class CandidateService implements ICandidateService {
  constructor(
    @inject(DiRepositories.CandidateRepository)
    private readonly _candidateRepository: ICandidateRepository,
    @inject(DiRepositories.DelegatedCandidateRepository)
    private readonly _delegatedCandidateRepository: IDelegatedCandidateRepository
  ) {}
  async setupCandiateProfile(
    avatar: Express.Multer.File,
    password: string,
    token: string
  ): Promise<ICandidate | null> {
    try {
      console.log("Line Number 21 in CandidateService.ts");
      console.log(token === process.env.ACCESS_TOKEN_SECRET);
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as TokenPayload;
      console.log("decoded", decoded);
      const userId = decoded.userId;
      console.log("userId", userId);
      const storedToken = await redis.get(`createPasswordToken:${userId}`);

      console.log("storedToken", storedToken);

      if (!storedToken || storedToken !== token) {
        throw new CustomError(
          "Invalid or expired token",
          HttpStatus.BAD_REQUEST
        );
      }
      const hashedPassword = await hashPassword(password);
      console.log("hashedPassword", hashedPassword);
      const avatarUrl = await uploadOnCloudinary(avatar.path);
      console.log("avatarUrl", avatarUrl);

      const candidate = await this._candidateRepository.update(userId, {
        password: hashedPassword,
        avatar: avatarUrl,
      });
      console.log("candidate", candidate);

      return candidate;
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getCandidateProfile(candidateId: string): Promise<ICandidate | null> {
    try {
      const candidate = await this._candidateRepository.findById(candidateId);
      if (!candidate) {
        throw new CustomError(
          "Candidate not found",
          // ERROR_MESSAGES.CANDIDATE_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }
      return candidate;
    } catch (error) {
      console.log("error in getCandidateProfile", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getDelegatedJobs(candidateId: string): Promise<
    {
      delegatedCandidateId: string;
      jobId: string;
      jobTitle: string;
      name: string;
      mockStatus: string;
    }[]
  > {
    console.log(candidateId);
    const delegations =
      await this._delegatedCandidateRepository.getDelegatedJobsByCandidateId(
        candidateId
      );
    console.log(delegations);
    if (!delegations || delegations.length === 0) {
      throw new CustomError("No Delegations Found", HttpStatus.BAD_REQUEST);
    }

    const response = delegations.map((dc) => {
      const job = dc.job as IJob;
      const company = dc.company as ICompany;

      return {
        delegatedCandidateId: dc._id as string,
        jobId: job._id as string,
        jobTitle: job.position,
        name: company.name,
        mockStatus: dc.status,
        isQualifiedForFinal: dc.isQualifiedForFinal,
      };
    });

    return response;
  }
}
