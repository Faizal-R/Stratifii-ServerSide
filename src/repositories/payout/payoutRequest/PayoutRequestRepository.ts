import PayoutRequest, {
  IPayoutRequest,
} from "../../../models/payout/PayoutRequest";
import { BaseRepository } from "../../base/BaseRepository";
import { IPayoutRequestRepository } from "./IPayoutRequestRepository";

export class PayoutRequestRepository
  extends BaseRepository<IPayoutRequest>
  implements IPayoutRequestRepository
{
  constructor() {
    super(PayoutRequest);
  }
}

export default PayoutRequestRepository;
