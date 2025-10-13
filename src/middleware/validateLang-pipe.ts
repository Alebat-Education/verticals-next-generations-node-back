import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@constants/errors/errors.js';
import { VALIDATION_LANGUAGE, SUPPORTED_LANGUAGES } from '@constants/errors/error-messages.js';

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_ERROR_MESSAGE = VALIDATION_LANGUAGE.NOT_SUPPORTED;

export function validateLangPipe(req: Request, _res: Response, next: NextFunction): void {
  const lang = req.headers['accept-language'];

  if (!lang || !SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
    throw new ValidationError(LANGUAGE_ERROR_MESSAGE);
  }

  next();
}
