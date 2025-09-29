import redis from "../config/RedisConfig";

export const isTokenBlacklisted=async(jti:string):Promise<boolean>=>  {
  const result = await redis.get(`blacklisted_${jti}`);
  return result === "true";
}


export const blacklistToken = async (
  jti: string,
  ttl: number
): Promise<void> => {
  await redis.setex(`blacklisted_${jti}`, ttl, "true");
};
