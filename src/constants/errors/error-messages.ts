export const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  NOT_FOUND: 'Nothing found',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  CONFLICT: 'Conflict',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service unavailable',
} as const;

export const VALIDATION_LANGUAGE = {
  NOT_SUPPORTED: 'Language not supported. Supported languages are: es, en, fr',
};

export const SUPPORTED_LANGUAGES = ['es', 'en', 'fr'] as const;
