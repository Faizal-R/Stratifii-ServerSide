import { Request, Response } from "express";

export interface IPaymentTransactionController {
    calculatePayment (req: Request, res: Response):void;
    createPaymentOrder (req: Request, res: Response):Promise<void>;
    interviewProcessPaymentVerificationAndCreatePaymentRecord (req: Request, res: Response):Promise<void>;
    handleRetryInterviewProcessInitializationPayment (req: Request, res: Response):Promise<void>;
}