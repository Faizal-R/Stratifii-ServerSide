import { injectable } from "inversify";
import { ITransaction, Transaction } from "../../models/transaction/Transaction";
import { BaseRepository } from "../base/BaseRepository";
import { ITransactionRepository } from "./ITransactionRepository";

@injectable()
export class TransactionRepository
  extends BaseRepository<ITransaction>
  implements ITransactionRepository 
{
  constructor() {
    super(Transaction);
  }
}
