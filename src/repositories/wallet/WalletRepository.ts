import { injectable } from "inversify";
import { IWallet, Wallet } from "../../models/wallet/Wallet";
import { BaseRepository } from "../base/BaseRepository";
import { IWalletRepository } from "./IWalletRepository";

@injectable()
export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {
    constructor() {
        super(Wallet);
    }
}