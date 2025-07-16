import container from ".";
import { DiExternalService, DiServices } from "./types";
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
import Redis from "ioredis";

// Bind services to container
container.bind(DiServices.CandidateService).to(CandidateService).inSingletonScope();
container.bind(DiServices.CompanyService).to(CompanyService).inSingletonScope();
container.bind(DiServices.JobService).to(JobService).inSingletonScope();
container.bind(DiServices.SubscriptionPlanService).to(SubscriptionPlanService).inSingletonScope();
container.bind(DiServices.SubscriptionRecordService).to(SubscriptionRecordService).inSingletonScope();
container.bind(DiServices.AdminService).to(AdminService).inSingletonScope();
container.bind(DiServices.AuthService).to(AuthService).inSingletonScope();
container.bind(DiServices.PaymentTransactionService).to(PaymentTransactionService).inSingletonScope();
container.bind(DiServices.InterviewerService).to(InterviewerService).inSingletonScope();  
container.bind(DiServices.SlotService).to(SlotService).inSingletonScope();
container.bind(DiServices.InterviewService).to(InterviewService).inSingletonScope();

// External service
container.bind<Redis>(DiExternalService.Redis).toConstantValue(redis);
