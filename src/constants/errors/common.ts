/**
 * Controller error messages
 * Contains all error messages used by controllers
 */

export const ERROR_RESOURCE_NOT_FOUND = (resource: string, id: string | number) =>
  `${resource} with ID ${id} not found`;

export const ERROR_INVALID_ID = 'Invalid ID provided';
export const ERROR_MISSING_REQUIRED_FIELDS = 'Missing required fields';
export const ERROR_VALIDATION_FAILED = 'Validation failed';
export const ERROR_INTERNAL_SERVER = 'Internal server error';
export const UNKNOWN_ERROR = 'An unknown error occurred';
export const ERROR_NO_STACK_TRACE = 'No stack trace available';
export const ERROR_RESOURCE_ALREADY_EXISTS = (resource: string) => `${resource} already exists`;

export const SUCCESS_RESOURCE_CREATED = (resource: string) => `${resource} created successfully`;

export const SUCCESS_RESOURCE_UPDATED = (resource: string) => `${resource} updated successfully`;

export const SUCCESS_RESOURCE_DELETED = (resource: string) => `${resource} deleted successfully`;

export const SUCCESS_RESOURCES_RETRIEVED = (resource: string) => `${resource} retrieved successfully`;
