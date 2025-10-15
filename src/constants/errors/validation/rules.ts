export const VALIDATION_TYPES = {
  BODY: 'body',
  QUERY: 'query',
  PARAMS: 'params',
} as const;

export const VALIDATION_OPTIONS = {
  DEFAULT: {
    WHITELIST: true,
    FORBID_NON_WHITELISTED: true,
    SKIP_MISSING_PROPERTIES: false,
    EXCLUDE_EXTRANEOUS_VALUES: false,
  },
  VALIDATION_ERROR: {
    TARGET: false,
    VALUE: false,
  },
} as const;
