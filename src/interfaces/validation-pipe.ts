import type { Request } from 'express';

export type ValidationType = 'body' | 'query' | 'params';

export interface ValidationPipeOptions {
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
  skipMissingProperties?: boolean;
  enableImplicitConversion?: boolean;
  groups?: string[];
}

export type ClassType<T extends object> = { new (): T };

export type RequestWithValidation = Request & {
  [K in ValidationType]: unknown;
};
