// import container from "./index";
import { DI_CONTROLLERS } from "./types";
import container from ".";
import { AuthController } from "../controllers/auth/AuthController";
import { AdminController } from "../controllers/admin/AdminController";
import { CompanyController } from "../controllers/company/CompanyController";
import { JobController } from "../controllers/job/JobController";
import { InterviewerController } from "../controllers/interviewer/InterviewController";
import { PaymentTransactionController } from "../controllers/payment/PaymentTransactionController";
import { CandidateController } from "../controllers/candidate/CandidateController";
import { SubscriptionController } from "../controllers/subscription/SubscriptionController";

import { IAdminController } from "../controllers/admin/IAdminController";


container.bind(DI_CONTROLLERS.AUTH_CONTROLLER).to(AuthController)
container.bind<IAdminController>(DI_CONTROLLERS.ADMIN_CONTROLLER).to(AdminController)
container.bind(DI_CONTROLLERS.COMPANY_CONTROLLER).to(CompanyController)
container.bind(DI_CONTROLLERS.JOB_CONTROLLER).to(JobController)
container.bind(DI_CONTROLLERS.INTERVIEWER_CONTROLLER).to(InterviewerController)
container.bind(DI_CONTROLLERS.PAYMENT_TRANSACTION_CONTROLLER).to(PaymentTransactionController)
container.bind(DI_CONTROLLERS.CANDIDATE_CONTROLLER).to(CandidateController)
container.bind(DI_CONTROLLERS.SUBSCRIPTION_CONTROLLER).to(SubscriptionController)