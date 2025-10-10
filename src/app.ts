import express, { type Express, type Request, type Response } from 'express';
import { SERVER_CONFIG, SERVER_MESSAGES } from '@constants/common/server.js';
import cors from 'cors';
import { httpLogger } from '@config/logger.js';
import morgan from 'morgan';
import { setupSwagger } from '@docs/swagger.setup.js';

const app: Express = express();
app.use(httpLogger);
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

setupSwagger(app);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check endpoint
 *     description: Verifies that the server is running correctly
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server running correctly
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: 🚀 Server ready
 */
app.get(SERVER_CONFIG.HOME, (_req: Request, res: Response) => {
  res.send(SERVER_MESSAGES.READY);
});

export default app;
