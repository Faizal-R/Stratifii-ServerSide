import { DI_TOKENS } from "./types";
import container from ".";

// All repositories
import { AdminRepository } from "../repositories/admin/AdminRepository";
import { OtpRepository } from "../repositories/auth/OtpRepository";
import { CandidateRepository } from "../repositories/candidate/CandidateRepository";
import { DelegatedCandidateRepository } from "../repositories/candidate/candidateDelegation/DelegatedCandidateRepository";
import { CompanyRepository } from "../repositories/company/CompanyRepository";
import { InterviewerRepository } from "../repositories/interviewer/InterviewerRepository";
import { JobRepository } from "../repositories/job/JobRepository";
import { PaymentTransactionRepository } from "../repositories/payment/PaymentTransactionRepository";
import { SlotGenerationRepository } from "../repositories/slot/slotGenerationRule/SlotGenerationRepository";
import { SubscriptionPlanRepository } from "../repositories/subscription/subscription-plan/SubscriptionPlanRepository";
import { SubscriptionRecordRepository } from "../repositories/subscription/subscription-record/SubscriptionRecordRepository";
import { InterviewRepository } from "../repositories/interview/InterviewRepository";

// Bind repositories to container using DI_TOKENS
container.bind(DI_TOKENS.REPOSITORIES.ADMIN_REPOSITORY).to(AdminRepository).inSingletonScope();
container.bind(DI_TOKENS.REPOSITORIES.OTP_REPOSITORY).to(OtpRepository).inSingletonScope();
container.bind(DI_TOKENS.REPOSITORIES.CANDIDATE_REPOSITORY).to(CandidateRepository).inSingletonScope();
container.bind(DI_TOKENS.REPOSITORIES.DELEGATED_CANDIDATE_REPOSITORY).to(DelegatedCandidateRepository).inSingletonScope();
container.bind(DI_TOKENS.REPOSITORIES.COMPANY_REPOSITORY).to(CompanyRepository).inSingletonScope();
container.bind(DI_TOKENS.REPOSITORIES.INTERVIEWER_REPOSITORY).to(InterviewerRepository).inSingletonScope();
container.bind(DI_TOKENS.REPOSITORIES.JOB_REPOSITORY).to(JobRepository).inSingletonScope();
container.bind(DI_TOKENS.REPOSITORIES.PAYMENT_TRANSACTION_REPOSITORY).to(PaymentTransactionRepository).inSingletonScope();
container.bind(DI_TOKENS.REPOSITORIES.SLOT_GENERATION_REPOSITORY).to(SlotGenerationRepository).inSingletonScope();
container.bind(DI_TOKENS.REPOSITORIES.SUBSCRIPTION_PLAN_REPOSITORY).to(SubscriptionPlanRepository).inSingletonScope();
container.bind(DI_TOKENS.REPOSITORIES.SUBSCRIPTION_RECORD_REPOSITORY).to(SubscriptionRecordRepository).inSingletonScope();
container.bind(DI_TOKENS.REPOSITORIES.INTERVIEW_REPOSITORY).to(InterviewRepository).inSingletonScope();
