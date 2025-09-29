import PayoutHistory, {
  IPayoutHistory,
} from "../../../models/payout/PayoutHistory";
import { BaseRepository } from "../../base/BaseRepository";

export class PayoutHistoryRepository extends BaseRepository<IPayoutHistory> {
  constructor() {
    super(PayoutHistory);
  }
}

export default PayoutHistoryRepository;
