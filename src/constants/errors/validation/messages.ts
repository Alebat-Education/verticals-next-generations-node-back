export const VALIDATION_MESSAGES = {
  FIELD_REQUIRED: (field: string) => `${field} is required`,
  FIELD_MUST_BE_STRING: (field: string) => `${field} must be a string`,
  FIELD_MUST_BE_NUMBER: (field: string) => `${field} must be a number`,
  FIELD_MUST_BE_INTEGER: (field: string) => `${field} must be an integer`,
  FIELD_MUST_BE_BOOLEAN: (field: string) => `${field} must be a boolean`,
  FIELD_MUST_BE_ARRAY: (field: string) => `${field} must be an array`,
  FIELD_MUST_BE_VALID_ENUM: (field: string) => `${field} must be a valid value`,
  FIELD_MUST_BE_VALID_EMAIL: (field: string) => `${field} must be a valid email`,
  FIELD_MUST_BE_VALID_DATE: (field: string) => `${field} must be a valid date`,
  FIELD_LENGTH_BETWEEN: (field: string, min: number, max: number) =>
    `${field} must be between ${min} and ${max} characters`,
  FIELD_MIN_VALUE: (field: string, min: number) => `${field} must be at least ${min}`,
  FIELD_MAX_VALUE: (field: string, max: number) => `${field} must be at most ${max}`,
  ARRAY_MIN_SIZE: (field: string, min: number) => `${field} must contain at least ${min} item(s)`,
  FIELD_MUST_BE_POSITIVE: (field: string) => `${field} must be a positive number`,
} as const;

export const VALIDATION_ERROR_MESSAGES = {
  VALIDATION_FAILED_BODY: 'Validation errors in request body',
  VALIDATION_FAILED_QUERY: 'Validation errors in query parameters',
  VALIDATION_FAILED_PARAMS: 'Validation errors in route parameters',
  INTERNAL_VALIDATION_ERROR: 'Internal validation error',
} as const;
