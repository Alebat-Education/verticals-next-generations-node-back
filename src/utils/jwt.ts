import jwt from 'jsonwebtoken';
import type { JWTPayload } from '@interfaces/http.js';
import { CONFIG } from '@config/index.js';
import { UnauthorizedError } from '@constants/errors/errors.js';
import { ERROR_MESSAGES } from '@constants/errors/error-messages.js';

const JWT_SECRET = CONFIG.JWT_SECRET;
const JWT_EXPIRES_IN = CONFIG.JWT_EXPIRES_IN;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

/**
 * Genera un token JWT con el payload proporcionado.
 * @param payload - El payload a incluir en el token.
 * @return El token JWT generado.
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: Number(JWT_EXPIRES_IN),
  });
};

/**
 * Verifica y deodifica un token JWT.
 * @param token - El token JWT a verificar.
 * @return El payload decodificado si el token es válido.
 * @throws UnauthorizedError si el token es inválido o ha expirado.
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
