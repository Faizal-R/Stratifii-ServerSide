import { injectable } from "inversify";
import SlotGenerationRule, {
  ISlotGenerationRule,
} from "../../../models/slot/slotGenerationRule";
import { BaseRepository } from "../../base/BaseRepository";
import { ISlotGenerationRepository } from "./ISlotGenerationRepository";
@injectable()
export class SlotGenerationRepository
  extends BaseRepository<ISlotGenerationRule>
  implements ISlotGenerationRepository
{
  constructor() {
    super(SlotGenerationRule);
  }
}
