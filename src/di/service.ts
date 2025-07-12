import container from "."
import { DI_EXTERNAL_SERVICE, DI_SERVICES } from "./types"
import redis from "../config/RedisConfig";

import { CandidateService } from "../services/candidate/CandidateService";
import { CompanyService } from "../services/company/CompanySerive";
import { JobService } from "../services/job/JobService";
import { SubscriptionPlanService } from "../services/subscription/subscription-plan/SubscriptionPlanService";
import { SubscriptionRecordService } from "../services/subscription/subscription-record/SubscriptionRecordService";
import { AdminService } from "../services/admin/AdminService";
import { AuthService } from "../services/auth/AuthService";
import { PaymentTransactionService } from "../services/payment/PaymentTransactionService";
import { InterviewerService } from "../services/interviewer/InterviewerService";  
import { SlotService } from "../services/slot/SlotService";
import Redis from "ioredis";


container.bind(DI_SERVICES.CANDIDATE_SERVICE).to(CandidateService).inSingletonScope();
container.bind(DI_SERVICES.COMPANY_SERVICE).to(CompanyService).inSingletonScope();
container.bind(DI_SERVICES.JOB_SERVICE).to(JobService).inSingletonScope();
container.bind(DI_SERVICES.SUBSCRIPTION_PLAN_SERVICE).to(SubscriptionPlanService).inSingletonScope();
container.bind(DI_SERVICES.SUBSCRIPTION_RECORD_SERVICE).to(SubscriptionRecordService).inSingletonScope();
container.bind(DI_SERVICES.ADMIN_SERVICE).to(AdminService).inSingletonScope();
container.bind(DI_SERVICES.AUTH_SERVICE).to(AuthService).inSingletonScope();
container.bind(DI_SERVICES.PAYMENT_TRANSACTION_SERVICE).to(PaymentTransactionService).inSingletonScope();
container.bind(DI_SERVICES.INTERVIEWER_SERVICE).to(InterviewerService).inSingletonScope();  
container.bind(DI_SERVICES.SLOT_SERVICE).to(SlotService).inSingletonScope();

//External Service

container.bind<Redis>(DI_EXTERNAL_SERVICE.REDIS).toConstantValue(redis)
