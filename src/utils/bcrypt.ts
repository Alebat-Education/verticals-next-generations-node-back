import bcrypt from 'bcrypt';
import { AUTH_CONFIG } from '@constants/auth/auth.js';

/**
 * Hashes a password using bcrypt.
 * @param password - The plain text password to hash.
 * @return The hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, AUTH_CONFIG.BCRYPT_SALT_ROUNDS);
};

/**
 * Compares the plain text password with its hash.
 * @param password - The plain text password.
 * @param hash - The stored password hash.
 * @return True if they match, false otherwise.
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
