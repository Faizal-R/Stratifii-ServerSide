import { IInterviewSlot } from "../models/slot/interviewSlot";
import { ISlotGenerationRule } from "../models/slot/slotGenerationRule";

  export function  generateSlotsFromRule(
    rule: ISlotGenerationRule|null
  ): IInterviewSlot[] {
    if (!rule) return [];

      const slots: IInterviewSlot[] = [];
      const current = new Date();
      const end = new Date(current);
      end.setDate(end.getDate() + 10); // Generate for 30 days

      while (current <= end) {
        const day = current.getDay();
        if (rule.availableDays.includes(day)) {
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
              slots.push({
                interviewerId: rule.interviewerId,
                startTime: new Date(slotStart),
                endTime: new Date(slotEnd),
                duration: rule.duration,
                status: "available",
                isAvailable: true,
                ruleId: rule._id,
              } as IInterviewSlot);
            }

            slotStart = new Date(
              slotStart.getTime() + (rule.duration + rule.buffer) * 60 * 1000
            );
          }
        }

        current.setDate(current.getDate() + 1);
      }

      return slots;
    
    
  }