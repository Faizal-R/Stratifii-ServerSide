export enum ERROR_MESSAGES {
  INTERNAL_SERVER_ERROR = "An unexpected error occurred. Please try again later.",
  BAD_REQUEST = "The request could not be understood or was missing required parameters.",
  UNAUTHORIZED = "You are not authorized to access this resource.",
  FORBIDDEN = "You are not allowed to perform this action.",
  NOT_FOUND = "The requested resource could not be found.",
  INVALID_INPUT = "The request contains invalid data.",
}
export enum COMMON_MESSAGES{
  ALREADY_EXIST = "The requested resource is already Exists."
}

export enum AUTH_SUCCESS_MESSAGES {
  LOGGED_IN = "Logged in successfully",
  COMPANY_REGISTERED = "Company registered successfully. A verification code has been sent to your email.",
  INTERVIEWER_REGISTERED = "Interviewer registered successfully. A verification code has been sent to your email.",
  OTP_VERIFIED = "OTP Verified Successfully",
  RESEND_OTP_SUCCESS = "Your OTP has been resent successfully.",
  GOOGLE_AUTH_SUCCESS = "Google Authentication Successful",
  PASSWORD_RESET_SUCCESS = "Your password has been successfully reset. You can now log in with your new password.",
  PASSWORD_RESET_FAILED = "Password reset failed. Please try again or request a new reset link.",
  PASSWORD_RESET_LINK_SENT = "A password reset link has been sent to your email. Please check your inbox.",
  INVALID_TOKEN = "Invalid or expired token. Please request a new password reset link.",
  ACCESS_TOKEN_REFRESHED = "Access token refreshed successfully",
  LOGGED_OUT = "Logged out successfully",

}

export enum COMPANY_SUCCESS_MESSAGES {
  COMPANY_PROFILE_UPDATED = "Company profile updated successfully",
}

export enum INTERVIEWER__SUCCESS_MESSAGES {
  INTERVIEWER_PROFILE_UPDATED = "Interviewer profile updated successfully",
  INTERVIEWER_PROFILE_FETCHED = "Interviewer profile fetched successfully",
}


export enum ADMIN_SUCCESS_MESSAGES{
  ADMIN_USER_UPDATED = "Admin user updated successfully",
  ADMIN_USER_FETCHED = "Admin user fetched successfully",
}


 export enum JOB_SUCCESS_MESSAGES {
  JOB_CREATED = "Job created successfully",
  JOB_UPDATED = "Job updated successfully",
  JOB_DELETED = "Job deleted successfully",
  JOB_FETCHED = "Job fetched successfully",
}

export enum SUBSCRIPTION_SUCCESS_MESSAGES {
  SUBSCRIPTION_PLAN_CREATED = "Subscription plan created successfully",
  SUBSCRIPTION_PLAN_UPDATED = "Subscription plan updated successfully",
  SUBSCRIPTION_PLAN_DELETED = "Subscription plan deleted successfully",
  SUBSCRIPTION_PLAN_FETCHED = "Subscription plan fetched successfully",
  SUBSCRIPTION_SUBSCRIBED = "Subscription subscribed successfully",
  SUBSCRIPTION_UNSUBSCRIBED = "Subscription unsubscribed successfully",
  SUBSCRIPTION_PAYMENT_ORDER_SUCCESS = "Subscription payment order created successfully",
}
export enum SUBSCRIPTION_ERROR_MESSAGES {
  SUBSCRIPTION_PLAN_NOT_FOUND = "Subscription plan not found", 
  SUBSCRIPTION_ALREADY_SUBSCRIBED = "You have already subscribed to this plan",
  SUBSCRIPTION_PAYMENT_FAILED = "Payment failed. Please try again.",
}