import { ISlotGenerationRule } from "../../models/slot/slotGenerationRule";

import { ISlotGenerationRepository } from "../../repositories/slot/slotGenerationRule/ISlotGenerationRepository";
import { ISlotService } from "./ISlotService";
import { IInterviewSlot } from "../../models/slot/interviewSlot";
import { inject, injectable } from "inversify";
import { DI_TOKENS } from "../../di/types";
import { generateSlotsFromRule } from "../../utils/generateSlots";

import { IDelegatedCandidateRepository } from "../../repositories/candidate/candidateDelegation/IDelegatedCandidateRepository";
import { createMeetingRoom } from "../../utils/generateMeetingRoomCode";
import { IInterviewRepository } from "../../repositories/interview/IInterviewRepository";
import { IInterview } from "../../models/interview/Interview";

@injectable()
export class SlotService implements ISlotService {
  constructor(
    @inject(DI_TOKENS.REPOSITORIES.SLOT_GENERATION_REPOSITORY)
    private readonly _slotGenerationRepository: ISlotGenerationRepository,
    @inject(DI_TOKENS.REPOSITORIES.INTERVIEW_REPOSITORY)
    private readonly _interviewRepository: IInterviewRepository,

    @inject(DI_TOKENS.REPOSITORIES.DELEGATED_CANDIDATE_REPOSITORY)
    private readonly _delegatedCandidateRepository: IDelegatedCandidateRepository
  ) {}

  async createSlotGenerationRule(
    ruleData: ISlotGenerationRule
  ): Promise<IInterviewSlot[]> {
    const rule = await this._slotGenerationRepository.create(ruleData);
    const slots = generateSlotsFromRule(rule);
    return slots;
  }

  async getSlotsByRule(interviewerId: string): Promise<IInterviewSlot[]> {
    const rule = await this._slotGenerationRepository.findOne({
      interviewerId,
    });

    if (!rule) return [];

    // 1. Generate all potential slots from the rule
    const slots = generateSlotsFromRule(rule);

    // 2. Fetch booked slots for the same interviewer
    const bookedSlots = await this._interviewRepository.find({
      interviewer: interviewerId,
      status: { $ne: "cancelled" }, // ignore cancelled bookings
    });

    // 3. Mark generated slots as booked if they match booked slots
    const updatedSlots = slots.map((slot) => {
      const isBooked = bookedSlots.some(
        (booked) =>
          new Date(booked.startTime).getTime() ===
            new Date(slot.startTime).getTime() &&
          new Date(booked.endTime).getTime() ===
            new Date(slot.endTime).getTime()
      );

      return {
        ...slot,
        isAvailable: !isBooked,
        status: (isBooked ? "booked" : "available") as IInterviewSlot["status"],
        bookedBy: isBooked
          ? bookedSlots
              .find(
                (b) =>
                  new Date(b.startTime).getTime() ===
                    new Date(slot.startTime).getTime() &&
                  new Date(b.endTime).getTime() ===
                    new Date(slot.endTime).getTime()
              )
              ?.bookedBy.toString()
          : null,
      };
    });

    return updatedSlots;
  }

  async getInterviewerSlotGenerationRule(
    interviewerId: string
  ): Promise<ISlotGenerationRule | null> {
    const rule = await this._slotGenerationRepository.findOne({
      interviewerId,
    });

    return rule || null;
  }

  async updateInterviewerSlotGenerationRule(
    interviewerId: string,
    ruleData: ISlotGenerationRule
  ): Promise<{ rule: ISlotGenerationRule | null; slots: IInterviewSlot[] }> {
    try {
      const existingRule = await this._slotGenerationRepository.findOne({
        interviewerId,
      });
      const updatedRule = await this._slotGenerationRepository.update(
        existingRule?._id as string,
        ruleData
      );

      const slots = await this.getSlotsByRule(interviewerId);

      return { rule: updatedRule, slots };
    } catch (error) {
      console.error(
        "[SlotService] Error updating interviewer slot generation rule:",
        error
      );
      throw error;
    }
  }

  async bookSlotForCandidate(payloadForSlotBooking: {
    interviewer: string;
    slot: IInterviewSlot;
    candidate: string;
    job: string;
    bookedBy: string;
    isFollowUpScheduling?: boolean;
  }): Promise<IInterview> {
    const {
      interviewer,
      slot,
      candidate,
      job,
      bookedBy,
      isFollowUpScheduling,
    } = payloadForSlotBooking;

    const meetingLink = createMeetingRoom();
    const bookedSlot = await this._interviewRepository.create({
      interviewer,
      candidate,
      bookedBy,
      job,
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration: slot.duration,
      bufferDuration: 10,
      meetingLink,
    });
    const scheduledCandidate = await this._delegatedCandidateRepository.findOne(
      {
        job,
        candidate,
      }
    );

    await this._delegatedCandidateRepository.update(
      scheduledCandidate?._id as string,
      { isInterviewScheduled: true }
    );
    console.log("isFollowUpScheduling", isFollowUpScheduling);
    if (isFollowUpScheduling) {
      await this._delegatedCandidateRepository.markLastRoundAsFollowUpScheduled(
        scheduledCandidate?._id as string
      );
    }

    return bookedSlot;
  }
}
