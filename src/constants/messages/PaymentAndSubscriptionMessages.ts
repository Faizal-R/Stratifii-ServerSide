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
  
  
  export enum PAYMENT_MESSAGES{
    PAYMENT_CALCULATED = "Payment calculated successfully",
    PAYMENT_ORDER_CREATED = "Payment order created successfully",
    PAYMENT_VERIFIED_AND_PAYMENT_RECORDED = "Payment verified and recorded successfully",
    PAYMENT_VERIFICATION_FAILED="Payment Verification Failed ",
    ALREADY_PAYMENT_VERIFIED_AND_INTERVIEW_PROCESS_STARTED = "Payment already verified and interview process started",
    
  };
  