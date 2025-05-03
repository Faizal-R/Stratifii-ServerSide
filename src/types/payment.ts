export interface ICalculatePaymentResponse {
    pricePerInterview: number;
    candidatesCount: number;
    totalAmount: number;
    platformFee: number;
    taxAmount: number;
    finalPayableAmount: number;
  }
  