import dotenv from "dotenv";

dotenv.config();

import jwt, { SignOptions } from "jsonwebtoken";

import crypto from "crypto";

export function generateTokenId(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function generateAccessToken(payload: {
  userId: string;
  role: string;
  email?: string;
}): string {
  const secret = process.env.ACCESS_TOKEN_SECRET as string;

  const options: SignOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"], // "15m" is valid here
  };

  return jwt.sign(payload, secret, options);
}

export function generateRefreshToken(payload: {
  userId: string;
  role: string;
  jti: string;
}): string {
  const secret = process.env.REFRESH_TOKEN_SECRET as string;

  const options: jwt.SignOptions = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"], // "7d"
  };

  return jwt.sign(payload, secret, options);
}
