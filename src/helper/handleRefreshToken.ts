import redisClient from "../config/RedisConfig";
import bcrypt from "bcryptjs";

export const storeRefreshToken = async (
  sessionId: string,
  refreshToken: string
) => {
  const hashedToken = await bcrypt.hash(refreshToken, 10);
  await redisClient.set(
    `refreshToken:${sessionId}`,
    hashedToken,
    "EX",
    Number(process.env.REFRESH_TOKEN_EXPIRY)
  );
};

// Verify Refresh Token
export const verifyRefreshToken = async (
  sessionId: string,
  refreshToken: string
) => {
  const storedHashedToken = await redisClient.get(`refreshToken:${sessionId}`);
  console.log("storedHashedToken", storedHashedToken);
  if (!storedHashedToken) return false;

  return await bcrypt.compare(refreshToken, storedHashedToken);
};

// Delete Refresh Token (Logout)

export const deleteRefreshToken = async (sessionId: string) => {
  await redisClient.del(`refreshToken:${sessionId}`);
};
