import redisClient from "../config/RedisConfig";
import bcrypt from 'bcryptjs'

export const storeRefreshToken = async (userId: string, refreshToken: string) => {
    const hashedToken = await bcrypt.hash(refreshToken, 10); 
    await redisClient.set(`refreshToken:${userId}`, hashedToken, "EX", Number(process.env.REFRESH_TOKEN_EXPIRY)); 
};

// Verify Refresh Token
export const verifyRefreshToken = async (userId: string, refreshToken: string) => {
    const storedHashedToken = await redisClient.get(`refreshToken:${userId}`);
    if (!storedHashedToken || !(await bcrypt.compare(refreshToken, storedHashedToken))) {
        throw new Error("Invalid refresh token");
    }
    return true
};

// Delete Refresh Token (Logout)
export const deleteRefreshToken = async (userId: string) => {
    await redisClient.del(`refreshToken:${userId}`);
};
