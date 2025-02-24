// utils/hash.ts
import bcrypt from "bcryptjs";

/**
 * Hashes a password using bcrypt.
 *
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compares a password with a stored hash.
 *
 * @param {string} password - The plain text password.
 * @param {string} hash - The hashed password from DB.
 * @returns {Promise<boolean>} True if the password matches, false otherwise.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
