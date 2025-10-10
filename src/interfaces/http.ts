/**
 * HTTP Response interfaces
 * Contains all interface types used for HTTP responses
 */

export interface ApiSuccessResponse<T = any> {
  message: string;
  data: T;
}
