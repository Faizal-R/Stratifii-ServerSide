import { Router } from "express";
const router = Router();
import { checkRole, verifyToken } from "../../../middlewares/Auth";
import { Roles } from "../../../constants/enums/roles";
import { resolve } from "../../../di";
import { DI_TOKENS } from "../../../di/types";
import { IAdminController } from "../../../controllers/admin/IAdminController";
import { IPayoutController } from "../../../controllers/payout/IPayoutController";

const adminController = resolve<IAdminController>(
  DI_TOKENS.CONTROLLERS.ADMIN_CONTROLLER
);
const payoutController = resolve<IPayoutController>(
  DI_TOKENS.CONTROLLERS.PAYOUT_CONTROLLER
);

router.post("/signin", adminController.signin.bind(adminController));

//Admin Company Management Routes
router.get(
  "/companies",
  verifyToken,
  checkRole([Roles.ADMIN]),
  adminController.getAllCompanies.bind(adminController)
);
router.patch(
  "/companies",
  verifyToken,
  checkRole([Roles.ADMIN]),
  adminController.updateCompanyStatus.bind(adminController)
);
router.patch(
  "/companies/:companyId/verify",
  verifyToken,
  checkRole([Roles.ADMIN]),
  adminController.updateCompanyVerificationStatus.bind(adminController)
);
router.patch(
  "/interviewers/:interviewerId/verify",
  verifyToken,
  checkRole([Roles.ADMIN]),
  adminController.updateInterviewerVerificationStatus.bind(adminController)
);

router.get(
  "/interviewers",
  verifyToken,
  checkRole([Roles.ADMIN]),
  adminController.getAllInterviewers.bind(adminController)
);

router.patch(
  "/interviewers",
  verifyToken,
  checkRole([Roles.ADMIN]),
  adminController.updateInterviewerStatus.bind(adminController)
);

router.get(
  "/payouts",
  verifyToken,
  checkRole([Roles.ADMIN]),
  payoutController.getAllInterviewersPayoutRequest.bind(payoutController)
);

router.patch(
  "/payouts/:payoutRequestId",
verifyToken,
  checkRole([Roles.ADMIN]),
  payoutController.updateInterviewersPayoutRequestStatus.bind(payoutController)
)

router.get(
  "/dashboard",
  adminController.getAdminDashboard.bind(adminController)
);

//admin Subscription plan routes

export default router;
