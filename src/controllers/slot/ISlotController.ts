import { Request, Response } from "express";

import { IInterviewSlot } from "../../models/slot/interviewSlot";

export interface ISlotController {
    bookSlotForCandidate (request:Request,response:Response):Promise<void>;
}