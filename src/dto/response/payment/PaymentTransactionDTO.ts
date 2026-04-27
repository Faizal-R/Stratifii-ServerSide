import { JobBasicDTO } from "../job/JobResponseDTO";

export interface PaymentTransactionBasicDTO {
  _id: string;
  job: JobBasicDTO | string;
  totalAmount: number;
  taxAmount: number;
  platformFee: number;
  finalPayableAmount: number;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  candidatesCount: number;
  pricePerInterview: number;
  paymentGatewayTransactionId?: string;
  createdAt?: Date;
}
export interface PaymentTransactionDTO extends PaymentTransactionBasicDTO {
  company: string;
}
