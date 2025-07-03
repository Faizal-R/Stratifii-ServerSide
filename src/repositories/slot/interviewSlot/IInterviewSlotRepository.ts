import { IInterviewSlot } from "../../../models/slot/interviewSlot";
import { IBaseRepository } from "../../base/IBaseRepository";
import { Document } from "mongoose";

export interface IInterviewSlotRepository extends IBaseRepository<IInterviewSlot>{
    insertMany(data: Partial<IInterviewSlot>[]): Promise<(IInterviewSlot & Document)[]>
}