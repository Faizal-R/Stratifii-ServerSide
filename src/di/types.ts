export enum DI_REPOSITORIES {
  CANDIDATE_REPOSITORY = "CandidateRepository",
  COMPANY_REPOSITORY = "CompanyRepository",
  JOB_REPOSITORY = "JobRepository",
  SUBSCRIPTION_PLAN_REPOSITORY = "SubscriptionPlanRepository",
  SUBSCRIPTION_RECORD_REPOSITORY = "SubscriptionRecordRepository",
  ADMIN_REPOSITORY = "AdminRepository",
  AUTH_REPOSITORY = "AuthRepository",
  INTERVIEWER_REPOSITORY = "InterviewerRepository",
  PAYMENT_TRANSACTION_REPOSITORY = "PaymentTransactionRepository",
  INTERVIEW_SLOT_REPOSITORY = "InterviewerSlotRepository",
  SLOT_GENERATION_REPOSITORY = "SlotGenerationRepository",
  DELEGATED_CANDIDATE_REPOSITORY = "DelegatedCandidateRepository",
}

export enum DI_SERVICES {
  CANDIDATE_SERVICE = "CandidateService",
  COMPANY_SERVICE = "CompanyService",
  JOB_SERVICE = "JobService",
  SUBSCRIPTION_PLAN_SERVICE = "SubscriptionPlanService",
  SUBSCRIPTION_RECORD_SERVICE = "SubscriptionRecordService",
  ADMIN_SERVICE = "AdminService",
  AUTH_SERVICE = "AuthService",
  PAYMENT_TRANSACTION_SERVICE = "PaymentService",
  INTERVIEWER_SERVICE = "InterviewerService",
  SLOT_SERVICE = "SlotService",
}

export enum DI_CONTROLLERS {
  CANDIDATE_CONTROLLER = "CandidateController",
  COMPANY_CONTROLLER = "CompanyController",
  JOB_CONTROLLER = "JobController",
  SUBSCRIPTION_CONTROLLER = "SubscriptionController",
  ADMIN_CONTROLLER = "AdminController",
  AUTH_CONTROLLER = "AuthController",
  PAYMENT_TRANSACTION_CONTROLLER = "PaymentTransactionController",
  INTERVIEWER_CONTROLLER="InterviewerController"
}

export const DI_EXTERNAL_SERVICE = {
  REDIS: "Redis",
};
