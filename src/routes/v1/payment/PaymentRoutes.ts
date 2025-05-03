import { Router } from "express";

import { checkBlockedUser } from "../../../middlewares/checkBlockedUser";
import { verifyToken } from "../../../middlewares/Auth";
import { PaymentTransactionRepository } from "../../../repositories/payment/PaymentTransaction";
import { PaymentTransactionService } from "../../../services/payment/PaymentTransactionService";
import { PaymentTransactionController } from "../../../controllers/payment/PaymentTransactionController";
import { JobRepository } from "../../../repositories/job/JobRepository";

const router = Router();

const paymentTransactionRepository = new PaymentTransactionRepository();
const jobRespository = new JobRepository();
const paymentTransactionService = new PaymentTransactionService(
  paymentTransactionRepository,
  jobRespository
);
const paymentTransactionController = new PaymentTransactionController(
  paymentTransactionService
);

router.get(
  "calculate",
  verifyToken,
  checkBlockedUser,
  paymentTransactionController.calculatePayment.bind(
    paymentTransactionController
  )
);
router.post(
  "/order",
  verifyToken,
  checkBlockedUser,
  paymentTransactionController.createPaymentOrder.bind(
    paymentTransactionController
  )
);
router.post(
  "/verify",
  verifyToken,
  checkBlockedUser,
  paymentTransactionController.interviewProcessPaymentVerificationAndCreatePaymentRecord.bind(
    paymentTransactionController
  )
);

export default router;
