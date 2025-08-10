import { IBookedSlot } from "../../../models/slot/bookedSlot";
import bookedSlot from "../../../models/slot/bookedSlot";
import { BaseRepository } from "../../base/BaseRepository";
import { IBookedSlotRepository } from "./IBookedSlotRepository";

export class BookedSlotRepository extends BaseRepository<IBookedSlot> implements IBookedSlotRepository {
    constructor() {
        super(bookedSlot);
    }
}