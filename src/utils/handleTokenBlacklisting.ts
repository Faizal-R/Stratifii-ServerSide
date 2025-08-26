import redis from "../config/RedisConfig";

export const getBlacklistedToken = async (
  jti: string
): Promise<string | null> => {
  return await redis.get(`blacklisted_${jti}`);
};

export const blacklistToken = async (
  jti: string,
  ttl: number
): Promise<void> => {
  await redis.setex(`blacklisted_${jti}`, ttl, "true");
};
