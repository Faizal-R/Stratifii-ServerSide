import { IJob } from "../../models/job/Job";
import {
  JobBasicDTO,
  JobDetailsDTO,
} from "../../dto/response/job/JobResponseDTO";
import { CompanyMapper } from "../company/CompanyMapper";

import { ICompany } from "../../models/company/Company";

export const JobMapper = {
  toSummary: (job: IJob): JobBasicDTO => ({
    _id: job._id.toString(),
    position: job.position,
    status: job.status,
    experienceRequired: job.experienceRequired,
    description: job.description,
    requiredSkills: job.requiredSkills,
  }),

  toResponse: (job: IJob, isPopulated: boolean = false): JobDetailsDTO => ({
    _id: job._id.toString(),
    company: isPopulated
      ? CompanyMapper.toResponse(job.company as ICompany)
      : job.company.toString(),
    position: job.position,
    description: job.description,
    requiredSkills: job.requiredSkills ?? [],
    status: job.status,
    experienceRequired: job.experienceRequired,
    paymentTransaction: job.paymentTransaction?.toString(),
    createdAt: job .createdAt,
    updatedAt: job.updatedAt,
  }),
};
