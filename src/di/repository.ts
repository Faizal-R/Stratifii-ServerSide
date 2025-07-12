import { DI_REPOSITORIES } from "./types";
import container from "."



//All repositories
import { AdminRepository } from "../repositories/admin/AdminRepository";
import {OtpRepository} from "../repositories/auth/OtpRepository";
import { CandidateRepository } from "../repositories/candidate/CandidateRepository";
import { DelegatedCandidateRepository } from "../repositories/candidate/candidateDelegation/DelegatedCandidateRepository";
import { CompanyRepository } from "../repositories/company/CompanyRepository";
import { InterviewerRepository } from "../repositories/interviewer/InterviewerRepository";
import { JobRepository } from "../repositories/job/JobRepository";
import { PaymentTransactionRepository } from "../repositories/payment/PaymentTransactionRepository";
import { InterviewSlotRepository } from "../repositories/slot/interviewSlot/InterviewSlotRepository";
import { SlotGenerationRepository } from "../repositories/slot/slotGenerationRule/SlotGenerationRepository";
import { SubscriptionPlanRepository } from "../repositories/subscription/subscription-plan/SubscriptionPlanRepository";
import { SubscriptionRecordRepository } from "../repositories//subscription/subscription-record/SubscriptionRecordRepository";


container.bind(DI_REPOSITORIES.ADMIN_REPOSITORY).to(AdminRepository).inSingletonScope();
container.bind(DI_REPOSITORIES.AUTH_REPOSITORY).to(OtpRepository).inSingletonScope();
container.bind(DI_REPOSITORIES.CANDIDATE_REPOSITORY).to(CandidateRepository).inSingletonScope();
container.bind(DI_REPOSITORIES.DELEGATED_CANDIDATE_REPOSITORY).to(DelegatedCandidateRepository).inSingletonScope();
container.bind(DI_REPOSITORIES.COMPANY_REPOSITORY).to(CompanyRepository).inSingletonScope();
container.bind(DI_REPOSITORIES.INTERVIEWER_REPOSITORY).to(InterviewerRepository).inSingletonScope();
container.bind(DI_REPOSITORIES.JOB_REPOSITORY).to(JobRepository).inSingletonScope();
container.bind(DI_REPOSITORIES.PAYMENT_TRANSACTION_REPOSITORY).to(PaymentTransactionRepository).inSingletonScope();
container.bind(DI_REPOSITORIES.INTERVIEW_SLOT_REPOSITORY).to(InterviewSlotRepository).inSingletonScope();
container.bind(DI_REPOSITORIES.SLOT_GENERATION_REPOSITORY).to(SlotGenerationRepository).inSingletonScope();
container.bind(DI_REPOSITORIES.SUBSCRIPTION_PLAN_REPOSITORY).to(SubscriptionPlanRepository).inSingletonScope();
container.bind(DI_REPOSITORIES.SUBSCRIPTION_RECORD_REPOSITORY).to(SubscriptionRecordRepository).inSingletonScope();