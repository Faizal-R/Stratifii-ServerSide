export enum DiRepositories {
  CandidateRepository = "CandidateRepository",
  CompanyRepository = "CompanyRepository",
  JobRepository = "JobRepository",
  SubscriptionPlanRepository = "SubscriptionPlanRepository",
  SubscriptionRecordRepository = "SubscriptionRecordRepository",
  AdminRepository = "AdminRepository",
  AuthRepository = "AuthRepository",
  InterviewerRepository = "InterviewerRepository",
  PaymentTransactionRepository = "PaymentTransactionRepository",
  InterviewSlotRepository = "InterviewerSlotRepository",
  SlotGenerationRepository = "SlotGenerationRepository",
  DelegatedCandidateRepository = "DelegatedCandidateRepository",
}

export enum DiServices {
  CandidateService = "CandidateService",
  CompanyService = "CompanyService",
  JobService = "JobService",
  SubscriptionPlanService = "SubscriptionPlanService",
  SubscriptionRecordService = "SubscriptionRecordService",
  AdminService = "AdminService",
  AuthService = "AuthService",
  PaymentTransactionService = "PaymentService",
  InterviewerService = "InterviewerService",
  SlotService = "SlotService",
  InterviewService="InterviewService"
}

export enum DiControllers {
  CandidateController = "CandidateController",
  CompanyController = "CompanyController",
  JobController = "JobController",
  SubscriptionController = "SubscriptionController",
  AdminController = "AdminController",
  AuthController = "AuthController",
  PaymentTransactionController = "PaymentTransactionController",
  InterviewerController = "InterviewerController",
}

export const DiExternalService = {
  Redis: "Redis",
};
