import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@utils/errors.js';

const SUPPORTED_LANGUAGES = ['es', 'en', 'fr'] as const;

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_ERROR_MESSAGE = 'Language not supported. Supported languages are: es, en, fr';

export function validateLangPipe(req: Request, _res: Response, next: NextFunction): void {
  const lang = req.headers['accept-language'];

  if (!lang || !SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
    throw new ValidationError(LANGUAGE_ERROR_MESSAGE);
  }

  next();
}
