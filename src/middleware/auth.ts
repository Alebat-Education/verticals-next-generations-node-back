import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '@interfaces/http.js';
import { UnauthorizedError } from '@constants/errors/errors.js';
import { AUTH_MESSAGES, AUTH_CONFIG } from '@constants/auth/auth.js';
import { verifyToken } from '@utils/jwt.js';

/**
 * Middleware de autenticación JWT.
 * Verifica que el request tenga un token válido en el header Authorization.
 * Si es válido, agrega la informacion del usuario al request.
 * @throws UnauthorizedError si el token no es válido o no está presente.
 */

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError(AUTH_MESSAGES.TOKEN_REQUIRED);
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== AUTH_CONFIG.TOKEN_PREFIX) {
      throw new UnauthorizedError(AUTH_MESSAGES.TOKEN_INVALID);
    }

    const token = parts[1];
    if (!token) {
      throw new UnauthorizedError(AUTH_MESSAGES.TOKEN_INVALID);
    }
    const decoded = verifyToken(token);
    (req as unknown as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
