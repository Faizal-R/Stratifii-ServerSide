import { Router } from "express";

import { checkRole, verifyToken } from "../../../middlewares/Auth";
import { uploader } from "../../../middlewares/multer";
import { ensureActiveSubscription } from "../../../middlewares/subscriptionExpiry";
import { resolve } from "../../../di";
import { ICompanyController } from "../../../controllers/company/ICompanyController";
import { DI_CONTROLLERS } from "../../../di/types";
import { IJobController } from "../../../controllers/job/IJobController";
import { ISubscriptionController } from "../../../controllers/subscription/ISubscriptonController";
const router = Router();

const companyController = resolve<ICompanyController>(
  DI_CONTROLLERS.COMPANY_CONTROLLER
);

const jobController = resolve<IJobController>(DI_CONTROLLERS.JOB_CONTROLLER);

const subscriptionController = resolve<ISubscriptionController>(
  DI_CONTROLLERS.SUBSCRIPTION_CONTROLLER
);

//company profile
router.get(
  "/profile",
  companyController.getCompanyById.bind(companyController)
);
router.put(
  "/profile",

  uploader.single("companyLogo"),
  companyController.updateCompanyProfile.bind(companyController)
);
router.put(
  "/change-password",
  companyController.changePassword.bind(companyController)
);

//company interview Delegation routes

router.get(
  "/jobs",

  jobController.getAllJobs.bind(jobController)
);
router.post(
  "/jobs",
  ensureActiveSubscription,
  jobController.createJob.bind(jobController)
);
router.put(
  "/jobs",

  jobController.updateJob.bind(jobController)
);
router.delete(
  "/jobs/:jobId",

  jobController.deleteJob.bind(jobController)
);

router.post(
  "/jobs/:jobId/resumes",

  uploader.array("resumes"),
  jobController.createCandidatesFromResumesAndAddToJob.bind(jobController)
);

router.get(
  "/jobs/:jobId/candidates",

  jobController.getCandidatesByJobId.bind(jobController)
);

//creating subscription payment order
router.post(
  "/subscription/payment-order",
  subscriptionController.createPaymentOrder.bind(subscriptionController)
);

router.post(
  "/subscription/payment-verify",
  verifyToken,
  subscriptionController.subscriptionPaymentVerificationAndCreateSubscriptionRecord.bind(
    subscriptionController
  )
);
router.get(
  "/subscription/plan",
  subscriptionController.getSubscriptionPlanDetails.bind(subscriptionController)
);

export default router;
