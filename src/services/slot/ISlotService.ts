import { IInterview } from "../../models/interview/Interview";
import { IInterviewSlot } from "../../models/slot/interviewSlot";
import { ISlotGenerationRule } from "../../models/slot/slotGenerationRule";
export interface ISlotService {
  createSlotGenerationRule(
    ruleData: ISlotGenerationRule
  ): Promise<IInterviewSlot[]>;
  // generateSlotsFromRule(rule: ISlotGenerationRule): Promise<IInterviewSlot[]>
  // getSlotsByInterviewerId(interviewerId: string): Promise<IInterviewSlot[]|[]>
  getSlotsByRule(interviewerId: string): Promise<IInterviewSlot[] | []>;
  getInterviewerSlotGenerationRule(
    interviewerId: string
  ): Promise<ISlotGenerationRule | null>;
     updateInterviewerSlotGenerationRule(
    interviewerId: string,
    ruleData: ISlotGenerationRule
  ): Promise<{rule:ISlotGenerationRule | null,slots:IInterviewSlot[]}>

  bookSlotForCandidate(payloadForSlotBooking: {
    interviewer: string;
    slot: IInterviewSlot;
    candidate: string;
    job: string;
    bookedBy: string;
    isFollowUpScheduling: boolean;
  }): Promise<IInterview>;
}
