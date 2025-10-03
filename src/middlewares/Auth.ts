// File: auth.ts

import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { createResponse } from "../helper/responseHandler";
import { HttpStatus } from "../config/HttpStatusCodes";

import { generateAccessToken } from "../helper/generateTokens";

import { ACCESS_TOKEN_COOKIE_OPTIONS } from "../config/CookieConfig";

import { Tokens } from "../constants/enums/token";
import { AUTH_MESSAGES } from "../constants/messages/AuthMessages";
import { AccessTokenPayload, RefreshTokenPayload } from "../types/token";
import { isTokenBlacklisted } from "../utils/handleTokenBlacklisting";

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const accessToken = req.cookies[Tokens.ACCESS_TOKEN];
    const refreshToken = req.cookies[Tokens.REFRESH_TOKEN];

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
      const refreshToken = req.cookies[Tokens.REFRESH_TOKEN];
      return await handleRefresh(req, res, next, refreshToken);
    }

    console.error("JWT verification error:", err);
    return createResponse(
      res,
      HttpStatus.UNAUTHORIZED,
      false,
      AUTH_MESSAGES.INVALID_SESSION
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
      AUTH_MESSAGES.LOGIN_REQUIRED
    );
  }

  try {
    // Verify refresh token JWT structure and expiry
    const decodedRefresh = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as RefreshTokenPayload;

    //check this token is blacklisted or not
    const isBlackListed = await isTokenBlacklisted(decodedRefresh.jti);
    if (isBlackListed) {
      return createResponse(
        res,
        HttpStatus.UNAUTHORIZED,
        false,
        AUTH_MESSAGES.SESSION_TERMINATED
      );
    }

    const newAccessToken = await generateAccessToken({
      userId: decodedRefresh.userId,
      role: decodedRefresh.role,
    });

    // Set only the new access token cookie
    res.cookie(
      Tokens.ACCESS_TOKEN,
      newAccessToken,
      ACCESS_TOKEN_COOKIE_OPTIONS
    );

    
    req.user = {
      userId: decodedRefresh.userId,
      role: decodedRefresh.role,
    };

    return next();
  } catch (err) {
    console.error("Refresh token error:", err);

    return createResponse(
      res,
      HttpStatus.UNAUTHORIZED,
      false,
      AUTH_MESSAGES.SESSION_EXPIRED
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
        AUTH_MESSAGES.LOGIN_TO_ACCESS
      );
    }

    if (requiredRoles.includes(userRole)) {
      next();
    } else {
      createResponse(
        res,
        HttpStatus.FORBIDDEN,
        false,
        AUTH_MESSAGES.ACCESS_DENIED
      );
    }
  };
}
