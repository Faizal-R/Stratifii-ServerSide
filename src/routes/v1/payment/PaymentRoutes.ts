import { Router } from "express";

import { checkBlockedUser } from "../../../middlewares/checkBlockedUser";
import { verifyToken } from "../../../middlewares/Auth";

import { resolve } from "../../../di";
import { IPaymentTransactionController } from "../../../controllers/payment/IPaymentTransactionController";
import { DiControllers } from "../../../di/types";

const router = Router();

const paymentTransactionController = resolve<IPaymentTransactionController>(
 DiControllers.PaymentTransactionController
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
