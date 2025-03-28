
import { Redis } from 'ioredis';
import { IOtpRepository } from './IOtpRepository';

export class OtpRepository implements IOtpRepository {
  private readonly redisClient: Redis;
  private readonly keyPrefix: string = 'otp:';
  
  constructor(redisClient: Redis) {
    this.redisClient = redisClient;
  }
  
  /**
   * Generate a Redis key for storing OTP by userId
   */
  private getKey(email: string): string {
    return `${this.keyPrefix}${email}`;
  }
  
  /**
   * Save an OTP in Redis with expiration
   */
  async saveOtp(email:string, otp: string, expiryInSeconds: number = 300): Promise<void> {
    const key = this.getKey(email);
    await this.redisClient.set(key, otp, 'EX', expiryInSeconds);
  }
  
  /**
   * Get an OTP from Redis if it exists and hasn't expired
   */
  async getOtp(email: string): Promise<string | null> {
    const key = this.getKey(email);
    return await this.redisClient.get(key);
  }
  
  /**
   * Delete an OTP from Redis
   */
  async deleteOtp(email: string): Promise<void> {
    const key = this.getKey(email);
    await this.redisClient.del(key);
  }
  
  /**
   * Check if an OTP exists and hasn't expired
   */
  async otpExists(email: string): Promise<boolean> {
    const key = this.getKey(email);
    const exists = await this.redisClient.exists(key);
    return exists === 1;
  }

}