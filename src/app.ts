import express, { type Express, type Request, type Response } from 'express';
import { SERVER_CONFIG, SERVER_MESSAGES } from '@constants/common/server.js';
import cors from 'cors';
import { httpLogger } from '@config/logger.js';
import morgan from 'morgan';
import { apiRateLimiter } from '@middleware/rateLimiter.js';
import { generateToken, verifyToken } from '@utils/jwt.js';

const app: Express = express();
app.use(httpLogger);
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(apiRateLimiter);
app.post('/jwttest', (_req: Request, res: Response) => {
  const payload = {
    id: 1,
    email: 'user@example.com',
    role: 'user',
  };

  const token = generateToken(payload);
  res.json({
    token,
    payload,
    message: 'Token generado correctamente',
  });
});

app.post('/jwttest-verify', (req: Request, res: Response) => {
  const { token } = req.body;

  const decoded = verifyToken(token);
  res.json({
    decoded,
    message: 'Token verificado correctamente',
  });
});

app.get(SERVER_CONFIG.HOME, (_req: Request, res: Response) => {
  res.send(SERVER_MESSAGES.READY);
});

export default app;
