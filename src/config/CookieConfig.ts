import { CookieOptions } from "express";

const REFRESH_COOKIE_EXPIRY =
  (Number(process.env.REFRESH_COOKIE_DAYS) || 7) * 24 * 60 * 60 * 1000;
const ACCESS_COOKIE_EXPIRY =
  (Number(process.env.ACCESS_COOKIE_MINUTES) || 15) * 60 * 1000;

export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: true,
  maxAge: ACCESS_COOKIE_EXPIRY,
  path: "/",
};

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: true,
  maxAge: REFRESH_COOKIE_EXPIRY,
  path: "/",
};
