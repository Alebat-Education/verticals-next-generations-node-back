export const VALIDATION_RULES = {
  STRING_LENGTH: {
    DOCUMENT_ID: { MIN: 1, MAX: 255 },
    TITLE: { MIN: 1, MAX: 255 },
    SLUG: { MIN: 1, MAX: 255 },
    SKU: { MIN: 1, MAX: 100 },
    STRIPE_ID: { MIN: 1, MAX: 255 },
    NAME: { MIN: 2, MAX: 100 },
    EMAIL: { MIN: 5, MAX: 255 },
  },
  NUMERIC: {
    ORDER_MIN: 0,
    TRIAL_PERIOD_DAYS_MIN: 0,
    ID_MIN: 1,
    PAGE_MIN: 1,
    LIMIT_MIN: 1,
    LIMIT_MAX: 100,
  },
  ARRAY: {
    VERTICAL_MIN_SIZE: 1,
  },
  SORT_ORDER: ['ASC', 'DESC'] as const,
} as const;
