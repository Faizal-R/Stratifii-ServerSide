
import dotenv from 'dotenv'

dotenv.config({ path: "src/.env" });


import jwt, { SignOptions } from "jsonwebtoken";

export function generateAccessToken(payload:{userId: string, role: string,email?:string}): string {
  

  const secret = process.env.ACCESS_TOKEN_SECRET as string;

  const options: SignOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"] , // "15m" is valid here
  };

  return jwt.sign(payload, secret, options);
}


export function generateRefreshToken(payload:{userId: string, role: string}): string {


  const secret = process.env.REFRESH_TOKEN_SECRET as string;

  const options: jwt.SignOptions = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY_FOR_COOKIE as jwt.SignOptions["expiresIn"], // "7d"
  };

  return jwt.sign(payload, secret, options);
}

