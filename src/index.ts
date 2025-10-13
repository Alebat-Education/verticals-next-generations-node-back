import 'dotenv/config';
import { verifyPortAvailable } from '@utils/verifyPort.js';
import app from '@/app.js';
import { CONFIG } from '@config/index.js';
import { SERVER_MESSAGES } from '@constants/common/server.js';
import { ERROR, ERROR_SERVER } from '@constants/errors/server.js';
import { initDB } from '@config/connection.js';
import { setupRoutes } from '@utils/setupRoutes.js';
import { globalErrorHandler } from '@middleware/errorHandler.js';
import { logger } from '@config/logger.js';

async function main(): Promise<void> {
  const port: number = Number(CONFIG.PORT);
  await verifyPortAvailable(port);
  await initDB();
  await setupRoutes(app);
  app.use(globalErrorHandler);
  const server = app.listen(port);

  server.once(SERVER_MESSAGES.LISTENING, () => {
    logger.info(SERVER_MESSAGES.STARTING(port));
  });

  server.once(ERROR, (err: string) => {
    logger.fatal(ERROR_SERVER(err));
    process.exit(1);
  });
}

void main();
