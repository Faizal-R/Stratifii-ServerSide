import { Request, Response } from "express";
import { IPaymentTransactionController } from "./IPaymentTransactionController";
 import { IPaymentTransactionService } from "../../services/payment/IPaymentTransactionService";
import { HttpStatus } from "../../config/HttpStatusCodes";
import { PAYMENT_SUCCESS_MESSAGES } from "../../constants/messages/PaymentAndSubscriptionMessages";
import { createResponse, errorResponse } from "../../helper/responseHandler";

export class PaymentTransactionController implements IPaymentTransactionController{
    constructor(private readonly _paymentTransactionService: IPaymentTransactionService) {
   
    }
    calculatePayment(req: Request, res: Response): void {
        const { candidatesCount } = req.body;
        const result = this._paymentTransactionService.calculatePayment(Number( candidatesCount));
        return createResponse(
            res,
            HttpStatus.OK,
            true,
            PAYMENT_SUCCESS_MESSAGES.PAYMENT_CALCULATED,
            result
        )
    }
    async createPaymentOrder(req: Request, res: Response): Promise<void> {
        const { totalAmount } = req.body;
        
        try {
            const result = await this._paymentTransactionService.createInterviewProcessPaymentOrder(Number(totalAmount));
            return createResponse(
                res,
                HttpStatus.OK,
                true,
                PAYMENT_SUCCESS_MESSAGES.PAYMENT_ORDER_CREATED,
                result
            )
        } catch (error) {
            errorResponse(res, error);
        }
    }

    async interviewProcessPaymentVerificationAndCreatePaymentRecord(req: Request, res: Response): Promise<void> {
        const paymentVerificationDetails=req.body
        const companyId=req.user?.userId;
        console.log(paymentVerificationDetails)
        try {
            const isVerified=await this._paymentTransactionService.interviewProcessPaymentVerificationAndCreatePaymentTransaction({...paymentVerificationDetails,companyId});
          
                return createResponse(
                    res,
                    HttpStatus.OK,
                    true,
                    PAYMENT_SUCCESS_MESSAGES.PAYMENT_VERIFIED_AND_PAYMENT_RECORDED,
                    isVerified
                )
            
        } catch (error) {
            errorResponse(res, error);
        }
    }
 
}