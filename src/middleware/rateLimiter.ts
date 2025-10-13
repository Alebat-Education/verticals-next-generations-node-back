import rateLimit from 'express-rate-limit';
import { CONFIG } from '@config/index.js';
import { HTTP_STATUS } from '@constants/common/http.js';
import { ERROR_MESSAGES } from '@constants/errors/error-messages.js';

export const authRateLimiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT_WINDOW_MS,
  limit: CONFIG.RATE_LIMIT_MAX_AUTH_REQUESTS,
  message: {
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    error: ERROR_MESSAGES.TOO_MANY_REQUESTS,
    retryAfter: ERROR_MESSAGES.RETRY_AFTER,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

export const apiRateLimiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT_WINDOW_MS,
  limit: CONFIG.RATE_LIMIT_MAX_API_REQUESTS,
  message: {
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    error: ERROR_MESSAGES.TOO_MANY_REQUESTS,
    retryAfter: ERROR_MESSAGES.RETRY_AFTER,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
