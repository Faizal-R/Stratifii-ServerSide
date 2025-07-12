import { DiRepositories } from "./types";
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
import { InterviewSlotRepository } from "../repositories/slot/interviewSlot/InterviewSlotRepository";
import { SlotGenerationRepository } from "../repositories/slot/slotGenerationRule/SlotGenerationRepository";
import { SubscriptionPlanRepository } from "../repositories/subscription/subscription-plan/SubscriptionPlanRepository";
import { SubscriptionRecordRepository } from "../repositories/subscription/subscription-record/SubscriptionRecordRepository";

// Bind repositories to container
container.bind(DiRepositories.AdminRepository).to(AdminRepository).inSingletonScope();
container.bind(DiRepositories.AuthRepository).to(OtpRepository).inSingletonScope();
container.bind(DiRepositories.CandidateRepository).to(CandidateRepository).inSingletonScope();
container.bind(DiRepositories.DelegatedCandidateRepository).to(DelegatedCandidateRepository).inSingletonScope();
container.bind(DiRepositories.CompanyRepository).to(CompanyRepository).inSingletonScope();
container.bind(DiRepositories.InterviewerRepository).to(InterviewerRepository).inSingletonScope();
container.bind(DiRepositories.JobRepository).to(JobRepository).inSingletonScope();
container.bind(DiRepositories.PaymentTransactionRepository).to(PaymentTransactionRepository).inSingletonScope();
container.bind(DiRepositories.InterviewSlotRepository).to(InterviewSlotRepository).inSingletonScope();
container.bind(DiRepositories.SlotGenerationRepository).to(SlotGenerationRepository).inSingletonScope();
container.bind(DiRepositories.SubscriptionPlanRepository).to(SubscriptionPlanRepository).inSingletonScope();
container.bind(DiRepositories.SubscriptionRecordRepository).to(SubscriptionRecordRepository).inSingletonScope();
