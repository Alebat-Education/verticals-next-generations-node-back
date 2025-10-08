import { verifyPortAvailable } from '@utils/verifyPort.js';
import app from '@/app.js';
import { CONFIG } from '@config/index.js';
import { SERVER_MESSAGES } from '@constants/common/server.js';
import { ERROR, ERROR_SERVER } from '@errors/server.js';
import { initDB } from '@config/connection.js';
import { setupRoutes } from '@utils/setupRoutes.js';

async function main(): Promise<void> {
  const port: number = Number(CONFIG.PORT);
  await verifyPortAvailable(port);
  await initDB();
  await setupRoutes(app);
  const server = app.listen(port);

  server.once(SERVER_MESSAGES.LISTENING, () => {
    process.stdout.write(SERVER_MESSAGES.STARTING(port));
  });

  server.once(ERROR, (err: string) => {
    process.stderr.write(ERROR_SERVER(err));
    process.exit(1);
  });
}

void main();
