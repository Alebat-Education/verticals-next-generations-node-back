export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'User logged in successfully',
  LOGOUT_SUCCESS: 'User logged out successfully',
  TOKEN_REQUIRED: 'Authentication token required',
  TOKEN_INVALID: 'Invalid or expired token',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_ALREADY_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
} as const;

export const AUTH_CONFIG = {
  BCRYPT_SALT_ROUNDS: 10,
  TOKEN_PREFIX: 'Bearer',
  MIN_PASSWORD_LENGTH: 8,
} as const;
