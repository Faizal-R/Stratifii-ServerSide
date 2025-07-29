import { injectable } from "inversify";
import SubscriptionRecord, {
  ISubscriptionRecord,
} from "../../../models/subscription/SubscriptionRecord";

import { BaseRepository } from "../../base/BaseRepository";
import { ISubscriptionRecordRepository } from "./ISubscriptionRecordRepository";
@injectable()
export class SubscriptionRecordRepository
  extends BaseRepository<ISubscriptionRecord>
  implements ISubscriptionRecordRepository
{
  constructor() {
    super(SubscriptionRecord);
  }
}
