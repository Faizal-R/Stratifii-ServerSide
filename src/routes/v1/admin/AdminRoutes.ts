import { Router } from "express";
const router = Router();
import { AdminController } from "../../../controllers/admin/AdminController";
import { AdminService } from "../../../services/admin/AdminService";
import { AdminRepository } from "../../../repositories/admin/AdminRepository";
import { CompanyRepository } from "../../../repositories/company/CompanyRepository";
import { InterviewerRepository } from "../../../repositories/interviewer/InterviewerRepository";
import { checkRole, verifyToken } from "../../../middlewares/Auth";
import { Roles } from "../../../constants/roles";
import { SubscriptionPlanRepository } from "../../../repositories/subscription/subscription-plan/SubscriptionPlanRepository";
import { SubscriptionPlanService } from "../../../services/subscription/subscription-plan/SubscriptionPlanService";
import { SubscriptionController } from "../../../controllers/subscription/SubscriptionController";

const companyRepository = new CompanyRepository();
const interviewerRepository = new InterviewerRepository();

const adminRepository = new AdminRepository(
  companyRepository,
  interviewerRepository
);
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

const subscriptionPlanRepository = new SubscriptionPlanRepository();
const subscriptionPlanService = new SubscriptionPlanService(
  subscriptionPlanRepository
);
const subscriptionPlanController = new SubscriptionController(
  subscriptionPlanService
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

//admin Subscription plan routes

router.post(
  "/subscription",
  verifyToken,
  checkRole([Roles.ADMIN]),
  subscriptionPlanController.createSubscription.bind(subscriptionPlanController)
);

router.get(
  "/subscription",
  verifyToken,
  checkRole([Roles.ADMIN,Roles.COMPANY]),
  subscriptionPlanController.getAllSubscriptions.bind(subscriptionPlanController)
);

router.put(
  "/subscription/:subscriptionId",
  verifyToken,
  checkRole([Roles.ADMIN]),
  subscriptionPlanController.updateSubscription.bind(subscriptionPlanController)
);

export default router;
