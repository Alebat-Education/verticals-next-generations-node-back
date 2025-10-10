/**
 * HTTP Status Codes constants
 * Contains all standard HTTP status codes used across the application
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const SUCCESS_RESOURCE_CREATED = (resource: string) => `${resource} created successfully`;
export const SUCCESS_RESOURCE_UPDATED = (resource: string) => `${resource} updated successfully`;
export const SUCCESS_RESOURCE_DELETED = (resource: string) => `${resource} deleted successfully`;
export const SUCCESS_RESOURCES_RETRIEVED = (resource: string) => `${resource} retrieved successfully`;
