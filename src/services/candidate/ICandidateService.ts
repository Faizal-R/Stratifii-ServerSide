import { CandidateDTO } from "../../dto/response/candidate/CandidateResponseDTO";

import { JobBasicDTO } from "../../dto/response/job/JobResponseDTO";

export interface ICandidateService {
  setupCandiateProfile(
    avatar: Express.Multer.File,
    password: string,
    token: string
  ): Promise<CandidateDTO>;
  getCandidateProfile(candidateId: string): Promise<CandidateDTO>;
  getDelegatedJobs(candidateId: string): Promise<
    {
      delegatedCandidateId: string;
      job: JobBasicDTO;
      companyName: string;
      mockStatus: string;
      isQualifiedForFinal: boolean;
      mockInterviewDeadline: Date | string;
    }[]
  >;
}
