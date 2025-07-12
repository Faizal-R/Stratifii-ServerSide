import { injectable } from "inversify";
import InterviewSlot, { IInterviewSlot } from "../../../models/slot/interviewSlot";
import { BaseRepository } from "../../base/BaseRepository";
import { IInterviewSlotRepository } from "./IInterviewSlotRepository";
import { Document } from "mongoose";
@injectable()
export class InterviewSlotRepository
  extends BaseRepository<IInterviewSlot>
  implements IInterviewSlotRepository
{
  constructor() {
    super(InterviewSlot);
  }

  async insertMany(data: Partial<IInterviewSlot>[]): Promise<(IInterviewSlot & Document)[]> {
    return (await InterviewSlot.insertMany(data)) as (IInterviewSlot & Document)[];
  }
}
