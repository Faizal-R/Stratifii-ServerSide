import container from ".";
import { DI_TOKENS } from "./types";
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
import { InterviewService } from "../services/interview/InterviewService";
import { PayoutService } from "../services/payout/PayoutService";
import Redis from "ioredis";
import { WalletService } from "../services/wallet/WalletService";

// Bind services to container using DI_TOKENS
container.bind(DI_TOKENS.SERVICES.CANDIDATE_SERVICE).to(CandidateService).inSingletonScope();
container.bind(DI_TOKENS.SERVICES.COMPANY_SERVICE).to(CompanyService).inSingletonScope();
container.bind(DI_TOKENS.SERVICES.JOB_SERVICE).to(JobService).inSingletonScope();
container.bind(DI_TOKENS.SERVICES.SUBSCRIPTION_PLAN_SERVICE).to(SubscriptionPlanService).inSingletonScope();
container.bind(DI_TOKENS.SERVICES.SUBSCRIPTION_RECORD_SERVICE).to(SubscriptionRecordService).inSingletonScope();
container.bind(DI_TOKENS.SERVICES.ADMIN_SERVICE).to(AdminService).inSingletonScope();
container.bind(DI_TOKENS.SERVICES.AUTH_SERVICE).to(AuthService).inSingletonScope();
container.bind(DI_TOKENS.SERVICES.PAYMENT_TRANSACTION_SERVICE).to(PaymentTransactionService).inSingletonScope();
container.bind(DI_TOKENS.SERVICES.INTERVIEWER_SERVICE).to(InterviewerService).inSingletonScope();
container.bind(DI_TOKENS.SERVICES.SLOT_SERVICE).to(SlotService).inSingletonScope();
container.bind(DI_TOKENS.SERVICES.INTERVIEW_SERVICE).to(InterviewService).inSingletonScope();
container.bind(DI_TOKENS.SERVICES.PAYOUT_SERVICE).to(PayoutService).inSingletonScope();
container.bind(DI_TOKENS.SERVICES.WALLET_SERVICE).to(WalletService).inSingletonScope();

// External service
container.bind<Redis>(DI_TOKENS.EXTERNAL.REDIS).toConstantValue(redis);
