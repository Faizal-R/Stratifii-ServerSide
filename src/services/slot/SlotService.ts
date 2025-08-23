import { ISlotGenerationRule } from "../../models/slot/slotGenerationRule";

import { ISlotGenerationRepository } from "../../repositories/slot/slotGenerationRule/ISlotGenerationRepository";
import { ISlotService } from "./ISlotService";
import { IInterviewSlot } from "../../models/slot/interviewSlot";
import { inject, injectable } from "inversify";
import { DiRepositories } from "../../di/types";
import { generateSlotsFromRule } from "../../utils/generateSlots";

import { IDelegatedCandidateRepository } from "../../repositories/candidate/candidateDelegation/IDelegatedCandidateRepository";
import { createMeetingRoom } from "../../utils/generateMeetingRoomCode";
import { IInterviewRepository } from "../../repositories/interview/IInterviewRepository";
import { IInterview } from "../../models/interview/Interview";

@injectable()
export class SlotService implements ISlotService {
  constructor(
    @inject(DiRepositories.SlotGenerationRepository)
    private readonly _slotGenerationRepository: ISlotGenerationRepository,
    @inject(DiRepositories.InterviewRepository)
    private readonly _interviewRepository: IInterviewRepository,

    @inject(DiRepositories.DelegatedCandidateRepository)
    private readonly _delegatedCandidateRepository: IDelegatedCandidateRepository
  ) {}

  async createSlotGenerationRule(
    ruleData: ISlotGenerationRule
  ): Promise<IInterviewSlot[]> {
    try {
      const rule = await this._slotGenerationRepository.create(ruleData);
      const slots = generateSlotsFromRule(rule);
      console.log("slots", slots);

      console.log(
        `[SlotService] Created ${slots.length} slots for rule: ${rule._id}`
      );
      return slots;
    } catch (error) {
      console.error(
        "[SlotService] Error creating slot generation rule:",
        error
      );
      throw error;
    }
  }

  async getSlotsByRule(interviewerId: string): Promise<IInterviewSlot[]> {
    try {
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
          status: (isBooked
            ? "booked"
            : "available") as IInterviewSlot["status"],
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
    } catch (error) {
      console.error("[SlotService] Error getting slots by rule:", error);
      throw error;
    }
  }

  async getInterviewerSlotGenerationRule(
    interviewerId: string
  ): Promise<ISlotGenerationRule | null> {
    try {
      const rule = await this._slotGenerationRepository.findOne({
        interviewerId,
      });
      console.log("rule", rule);
      return rule || null;
    } catch (error) {
      console.error(
        "[SlotService] Error getting interviewer slot generation rule:",
        error
      );
      throw error;
    }
  }

  async updateInterviewerSlotGenerationRule(
    interviewerId: string,
    ruleData: ISlotGenerationRule
  ): Promise<ISlotGenerationRule | null> {
    try {
      const existingRule = await this._slotGenerationRepository.findOne({
        interviewerId,
      });
      const updatedRule = await this._slotGenerationRepository.update(
        existingRule?._id as string,
        ruleData
      );
      return updatedRule;
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
  }): Promise<IInterview> {
    const { interviewer, slot, candidate, job, bookedBy } =
      payloadForSlotBooking;
    try {
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
      const scheduledCandidate =
        await this._delegatedCandidateRepository.findOne({
          job,
          candidate,
        });

      await this._delegatedCandidateRepository.update(
        scheduledCandidate?._id as string,
        { isInterviewScheduled: true }
      );
      console.log("bookedSlot", bookedSlot);
      return bookedSlot;
    } catch (error) {
      throw error;
    }
  }
}
