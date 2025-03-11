// File: auth.ts

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createResponse } from "../helper/responseHandler";
import { HttpStatus } from "../config/HttpStatusCodes";

// Define an interface for the decoded token payload
export interface TokenPayload {
  userId: string;
  role: "admin" | "candidate" | "interviewer" | "company"; // Add other roles as needed
  exp?: number;
}

// Middleware to verify the token
export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log(req.headers.Authorization)
  const token = req.headers["authorization"]?.split(" ")[1];
 console.log(token)
  if (!token) {
    return createResponse(
      res,
      HttpStatus.UNAUTHORIZED,
      false,
      "Access denied. No token provided."
    );
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as TokenPayload;
     
     if(!decoded){
       return createResponse(
      res,
      HttpStatus.UNAUTHORIZED,
      false,
      "Invalid or expired token."
    );
     }

    req.user =decoded;
    console.log("Request type:", req.user);

    next();
  } catch (err) {
    return createResponse(
      res,
      HttpStatus.UNAUTHORIZED,
      false,
      "Invalid or expired token."
    );
  }
}

// Middleware to check if the user has the required role
export function checkRole(requiredRole: string) {
  return (req: any, res: any, next: () => void): void => {
    const userRole = req.user?.role;
    if (userRole === requiredRole) {
      next();
    } else {
      createResponse(
        res,
        HttpStatus.FORBIDDEN,
        false,
        `Forbidden: ${requiredRole} access required.`
      );
    }
  };
}
