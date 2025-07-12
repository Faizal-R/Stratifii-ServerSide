import { PaymentTransaction } from "../../models/payment/PaymentTransaction";
import { BaseRepository } from "../base/BaseRepository";
import { IPaymentTransaction } from "../../models/payment/PaymentTransaction";
import { IPaymentTransactionRepository } from "./IPaymentTransactionRepository";
import { injectable } from "inversify";
@injectable()
export class PaymentTransactionRepository
  extends BaseRepository<IPaymentTransaction>
  implements IPaymentTransactionRepository
{
  constructor() {
    super(PaymentTransaction);
  }
}
