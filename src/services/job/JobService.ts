import { IJob } from "../../models/job/Job";
import { IJobService } from "./IJobService";
import { IJobRepository } from "../../repositories/job/IJobRepository";
import { CustomError } from "../../error/CustomError";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import { HttpStatus } from "../../config/HttpStatusCodes";
import extractDetailsFromPDF from "../../utils/extractDetailsFromPDF";

import { ICandidateRepository } from "../../repositories/candidate/ICandidateRepository";
import { Types } from "mongoose";
import { IDelegatedCandidateRepository } from "../../repositories/candidate/candidateDelegation/IDelegatedCandidateRepository";
import { inject, injectable } from "inversify";
import { DI_TOKENS } from "../../di/types";
import { IDelegatedCandidate } from "../../models/candidate/DelegatedCandidate";

import { IInterviewer } from "../../models/interviewer/Interviewer";
import { IInterviewSlot } from "../../models/slot/interviewSlot";
import { IInterviewerRepository } from "../../repositories/interviewer/IInterviewerRepository";
import { ISlotGenerationRepository } from "../../repositories/slot/slotGenerationRule/ISlotGenerationRepository";
import { generateSlotsFromRule } from "../../utils/generateSlots";

import { IInterviewRepository } from "../../repositories/interview/IInterviewRepository";
import { IInterview } from "../../models/interview/Interview";
import { normalizeSkill } from "../../utils/handleSkills";
import { generateSignedUrl, uploadFileToS3 } from "../../helper/s3Helper";
import { DelegatedCandidateMapper } from "../../mapper/candidate/DelegatedCandidateMapper";

import { ICandidate } from "../../models/candidate/Candidate";
import { DelegatedCandidateForCompanyDTO } from "../../dto/response/candidate/DelegatedCandidateResponseDTO";
import { IPaymentTransactionRepository } from "../../repositories/payment/IPaymentTransactionRepository";
import { InterviewerResponseDTO } from "../../dto/response/interviewer/InterviewerResponseDTO";
import { InterviewerMapper } from "../../mapper/interviewer/InterviewerMapper";

injectable();
export class JobService implements IJobService {
  constructor(
    @inject(DI_TOKENS.REPOSITORIES.JOB_REPOSITORY)
    private readonly _jobRepository: IJobRepository,

    @inject(DI_TOKENS.REPOSITORIES.PAYMENT_TRANSACTION_REPOSITORY)
    private readonly _paymentTransactionRepository: IPaymentTransactionRepository,

    @inject(DI_TOKENS.REPOSITORIES.CANDIDATE_REPOSITORY)
    private readonly _candidateRepository: ICandidateRepository,

    @inject(DI_TOKENS.REPOSITORIES.DELEGATED_CANDIDATE_REPOSITORY)
    private readonly _delegatedCandidateRepository: IDelegatedCandidateRepository,

    @inject(DI_TOKENS.REPOSITORIES.INTERVIEWER_REPOSITORY)
    private readonly _interviewerRepository: IInterviewerRepository,

    @inject(DI_TOKENS.REPOSITORIES.SLOT_GENERATION_REPOSITORY)
    private readonly _slotGenerationRepository: ISlotGenerationRepository,

    @inject(DI_TOKENS.REPOSITORIES.INTERVIEW_REPOSITORY)
    private readonly _interviewRepository: IInterviewRepository
  ) {}

