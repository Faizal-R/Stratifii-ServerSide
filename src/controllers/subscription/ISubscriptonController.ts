import { Request,Response } from "express";

export interface ISubscriptionController{
    createSubscription(request:Request,response:Response):Promise<void>
    getAllSubscriptions(request:Request,response:Response):Promise<void>
    updateSubscription(request:Request,response:Response):Promise<void>
}