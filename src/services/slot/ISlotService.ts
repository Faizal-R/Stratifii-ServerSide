import { IInterviewSlot } from "../../models/slot/interviewSlot"
import { ISlotGenerationRule } from "../../models/slot/slotGenerationRule"
export interface ISlotService {
    createRuleAndGenerateSlots(ruleData:ISlotGenerationRule):Promise<IInterviewSlot[]>
    generateSlotsFromRule(rule: ISlotGenerationRule): Promise<IInterviewSlot[]>
    getSlotsByInterviewerId(interviewerId: string): Promise<IInterviewSlot[]|[]>
}