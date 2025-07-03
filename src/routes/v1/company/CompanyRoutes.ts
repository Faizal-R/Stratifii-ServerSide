import { Router } from "express";
import { CompanyRepository } from "../../../repositories/company/CompanyRepository";
import { CompanyService } from "../../../services/company/CompanySerive";
import { CompanyController } from "../../../controllers/company/CompanyController";
import { checkRole, verifyToken } from "../../../middlewares/Auth";
import { checkBlockedUser } from "../../../middlewares/checkBlockedUser";
import { JobRepository } from "../../../repositories/job/JobRepository";
import { JobService } from "../../../services/job/JobService";
import { JobController } from "../../../controllers/job/JobController";
import { Roles } from "../../../constants/roles";
import { uploader } from "../../../middlewares/multer";
import Interviewer, {
  IInterviewer,
} from "../../../models/interviewer/Interviewer";
import { Candidate, Company } from "../../../models";
import { ICompany } from "../../../models/company/Company";
import { createResponse } from "../../../helper/responseHandler";
import { SubscriptionRecordRepository } from "../../../repositories/subscription/subscription-record/SubscriptionRecordRepository";
import { SubscriptionRecordService } from "../../../services/subscription/subscription-record/SubscriptionRecordService";
import { SubscriptionController } from "../../../controllers/subscription/SubscriptionController";
import { ISubscriptionPlanService } from "../../../services/subscription/subscription-plan/ISubscriptionPlanService";
import { SubscriptionPlanRepository } from "../../../repositories/subscription/subscription-plan/SubscriptionPlanRepository";
import { SubscriptionPlanService } from "../../../services/subscription/subscription-plan/SubscriptionPlanService";
import { CandidateRepository } from "../../../repositories/candidate/CandidateRepository";
import { ensureActiveSubscription } from "../../../middlewares/subscriptionExpiry";
const router = Router();

const companyRepository = new CompanyRepository();
const companyService = new CompanyService(companyRepository);
const companyController = new CompanyController(companyService);

const jobRespository = new JobRepository();
const candidateRepository = new CandidateRepository();
const jobService = new JobService(jobRespository, candidateRepository);
const jobController = new JobController(jobService);

const subscriptionRepository = new SubscriptionRecordRepository();
const subscriptionService = new SubscriptionRecordService(
  subscriptionRepository,
  companyRepository
);

const subscriptionPlanRepository = new SubscriptionPlanRepository();
const subscriptionPlanService = new SubscriptionPlanService(
  subscriptionPlanRepository
);

const subscriptionController = new SubscriptionController(
  subscriptionPlanService,
  subscriptionService
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
router.post("/jobs",ensureActiveSubscription, jobController.createJob.bind(jobController));
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
router.get('/subscription/plan',subscriptionController.getSubscriptionPlanDetails.bind(subscriptionController))

export default router;
