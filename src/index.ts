import app from './app.js';
import { verifyPortAvailable } from '#utils/verifyPort.js';
import { CONFIG } from '#config/index.js';
import { SERVER_MESSAGES } from '#constants/server.js';
import { ERROR, ERROR_SERVER } from '#constants/errors/server.js';

async function main(): Promise<void> {
  const port: number = Number(CONFIG.PORT);
  await verifyPortAvailable(port);
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
