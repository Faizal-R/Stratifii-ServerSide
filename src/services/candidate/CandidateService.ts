import { inject, injectable } from "inversify";
import { HttpStatus } from "../../config/HttpStatusCodes";
import redis from "../../config/RedisConfig";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import { CustomError } from "../../error/CustomError";

import { AccessTokenPayload } from "../../types/token";

import { ICandidateRepository } from "../../repositories/candidate/ICandidateRepository";
import { hashPassword } from "../../utils/hash";
import { ICandidateService } from "./ICandidateService";
import jwt from "jsonwebtoken";
import { DI_TOKENS } from "../../di/types";
import { IDelegatedCandidateRepository } from "../../repositories/candidate/candidateDelegation/IDelegatedCandidateRepository";
import { IJob } from "../../models/job/Job";
import { ICompany } from "../../models/company/Company";


import { JobMapper } from "../../mapper/job/JobMapper";
import { JobBasicDTO } from "../../dto/response/job/JobResponseDTO";
import { generateSignedUrl, uploadFileToS3 } from "../../helper/s3Helper";
import { CandidateMapper } from "../../mapper/candidate/CandidateMapper";
import { CandidateDTO } from "../../dto/response/candidate/CandidateResponseDTO";

@injectable()
export class CandidateService implements ICandidateService {
  constructor(
    @inject(DI_TOKENS.REPOSITORIES.CANDIDATE_REPOSITORY)
    private readonly _candidateRepository: ICandidateRepository,

    @inject(DI_TOKENS.REPOSITORIES.DELEGATED_CANDIDATE_REPOSITORY)
    private readonly _delegatedCandidateRepository: IDelegatedCandidateRepository
  ) {}
  async setupCandiateProfile(
    avatar: Express.Multer.File,
    password: string,
    token: string
  ): Promise<CandidateDTO> {
    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as AccessTokenPayload;

      const userId = decoded.userId;

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
      const avatarKey = await uploadFileToS3(avatar);

      const candidate = await this._candidateRepository.update(userId, {
        password: hashedPassword,
        avatarKey: avatarKey,
      });
      console.log("candidate", candidate);
      const avatarUrl = await generateSignedUrl(avatarKey);
      const resumeKey=candidate?.resumeKey||null;
      const resumeAvatar = await generateSignedUrl(resumeKey);
      return CandidateMapper.toResponse(candidate!, avatarUrl!, resumeAvatar!);
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
  async getCandidateProfile(candidateId: string): Promise<CandidateDTO> {
    try {
      const candidate = await this._candidateRepository.findById(candidateId);
      if (!candidate) {
        throw new CustomError(
          "Candidate not found",
          // ERROR_MESSAGES.CANDIDATE_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }
      const avatarUrl = await generateSignedUrl(candidate.avatarKey!);
      const resumeUrl = await generateSignedUrl(candidate.resumeKey);
      return CandidateMapper.toResponse(candidate, avatarUrl!, resumeUrl!);
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
      job: JobBasicDTO;
      companyName: string;
      mockStatus: string;
      isQualifiedForFinal: boolean;
      mockInterviewDeadline: Date | string;
    }[]
  > {
    
    const delegations =
      await this._delegatedCandidateRepository.getDelegatedJobsByCandidateId(
        candidateId
      );

    if (!delegations || delegations.length === 0) {
      return []
    }

    const response = delegations.map((dc) => {
      const job = dc.job as IJob;
      const company = dc.company as ICompany;

      return {
        delegatedCandidateId: dc._id as string,
        job: JobMapper.toSummary(job),
        companyName: company.name,
        mockStatus: dc.status,
        isQualifiedForFinal: dc.isQualifiedForFinal as boolean,
        mockInterviewDeadline: dc.mockInterviewDeadline as Date | string,
      };
    });

    return response;
  }
}
