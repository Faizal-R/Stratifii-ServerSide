import { IBookedSlot } from "../../models/slot/bookedSlot"
import { IInterviewSlot } from "../../models/slot/interviewSlot"
import { ISlotGenerationRule } from "../../models/slot/slotGenerationRule"
export interface ISlotService {
    createSlotGenerationRule(ruleData:ISlotGenerationRule):Promise<IInterviewSlot[]>
    // generateSlotsFromRule(rule: ISlotGenerationRule): Promise<IInterviewSlot[]>
    // getSlotsByInterviewerId(interviewerId: string): Promise<IInterviewSlot[]|[]>
     getSlotsByRule(interviewerId: string): Promise<IInterviewSlot[] | []>
      getInterviewerSlotGenerationRule(
    interviewerId: string
  ): Promise<ISlotGenerationRule | null>

  bookSlotForCandidate(payloadForSlotBooking: { interviewer: string; slot: IInterviewSlot; candidate: string; job: string; bookedBy:string }): Promise<IBookedSlot>
}