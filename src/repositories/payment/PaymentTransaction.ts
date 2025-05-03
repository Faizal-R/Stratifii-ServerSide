import { PaymentTransaction } from "../../models/payment/PaymentTransaction";
import { BaseRepository } from "../base/BaseRepository";
import { IPaymentTransaction } from "../../models/payment/PaymentTransaction";
import { IPaymentTransactionRepository } from "./IPaymentTransaction";

export class PaymentTransactionRepository
  extends BaseRepository<IPaymentTransaction>
  implements IPaymentTransactionRepository
{
  constructor() {
    super(PaymentTransaction);
  }
}
