import SubscriptionRecord, { ISubscriptionRecord } from "../../../models/subscription/SubscriptionRecord";

import { BaseRepository } from "../../base/BaseRepository";
import { ISubscriptionRecordRepository } from "./ISubscriptionRecordRepository";

export class SubscriptionRecordRepository extends BaseRepository<ISubscriptionRecord> implements ISubscriptionRecordRepository{
    constructor(){
        super(SubscriptionRecord);
    }
   
    
}