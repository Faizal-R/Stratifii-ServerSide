// File: auth.ts

import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { createResponse } from "../helper/responseHandler";
import { HttpStatus } from "../config/HttpStatusCodes";
import { VALIDATION_MESSAGES } from "../constants/messages/ValidationMessages";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helper/generateTokens";
import crypto from "crypto";
import {
  deleteRefreshToken,
  storeRefreshToken,
  verifyRefreshToken,
} from "../helper/handleRefreshToken";
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../config/CookieConfig";

// ---------- Token Payload Interfaces ----------
export interface AccessTokenPayload {
  userId: string;
  role: "admin" | "candidate" | "interviewer" | "company";
  exp?: number;
}

export interface RefreshTokenPayload {
  sessionId: string;
  userId: string;
  role: "admin" | "candidate" | "interviewer" | "company";
  exp?: number;
}

// ---------- Middleware: Verify Access Token ----------
export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const accessToken = req.cookies["accessToken"];
    const refreshToken = req.cookies["refreshToken"];

    // If no access token, try to refresh
    if (!accessToken) {
      return await handleRefresh(req, res, next, refreshToken);
    }

    // Try to verify access token
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as AccessTokenPayload;

    req.user = decoded;
    return next();
    
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      // Access token expired → try refresh
      const refreshToken = req.cookies["refreshToken"];
      return await handleRefresh(req, res, next, refreshToken);
    }

    console.error("JWT verification error:", err);
    return createResponse(
      res,
      HttpStatus.UNAUTHORIZED,
      false,
      "Invalid access token. Please log in again."
    );
  }
}

// ---------- Simple Refresh Handler ----------
async function handleRefresh(
  req: Request,
  res: Response,
  next: NextFunction,
  refreshToken?: string
) {
  if (!refreshToken) {
    return createResponse(
      res,
      HttpStatus.UNAUTHORIZED,
      false,
      "No refresh token found. Please log in again."
    );
  }

  try {
    // Verify refresh token JWT structure and expiry
    const decodedRefresh = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as RefreshTokenPayload;

    // Verify refresh token exists in Redis
    const isValidRefreshToken = await verifyRefreshToken(
      decodedRefresh.sessionId,
      refreshToken
    );

    if (!isValidRefreshToken) {
      console.log("Invalid or expired refresh token for session:", decodedRefresh.sessionId);
      return createResponse(
        res,
        HttpStatus.UNAUTHORIZED,
        false,
        "Invalid refresh token. Please log in again."
      );
    }

    // ✅ SIMPLE APPROACH: Generate ONLY new access token
    // Keep the same refresh token and session ID
    const newAccessToken = await generateAccessToken({
      userId: decodedRefresh.userId,
      role: decodedRefresh.role,
    });

    // Set only the new access token cookie
    res.cookie("accessToken", newAccessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

    console.log(`Access token refreshed for user: ${decodedRefresh.userId}`);
    req.user = { 
      userId: decodedRefresh.userId, 
      role: decodedRefresh.role 
    };
    
    return next();
    
  } catch (err) {
    console.error("Refresh token error:", err);
    
    return createResponse(
      res,
      HttpStatus.UNAUTHORIZED,
      false,
      "Refresh token expired. Please log in again."
    );
  }
}

// ---------- Middleware: Role-Based Authorization ----------
export function checkRole(requiredRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return createResponse(
        res,
        HttpStatus.UNAUTHORIZED,
        false,
        "User not authenticated."
      );
    }

    if (requiredRoles.includes(userRole)) {
      next();
    } else {
      createResponse(
        res,
        HttpStatus.FORBIDDEN,
        false,
        `Forbidden: Your role (${userRole}) does not have permission to access this resource.`
      );
    }
  };
}