  async getJobs(company: string): Promise<IJob[] | []> {
    try {
      const jobs = await this._jobRepository.find({ company });

      return jobs;
    } catch {
      throw new CustomError(
        "Failed to fetch jobs",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async updateJob(job: Partial<IJob>): Promise<IJob | null> {
    try {
      const updatedJob = await this._jobRepository.update(
        job._id as string,
        job
      );
      return updatedJob;
    } catch {
      throw new CustomError(
        "Failed to update job",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async deleteJob(jobId: string): Promise<boolean> {
    try {
      await this._jobRepository.delete(jobId);
      return true;
    } catch {
      throw new CustomError(
        "Failed to delete job",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createJob(job: IJob): Promise<IJob> {
    try {
      const createdJob = await this._jobRepository.create(job);
      return createdJob;
    } catch {
      throw new CustomError(
        "Failed to create job",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createCandidatesFromResumes(
    jobId: Types.ObjectId,
    resumes: Express.Multer.File[],
    companyId: Types.ObjectId
  ): Promise<
    DelegatedCandidateForCompanyDTO[] | DelegatedCandidateForCompanyDTO
  > {
    const addedDelegations: Types.ObjectId[] = [];

    try {
      for (const resume of resumes) {
        const candidateData = await extractDetailsFromPDF(resume.buffer);

        // Check if candidate already exists
        let candidate = await this._candidateRepository.findByEmail(
          candidateData.email
        );

        if (!candidate) {
          const resumeKey = await uploadFileToS3(resume);
          candidate = await this._candidateRepository.create({
            ...candidateData,
            resumeKey,
            status: "pending",
            isBlocked: false,
          });
        }

        // Check if already delegated to this job
        const alreadyDelegated =
          await this._delegatedCandidateRepository.findOne({
            candidate: candidate._id,
            job: jobId,
            company: companyId,
          });
        if (alreadyDelegated) {
          if (resumes.length < 2) {
            throw new CustomError(
              `${resume.originalname} :  This User is Already Delegated To This Job Try to Remove It and Try Again`,
              HttpStatus.CONFLICT
            );
          }
        }
        if (!alreadyDelegated) {
          const delegation = await this._delegatedCandidateRepository.create({
            candidate: candidate._id as Types.ObjectId,
            company: companyId,
            job: jobId,
            status: "mock_pending",
          });
          addedDelegations.push(delegation._id as Types.ObjectId);
        }
      }

      const allCandidates = await Promise.all(
        addedDelegations.map((delegationId) =>
          this._delegatedCandidateRepository.getDelegationDetails({
            _id: delegationId,
          })
        )
      );
      console.log(allCandidates);

      // Filter out any null values to ensure correct type
      const candidatesWithResumeAttached = await Promise.all(
        allCandidates.map(async (dc) => {
          const resumeKey = (dc?.candidate as ICandidate).resumeKey;
          const resumeUrl = await generateSignedUrl(resumeKey);
          const avatarKey = (dc?.candidate as ICandidate).avatarKey;
          let avatarUrl = null;
          if (avatarKey) {
            avatarUrl = await generateSignedUrl(avatarKey || null);
          }
          return DelegatedCandidateMapper.toShowCompany(
            dc!,
            avatarUrl,
            resumeUrl!
          );
        })
      );
      return candidatesWithResumeAttached;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error in createCandidatesFromResumes:", error);
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getCandidatesByJob(jobId: string): Promise<{
    candidates: DelegatedCandidateForCompanyDTO[];
    jobPaymentStatus: string | null;
  }> {
    try {
      const delegatedCandiates =
        await this._delegatedCandidateRepository.getCandidatesByJob(jobId);
      const companyJob = await this._jobRepository.findById(jobId);
      const paymentTransactionOfJob =
        await this._paymentTransactionRepository.findOne({
          _id: companyJob?.paymentTransaction,
        });
      const candidates = await Promise.all(
        delegatedCandiates.map(async (dc) => {
          const candidateAvatarUrl = await generateSignedUrl(
            (dc.candidate as ICandidate).avatarKey!
          );
          const candidateResumeUrl = await generateSignedUrl(
            (dc.candidate as ICandidate).resumeKey
          );
          return DelegatedCandidateMapper.toShowCompany(
            dc,
            candidateAvatarUrl!,
            candidateResumeUrl!
          );
        })
      );

      if (!candidates) {
        throw new CustomError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      return {
        candidates,
        jobPaymentStatus: paymentTransactionOfJob?.status ?? null,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Failed to fetch candidates for the job",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getJobsInProgress(
    company: string
  ): Promise<{ job: IJob; qualifiedCandidatesCount: number }[]> {
    try {
      const jobs = await this._jobRepository.find({
        company,
        status: "in-progress",
      });

      const jobsWithQualifiedCandidates = await Promise.all(
        jobs.map(async (job) => {
          const candidates = await this._delegatedCandidateRepository.find({
            job: job._id,
            status: "mock_completed",
          });

          return {
            job,
            qualifiedCandidatesCount: candidates.length,
          };
        })
      );

      return jobsWithQualifiedCandidates;
    } catch {
      throw new CustomError(
        "Failed to fetch jobs in progress",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getMockQualifiedCandidatesByJob(
    job: string
  ): Promise<DelegatedCandidateForCompanyDTO[] | []> {
    try {
      const candidates =
        await this._delegatedCandidateRepository.getCandidatesByJob(job, {
          status: "mock_completed",
        });

        const mappedDelegatedCandidates=Promise.all(
          candidates.map(async (dc) => {
            const candidateAvatarUrl = await generateSignedUrl(
              (dc.candidate as ICandidate).avatarKey as string
            );
            const candidateResumeUrl = await generateSignedUrl(
              (dc.candidate as ICandidate).resumeKey
            );
            return DelegatedCandidateMapper.toShowCompany(
              dc,
              candidateAvatarUrl as string,
              candidateResumeUrl as string
            );
          })
        );

      return mappedDelegatedCandidates;
    } catch {
      throw new CustomError(
        "Failed to fetch mock qualified candidates",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getMatchedInterviewersByJobDescription(
    jobId: string
  ): Promise<
    { interviewer: InterviewerResponseDTO; slots: IInterviewSlot[] }[] | []
  > {
    try {
      const jobDetails = await this._jobRepository.findById(jobId);
      if (!jobDetails) return [];

      const allInterviewers = await this._interviewerRepository.find();

      // normalize job required skills once
      const requiredSkills = (jobDetails.requiredSkills || []).map(
        normalizeSkill
      );

      const mappedInterviewers = await Promise.all(
        allInterviewers.map(async (interviewer: IInterviewer) => {
          const interviewerSkills = (interviewer.expertise || []).map(
            (exp: any) =>
              normalizeSkill(typeof exp === "string" ? exp : exp.skill)
          );

          const matchCount = interviewerSkills.filter((s) =>
            requiredSkills.includes(s)
          ).length;

          const interivewerAvatarUrl = interviewer.avatarKey
            ? await generateSignedUrl(interviewer.avatarKey)
            : null;

          const interviewerResumeUrl = await generateSignedUrl(
            interviewer.resumeKey as string
          );

          return {
            interviewer: InterviewerMapper.toResponse(
              interviewer as IInterviewer,
              interviewerResumeUrl as string,
              interivewerAvatarUrl
            ),
            matchCount,
          };
        })
      );

      const matchedInterviewers = mappedInterviewers
        .filter(({ matchCount }) => matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount);

      const interviewersWithSlots = await Promise.all(
        matchedInterviewers.map(async ({ interviewer }) => {
          const rule = await this._slotGenerationRepository.findOne({
            interviewerId: interviewer._id,
          });

          const slots = generateSlotsFromRule(rule);

          const bookedSlots = await this._interviewRepository.find({
            interviewer: interviewer._id,
            status: { $ne: "cancelled" },
          });

          const enrichedSlots: IInterviewSlot[] = slots.map((slot) => {
            const exactBooked = bookedSlots.find(
              (booked: IInterview) =>
                new Date(booked.startTime).getTime() ===
                  new Date(slot.startTime).getTime() &&
                new Date(booked.endTime).getTime() ===
                  new Date(slot.endTime).getTime()
            );

            return {
              interviewerId: interviewer._id,
              startTime: slot.startTime,
              endTime: slot.endTime,
              duration: slot.duration,
              isAvailable: !exactBooked,
              status: exactBooked ? "booked" : "available",
              ruleId: rule?._id as string,
            };
          });

          return { interviewer, slots: enrichedSlots };
        })
      );

      return interviewersWithSlots;
    } catch {
      throw new CustomError(
        "An error occurred while fetching matched interviewers",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
