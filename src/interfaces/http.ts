/**
 * HTTP Response interfaces
 * Contains all interface types used for HTTP responses
 */

export interface ApiSuccessResponse<T = any> {
  message: string;
  data: T;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role?: string;
    iat?: number;
    exp?: number;
  };
}

export interface JWTPayload {
  id: number;
  email: string;
  role?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    role?: string;
  };
}
