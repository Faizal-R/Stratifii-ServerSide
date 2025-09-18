import { ITransaction } from "../../models/transaction/Transaction";
import { IWallet } from "../../models/wallet/Wallet";

export interface IWalletService {
  createUserWallet(walletPayload: IWallet): Promise<IWallet>;
  getUserWalletAndTransactions(
    userId: string
  ): Promise<{ wallet: IWallet|null; transactions: ITransaction[] }>;
}
