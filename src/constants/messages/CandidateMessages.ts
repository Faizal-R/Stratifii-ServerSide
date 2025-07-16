export enum CANDIDATE_JOB_MESSAGE {
  NO_DELEGATIONS_FOUND = "No job assignments found for this candidate.",
  INVALID_DELEGATED_CANDIDATE_ID = "Invalid delegated candidate ID provided.",
  MOCK_ALREADY_COMPLETED = "You have already completed the mock interview for this job.",
  MOCK_STARTED_SUCCESS = "AI Mock Interview has started successfully.",
  MOCK_COMPLETED_SUCCESS = "Mock Interview completed. Await further updates.",
  FINAL_SCHEDULED = "Your final interview has been scheduled.",
  FINAL_COMPLETED = "Final interview completed successfully.",
  INTERVIEW_ALREADY_STARTED = "Interview has already started or completed.",
  INTERVIEW_NOT_ELIGIBLE = "You are not eligible to start this interview at the moment.",
  PASSWORD_SETUP_REQUIRED = "Please set up your password to access the interview platform.",
  FETCH_DELEGATED_JOBS="Delegated jobs fetched successfully."
}
