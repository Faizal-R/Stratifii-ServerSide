import jwt from "jsonwebtoken";

export function generateAccessToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(userId: string, role: string): string {
  return jwt.sign(
    { userId, role },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn:'7d',
    }
  );
}
