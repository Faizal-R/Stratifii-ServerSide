import { CookieOptions } from "express";

// Access Token Cookie (short-lived, used in all requests)
export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge: 15 * 60 * 1000,
  path: "/"
};

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/" 
};