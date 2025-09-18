import { IJob } from "../../models/job/Job";
import { IJobService } from "./IJobService";
import { IJobRepository } from "../../repositories/job/IJobRepository";
import { CustomError } from "../../error/CustomError";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import { HttpStatus } from "../../config/HttpStatusCodes";
import extractDetailsFromPDF from "../../utils/extractDetailsFromPDF";
import { uploadOnCloudinary } from "../../helper/cloudinary";
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

injectable();
export class JobService implements IJobService {
  constructor(
  @inject(DI_TOKENS.REPOSITORIES.JOB_REPOSITORY)
  private readonly _jobRepository: IJobRepository,

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


  getJobById(jobId: string): Promise<IJob | null> {
    throw new Error("Method not implemented.");
  }
  async getJobs(company: string): Promise<IJob[] | []> {
    try {
      const jobs = await this._jobRepository.find({ company });

      return jobs;
    } catch (error) {
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
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
    } catch (error) {
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async deleteJob(jobId: string): Promise<boolean> {
    try {
      await this._jobRepository.delete(jobId);
      return true;
    } catch (error) {
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createJob(job: IJob): Promise<IJob> {
    try {
      const createdJob = await this._jobRepository.create(job);
      return createdJob;
    } catch (error) {
      console.log(error);
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createCandidatesFromResumes(
    jobId: Types.ObjectId,
    resumes: Express.Multer.File[],
    companyId: Types.ObjectId
  ): Promise<IDelegatedCandidate[] | IDelegatedCandidate> {
    const addedDelegations: Types.ObjectId[] = [];

    try {
      for (let resume of resumes) {
        const candidateData = await extractDetailsFromPDF(resume.path);
        const resumeUrl = await uploadOnCloudinary(resume.path, "raw");

        // Check if candidate already exists
        let candidate = await this._candidateRepository.findByEmail(
          candidateData.email
        );

        if (!candidate) {
          candidate = await this._candidateRepository.create({
            ...candidateData,
            resume: resumeUrl,
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
      const filteredCandidates = allCandidates.filter(
        (candidate): candidate is IDelegatedCandidate => candidate !== null
      );

      return filteredCandidates;
    } catch (error) {
      console.error("Error in createCandidatesFromResumes:", error);
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

async  getCandidatesByJob(jobId: string): Promise<IDelegatedCandidate[] | []> {
    try {
      const candidates =
        await this._delegatedCandidateRepository.getCandidatesByJob(jobId);
      if (!candidates) {
        throw new CustomError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      return candidates;
    } catch (error) {
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
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
    } catch (error) {
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getMockQualifiedCandidatesByJob(
    job: string
  ): Promise<IDelegatedCandidate[] | []> {
    try {
      const candidates =
        await this._delegatedCandidateRepository.getCandidatesByJob(job, {
          status: "mock_completed",
        });
      console.log(candidates);
      return candidates;
    } catch (error) {
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  // async getMatchedInterviewersByJobDescription(
  //   jobId: string
  // ): Promise<{ interviewer: IInterviewer; slots: IInterviewSlot[] }[] | []> {
  //   try {
  //     const jobDetails = await this._jobRepository.findById(jobId);
  //     if (!jobDetails) return [];

  //     const allInterviewers = await this._interviewerRepository.find();

  //     const matchedInterviewers = allInterviewers
  //       .map((interviewer) => {
  //         const matchCount = (interviewer.expertise||[]).filter((exp) =>
  //           jobDetails.requiredSkills.includes(exp.skill)
  //         ).length;

  //         return { interviewer, matchCount };
  //       })
  //       .filter(({ matchCount }) => matchCount > 0)
  //       .sort((a, b) => b.matchCount - a.matchCount);
  //     console.log("Matched Interviewers", matchedInterviewers);

  //     const interviewersWithSlots = await Promise.all(
  //       matchedInterviewers.map(async ({ interviewer }) => {
  //         const rule = await this._slotGenerationRepository.findOne({
  //           interviewerId: interviewer._id,
  //         });

  //         const slots = generateSlotsFromRule(rule); // [{ startTime, endTime, duration }]

  //         // Fetch all booked slots with exact match on start and end times for this interviewer
  //         const bookedSlots = await this._interviewRepository.find({
  //           interviewer: interviewer._id,
  //           status: { $ne: "cancelled" },
  //         });

  //         const enrichedSlots : IInterviewSlot[] = slots.map((slot) => {
  //           const exactBooked = bookedSlots.find(
  //             (booked: IInterview) =>
  //               new Date(booked.startTime).getTime() ===
  //                 new Date(slot.startTime).getTime() &&
  //               new Date(booked.endTime).getTime() ===
  //                 new Date(slot.endTime).getTime()
  //           );

  //           return {
  //             interviewerId: interviewer._id,
  //             startTime: slot.startTime,
  //             endTime: slot.endTime,
  //             duration: slot.duration,
  //             isAvailable: !exactBooked,
  //             status: exactBooked ? "booked" : "available",
  //             ruleId: rule?._id as string,
  //           };
  //         });

  //         return { interviewer, slots: enrichedSlots };
  //       })
  //     );

  //     console.log("final InterviewerWithSlots", interviewersWithSlots);
  //     return interviewersWithSlots;
  //   } catch (error) {
  //     console.log("Error in getMatchedInterviewersByJobDescription", error);
  //     throw new CustomError(
  //       ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  async getMatchedInterviewersByJobDescription(
  jobId: string
): Promise<{ interviewer: IInterviewer; slots: IInterviewSlot[] }[] | []> {
  try {
    const jobDetails = await this._jobRepository.findById(jobId);
    if (!jobDetails) return [];

    const allInterviewers = await this._interviewerRepository.find();

    // normalize job required skills once
    const requiredSkills = (jobDetails.requiredSkills || []).map(normalizeSkill);

    const matchedInterviewers = allInterviewers
      .map((interviewer) => {
        const interviewerSkills = (interviewer.expertise || []).map((exp: any) =>
          normalizeSkill(typeof exp === "string" ? exp : exp.skill)
        );

        const matchCount = interviewerSkills.filter((s) =>
          requiredSkills.includes(s)
        ).length;

        return { interviewer, matchCount };
      })
      .filter(({ matchCount }) => matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);

    console.log("Matched Interviewers", matchedInterviewers);

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

    console.log("final InterviewerWithSlots", interviewersWithSlots);
    return interviewersWithSlots;
  } catch (error) {
    console.log("Error in getMatchedInterviewersByJobDescription", error);
    throw new CustomError(
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
}
