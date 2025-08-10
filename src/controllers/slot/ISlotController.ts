import { Request, Response } from "express";
import { IBookedSlot } from "../../models/slot/bookedSlot";
import { IInterviewSlot } from "../../models/slot/interviewSlot";

export interface ISlotController {
    bookSlotForCandidate (request:Request,response:Response):Promise<void>;
}