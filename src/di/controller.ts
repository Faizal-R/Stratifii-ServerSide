import container from ".";
import { DiControllers } from "./types";

// Controller classes
import { AuthController } from "../controllers/auth/AuthController";
import { AdminController } from "../controllers/admin/AdminController";
import { CompanyController } from "../controllers/company/CompanyController";
import { JobController } from "../controllers/job/JobController";
import { InterviewerController } from "../controllers/interviewer/InterviewController";
import { PaymentTransactionController } from "../controllers/payment/PaymentTransactionController";
import { CandidateController } from "../controllers/candidate/CandidateController";
import { SubscriptionController } from "../controllers/subscription/SubscriptionController";

// Interfaces
import { IAuthController } from "../controllers/auth/IAuthController";
import { IAdminController } from "../controllers/admin/IAdminController";
import { ICompanyController } from "../controllers/company/ICompanyController";
import { IJobController } from "../controllers/job/IJobController";
import { IInterviewerController } from "../controllers/interviewer/IInterviewerController";
import { IPaymentTransactionController } from "../controllers/payment/IPaymentTransactionController";
import { ICandidateController } from "../controllers/candidate/ICandidateController";
import { ISubscriptionController } from "../controllers/subscription/ISubscriptonController";

// Bind controllers with interfaces
container.bind<IAuthController>(DiControllers.AuthController).to(AuthController);
container.bind<IAdminController>(DiControllers.AdminController).to(AdminController);
container.bind<ICompanyController>(DiControllers.CompanyController).to(CompanyController);
container.bind<IJobController>(DiControllers.JobController).to(JobController);
container.bind<IInterviewerController>(DiControllers.InterviewerController).to(InterviewerController);
container.bind<IPaymentTransactionController>(DiControllers.PaymentTransactionController).to(PaymentTransactionController);
container.bind<ICandidateController>(DiControllers.CandidateController).to(CandidateController);
container.bind<ISubscriptionController>(DiControllers.SubscriptionController).to(SubscriptionController);
