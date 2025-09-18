import { inject, injectable } from "inversify";
import { IWallet } from "../../models/wallet/Wallet";
import { IWalletRepository } from "../../repositories/wallet/IWalletRepository";
import { IWalletService } from "./IWalletService";
import { DI_TOKENS } from "../../di/types";
import { ITransaction } from "../../models/transaction/Transaction";
import { ITransactionRepository } from "../../repositories/transaction/ITransactionRepository";
@injectable()
export class WalletService implements IWalletService {
  constructor(
    @inject(DI_TOKENS.REPOSITORIES.WALLET_REPOSITORY)
    private _walletRepository: IWalletRepository,
    @inject(DI_TOKENS.REPOSITORIES.TRANSACTION_REPOSITORY)
    private readonly _transactionRepository: ITransactionRepository
  ) {}
  async createUserWallet(walletPayload: IWallet): Promise<IWallet> {
    const userWallet = await this._walletRepository.create(walletPayload);
    return userWallet;
  }
  async getUserWalletAndTransactions(
    userId: string
  ): Promise<{ wallet: IWallet | null; transactions: ITransaction[] }> {
    try {
      const wallet = (await this._walletRepository.findOne({
        userId,
      })) as IWallet;
      // Make sure to use the correct repository/method to fetch transactions, not wallets
      const transactions = (await this._transactionRepository.find({
        walletId: wallet._id,
      })) as ITransaction[];
      return { wallet: wallet, transactions: transactions };
    } catch (error) {
      throw error;
    }
  }
}
