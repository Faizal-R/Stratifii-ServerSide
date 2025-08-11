
import { CookieOptions } from 'express';
export const COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true, // Prevent client-side access
   sameSite: 'none',
secure: true,

    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
};  