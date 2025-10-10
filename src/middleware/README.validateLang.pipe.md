```typescript
import { Request, Response, NextFunction } from 'express';

export function validateLangPipe(req: Request, res: Response, next: NextFunction) {
  const lang = req.headers['accept-language'];
  if (!lang || !['es', 'en', 'fr'].includes(lang)) {
    return res.status(400).json({ message: 'language not supported' });
  }
  next();
}
```
