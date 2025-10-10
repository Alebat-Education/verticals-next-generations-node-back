import express, { type Express, type Request, type Response } from 'express';
import { SERVER_CONFIG, SERVER_MESSAGES } from '@constants/common/server.js';
import cors from 'cors';
import { httpLogger } from '@config/logger.js';
import morgan from 'morgan';

const app: Express = express();
app.use(httpLogger);
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get(SERVER_CONFIG.HOME, (_req: Request, res: Response) => {
  res.send(SERVER_MESSAGES.READY);
});

export default app;
