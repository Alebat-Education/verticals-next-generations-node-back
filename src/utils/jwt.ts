import jwt from 'jsonwebtoken';
import type { JWTPayload } from '@interfaces/http.js';
import { CONFIG } from '@config/index.js';
import { UnauthorizedError } from '@constants/errors/errors.js';
import { ERROR_MESSAGES } from '@constants/errors/error-messages.js';

const JWT_SECRET = CONFIG.JWT_SECRET;
const JWT_EXPIRES_IN = CONFIG.JWT_EXPIRES_IN;

if (!JWT_SECRET) {
  throw new Error(ERROR_MESSAGES.JWT_SECRET_UNDEFINED);
}

/**
 * Generates a JWT token.
 * @param payload - The payload to include in the token.
 * @return The generated JWT token.
 */
export const generateToken = (payload: JWTPayload): string => {
  const expireTime = parseInt(JWT_EXPIRES_IN || '3600', 10);
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: expireTime,
  });
};

/**
 * Verifies and decodes a JWT token.
 * @param token - The JWT token to verify.
 * @return The decoded payload if the token is valid.
 * @throws UnauthorizedError if the token is invalid or has expired.
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_EXPIRED);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_MALFORMED);
    }
    throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_INVALID);
  }
};
