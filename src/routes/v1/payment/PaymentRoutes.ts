import { Router } from "express";

import { checkBlockedUser } from "../../../middlewares/checkBlockedUser";
import { verifyToken } from "../../../middlewares/Auth";

import { resolve } from "../../../di";
import { IPaymentTransactionController } from "../../../controllers/payment/IPaymentTransactionController";
import { DI_TOKENS } from "../../../di/types";
import { ICompanyController } from "../../../controllers/company/ICompanyController";

const router = Router();

const paymentTransactionController = resolve<IPaymentTransactionController>(
  DI_TOKENS.CONTROLLERS.PAYMENT_TRANSACTION_CONTROLLER
);

const  companyController=resolve<ICompanyController>(DI_TOKENS.CONTROLLERS.COMPANY_CONTROLLER)
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
router.patch(
  "/retry/:jobId",
  verifyToken,
  checkBlockedUser,
  paymentTransactionController.handleRetryInterviewProcessInitializationPayment.bind(
    paymentTransactionController
  )
);


router.get(
  '/history/:companyId',
  verifyToken,
  checkBlockedUser,
  companyController.getCompanyPaymentHistory.bind(companyController)
)
export default router;
