import { ISlotGenerationRule } from "../../models/slot/slotGenerationRule";
import { IInterviewSlotRepository } from "../../repositories/slot/interviewSlot/IInterviewSlotRepository";
import { ISlotGenerationRepository } from "../../repositories/slot/slotGenerationRule/ISlotGenerationRepository";
import { ISlotService } from "./ISlotService";
import { IInterviewSlot } from "../../models/slot/interviewSlot"; // Assuming you have this interface
import { inject, injectable } from "inversify";
import { DI_REPOSITORIES } from "../../di/types";

@injectable()
export class SlotService implements ISlotService {
  constructor(
    @inject(DI_REPOSITORIES.SLOT_GENERATION_REPOSITORY)
    private readonly _slotGenerationRepository: ISlotGenerationRepository,
    @inject(DI_REPOSITORIES.INTERVIEW_SLOT_REPOSITORY)
    private readonly _interviewSlotRepository: IInterviewSlotRepository
  ) {}

  // Step 1: Create a rule and generate slots based on it
  async createRuleAndGenerateSlots(
    ruleData: ISlotGenerationRule
  ): Promise<IInterviewSlot[]> {
    const rule = await this._slotGenerationRepository.create(ruleData);
    console.log("Created rule", rule);
    const slots = await this.generateSlotsFromRule(rule);
    console.log("slots", slots);

    if (slots.length > 0) {
      await this._interviewSlotRepository.insertMany(slots);
    }

    console.log(
      `[SlotService] Created ${slots.length} slots for rule: ${rule._id}`
    );
    return slots;
  }

  // Step 2: Generate slots from the rule
  async generateSlotsFromRule(
    rule: ISlotGenerationRule
  ): Promise<IInterviewSlot[]> {
    const slots: IInterviewSlot[] = [];
    const current = new Date(rule.fromDate);
    const end = new Date(rule.toDate);

    while (current <= end) {
      const day = current.getDay(); // 0 = Sunday → 6 = Saturday
      console.log("day", day);
      if (rule.availableDays.includes(day)) {
        // Set working day start and end time
        const dayStart = new Date(current);
        dayStart.setHours(rule.startHour, 0, 0, 0);

        const dayEnd = new Date(current);
        dayEnd.setHours(rule.endHour, 0, 0, 0);

        let slotStart = new Date(dayStart);

        while (slotStart < dayEnd) {
          const slotEnd = new Date(
            slotStart.getTime() + rule.duration * 60 * 1000
          );

          if (slotEnd <= dayEnd) {
            const exists = await this._interviewSlotRepository.find({
              interviewerId: rule.interviewerId,
              startTime: slotStart,
              endTime: slotEnd,
            });
            console.log("exists", exists);

            if (exists.length === 0) {
              console.log("slot does not exist, adding to slots");
              slots.push({
                interviewerId: rule.interviewerId,
                startTime: new Date(slotStart),
                endTime: new Date(slotEnd),
                duration: rule.duration,
                status: "available",
                isAvailable: true,
                ruleId: rule._id,
              } as IInterviewSlot);
              console.log("slot added", slots);
            }
          }

          slotStart = new Date(
            slotStart.getTime() + (rule.duration + rule.buffer) * 60 * 1000
          );
        }
      }

      current.setDate(current.getDate() + 1); // Move to next day
    }

    return slots;
  }

  getSlotsByInterviewerId(
    interviewerId: string
  ): Promise<IInterviewSlot[] | []> {
    return this._interviewSlotRepository.find({ interviewerId });
  }
}
