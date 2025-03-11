export enum ERROR_MESSAGES {
  INTERNAL_SERVER_ERROR = "An unexpected error occurred. Please try again later.",
  BAD_REQUEST = "The request could not be understood or was missing required parameters.",
  UNAUTHORIZED = "You are not authorized to access this resource.",
  FORBIDDEN = "You are not allowed to perform this action.",
  NOT_FOUND = "The requested resource could not be found.",
  INVALID_INPUT = "The request contains invalid data.",
}

export enum AUTH_SUCCESS_MESSAGES {
  LOGGED_IN = "Logged in successfully",
  COMPANY_REGISTERED = "Company registered successfully. A verification code has been sent to your email.",
  INTERVIEWER_REGISTERED = "Interviewer registered successfully. A verification code has been sent to your email.",
  OTP_VERIFIED = "OTP Verified Successfully",
  RESEND_OTP_SUCCESS = "Your OTP has been resent successfully.",
  GOOGLE_AUTH_SUCCESS = "Google Authentication Successful",
}

export enum COMPANY_SUCCESS_MESSAGES {
  COMPANY_PROFILE_UPDATED = "Company profile updated successfully",
}

export enum INTERVIEWER__SUCCESS_MESSAGES {
  INTERVIEWER_PROFILE_UPDATED = "Interviewer profile updated successfully",
  INTERVIEWER_PROFILE_FETCHED = "Interviewer profile fetched successfully",
}
