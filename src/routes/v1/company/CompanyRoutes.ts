import { Router } from "express";

import { checkRole, verifyToken } from "../../../middlewares/Auth";
import { uploader } from "../../../middlewares/multer";
import { ensureActiveSubscription } from "../../../middlewares/subscriptionExpiry";
import { resolve } from "../../../di";
import { ICompanyController } from "../../../controllers/company/ICompanyController";
import { DiControllers } from "../../../di/types";
import { IJobController } from "../../../controllers/job/IJobController";
import { ISubscriptionController } from "../../../controllers/subscription/ISubscriptonController";
import { ISlotController } from "../../../controllers/slot/ISlotController";
import { CompanyController } from "../../../controllers/company/CompanyController";

const router = Router();

const companyController = resolve<ICompanyController>(
  DiControllers.CompanyController
);

const jobController = resolve<IJobController>(DiControllers.JobController);

const subscriptionController = resolve<ISubscriptionController>(
  DiControllers.SubscriptionController
);

const  slotController = resolve<ISlotController>(DiControllers.SlotController);

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
  jobController.createCandidatesFromResumes.bind(jobController)
);

router.get(
  "/jobs/:jobId/candidates",

  jobController.getCandidatesByJob.bind(jobController)
);

router.get(
  "/jobs/in-progress",
  jobController.getJobsInProgress.bind(jobController)
);

router.get(
  "/jobs/:jobId/qualified-candidates",
  jobController.getMockQualifiedCandidatesByJob.bind(jobController)
);


router.get('/jobs/:jobId/matched-interviewers', jobController.getMatchedInterviewersByJobDescription.bind(jobController))


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


//book slot for candidate


router.post('/book-slot', slotController.bookSlotForCandidate.bind(slotController))

//dashboard routes
router.get('/dashboard', companyController.getCompanyDashboard.bind(companyController))


export default router;
