import { IWallet, Wallet } from "../../models/wallet/Wallet";
import { BaseRepository } from "../base/BaseRepository";
import { IWalletRepository } from "./IWalletRepository";

export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {
    constructor() {
        super(Wallet);
    }
}