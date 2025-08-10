import { ISlotGenerationRule } from "../../models/slot/slotGenerationRule";

import { ISlotGenerationRepository } from "../../repositories/slot/slotGenerationRule/ISlotGenerationRepository";
import { ISlotService } from "./ISlotService";
import { IInterviewSlot } from "../../models/slot/interviewSlot";
import { inject, injectable } from "inversify";
import { DiRepositories } from "../../di/types";
import { generateSlotsFromRule } from "../../utils/generateSlots";
import { IBookedSlotRepository } from "../../repositories/slot/bookedSlot/IBookedSlotRepository";
import { IBookedSlot } from "../../models/slot/bookedSlot";
import { IDelegatedCandidateRepository } from "../../repositories/candidate/candidateDelegation/IDelegatedCandidateRepository";

@injectable()
export class SlotService implements ISlotService {
  constructor(
    @inject(DiRepositories.SlotGenerationRepository)
    private readonly _slotGenerationRepository: ISlotGenerationRepository,
    @inject(DiRepositories.BookedSlotRepository)
    private readonly _bookedSlotRepository: IBookedSlotRepository,

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

  // async generateSlotsFromRule(
  //   rule: ISlotGenerationRule
  // ): Promise<IInterviewSlot[]> {
  //   try {
  //     const slots: IInterviewSlot[] = [];
  //     const current = new Date();
  //     const end = new Date(current);
  //     end.setDate(end.getDate() + 30); // Generate for 30 days

  //     while (current <= end) {
  //       const day = current.getDay();
  //       if (rule.availableDays.includes(day)) {
  //         const dayStart = new Date(current);
  //         dayStart.setHours(rule.startHour, 0, 0, 0);

  //         const dayEnd = new Date(current);
  //         dayEnd.setHours(rule.endHour, 0, 0, 0);

  //         let slotStart = new Date(dayStart);

  //         while (slotStart < dayEnd) {
  //           const slotEnd = new Date(
  //             slotStart.getTime() + rule.duration * 60 * 1000
  //           );

  //           if (slotEnd <= dayEnd) {
  //             slots.push({
  //               interviewerId: rule.interviewerId,
  //               startTime: new Date(slotStart),
  //               endTime: new Date(slotEnd),
  //               duration: rule.duration,
  //               status: "available",
  //               isAvailable: true,
  //               ruleId: rule._id,
  //             } as IInterviewSlot);
  //           }

  //           slotStart = new Date(
  //             slotStart.getTime() + (rule.duration + rule.buffer) * 60 * 1000
  //           );
  //         }
  //       }

  //       current.setDate(current.getDate() + 1);
  //     }

  //     return slots;
  //   } catch (error) {
  //     console.error("[SlotService] Error generating slots from rule:", error);
  //     throw error;
  //   }
  // }

  async getSlotsByRule(interviewerId: string): Promise<IInterviewSlot[] | []> {
    try {
      const rule = await this._slotGenerationRepository.findOne({
        interviewerId,
      });
      console.log("rule", rule);
      if (!rule) {
        return [];
      }

      const slots = generateSlotsFromRule(rule);
      return slots.length > 0 ? slots : [];
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

  async bookSlotForCandidate(payloadForSlotBooking: {
    interviewer: string;
    slot: IInterviewSlot;
    candidate: string;
    job: string;
    bookedBy: string;
  }): Promise<IBookedSlot> {
    const { interviewer, slot, candidate, job, bookedBy } =
      payloadForSlotBooking;
    try {
      const bookedSlot = await this._bookedSlotRepository.create({
        interviewer,
        candidate,
        bookedBy,
        job,
        startTime: slot.startTime,
        endTime: slot.endTime,
        duration: slot.duration,
      });
      const scheduledCandidate =
        await this._delegatedCandidateRepository.findOne({
          candidate: candidate,
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
