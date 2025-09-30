import container from ".";
import { DI_TOKENS } from "./types";

// Controller classes
import { AuthController } from "../controllers/auth/AuthController";
import { AdminController } from "../controllers/admin/AdminController";
import { CompanyController } from "../controllers/company/CompanyController";
import { JobController } from "../controllers/job/JobController";
import { InterviewerController } from "../controllers/interviewer/InterviewerController";
import { PaymentTransactionController } from "../controllers/payment/PaymentTransactionController";
import { CandidateController } from "../controllers/candidate/CandidateController";
import { SubscriptionController } from "../controllers/subscription/SubscriptionController";
import { SlotController } from "../controllers/slot/SlotController";
import { InterviewController } from "../controllers/interview/InterviewController";
import { PayoutController } from "../controllers/payout/PayoutController";

// Interfaces
import { IAuthController } from "../controllers/auth/IAuthController";
import { IAdminController } from "../controllers/admin/IAdminController";
import { ICompanyController } from "../controllers/company/ICompanyController";
import { IJobController } from "../controllers/job/IJobController";
import { IInterviewerController } from "../controllers/interviewer/IInterviewerController";
import { IPaymentTransactionController } from "../controllers/payment/IPaymentTransactionController";
import { ICandidateController } from "../controllers/candidate/ICandidateController";
import { ISubscriptionController } from "../controllers/subscription/ISubscriptonController";
import { ISlotController } from "../controllers/slot/ISlotController";
import { IInterviewController } from "../controllers/interview/IInterviewController";
import { IPayoutController } from "../controllers/payout/IPayoutController";

// Bind controllers with interfaces using DI_TOKENS
container.bind<IAuthController>(DI_TOKENS.CONTROLLERS.AUTH_CONTROLLER).to(AuthController);
container.bind<IAdminController>(DI_TOKENS.CONTROLLERS.ADMIN_CONTROLLER).to(AdminController);
container.bind<ICompanyController>(DI_TOKENS.CONTROLLERS.COMPANY_CONTROLLER).to(CompanyController);
container.bind<IJobController>(DI_TOKENS.CONTROLLERS.JOB_CONTROLLER).to(JobController);
container.bind<IInterviewerController>(DI_TOKENS.CONTROLLERS.INTERVIEWER_CONTROLLER).to(InterviewerController);
container.bind<IPaymentTransactionController>(DI_TOKENS.CONTROLLERS.PAYMENT_TRANSACTION_CONTROLLER).to(PaymentTransactionController);
container.bind<ICandidateController>(DI_TOKENS.CONTROLLERS.CANDIDATE_CONTROLLER).to(CandidateController);
container.bind<ISubscriptionController>(DI_TOKENS.CONTROLLERS.SUBSCRIPTION_CONTROLLER).to(SubscriptionController);
container.bind<ISlotController>(DI_TOKENS.CONTROLLERS.SLOT_CONTROLLER).to(SlotController);
container.bind<IInterviewController>(DI_TOKENS.CONTROLLERS.INTERVIEW_CONTROLLER).to(InterviewController);
container.bind<IPayoutController>(DI_TOKENS.CONTROLLERS.PAYOUT_CONTROLLER).to(PayoutController);
