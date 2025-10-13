export interface ValidationPipeOptions {
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
  skipMissingProperties?: boolean;
  enableImplicitConversion?: boolean;
  groups?: string[];
}
