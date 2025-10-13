import rateLimit from 'express-rate-limit';
import { CONFIG } from '@config/index.js';
import { HTTP_STATUS } from '@constants/common/http.js';

export const authRateLimiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT_WINDOW_MS,
  limit: CONFIG.RATE_LIMIT_MAX_REQUESTS,
  message: {
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

export const apiRateLimiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT_WINDOW_MS,
  limit: 100,
  message: {
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    error: 'Too many requests, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
