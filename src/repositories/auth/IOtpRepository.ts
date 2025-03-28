// src/repositories/auth/IOtpRepository.ts
export interface IOtpRepository {
    /**
     * Save an OTP for a specific user
     * @param email The unique identifier for the user
     * @param otp The generated OTP to store
     * @param expiryInSeconds Time in seconds until the OTP expires
     */
    saveOtp(email: string, otp: string, expiryInSeconds: number): Promise<void>;
    
    /**
     * Retrieve a stored OTP for a specific user
     * @param email The unique identifier for the user
     * @returns The stored OTP or null if not found or expired
     */
    getOtp(email: string): Promise<string | null>;
    
    /**
     * Delete an OTP for a specific user
     * @param email The unique identifier for the user
     */
    deleteOtp(email: string): Promise<void>;

    /**
     * Check an otp is exists or expired 
     * @param email The unique identifier for the user
     */
    otpExists(email: string): Promise<boolean>;
  }