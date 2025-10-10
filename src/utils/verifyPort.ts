import { createServer } from 'net';
import { ERROR, ERROR_INVALID_PORT, ERROR_PORT_IN_USE } from '@constants/errors/server.js';
import {
  CODE_ADDRESS_IN_USE,
  CODE_SERVER_TERMINATED,
  SERVER_CONFIG,
  SERVER_MESSAGES,
} from '@constants/common/server.js';

export async function verifyPortAvailable(port: number): Promise<void> {
  if (!Number.isInteger(port) || port <= 0) return terminateAll(ERROR_INVALID_PORT);

  const server = createServer();

  await new Promise<void>(resolve => {
    server.once(ERROR, (err: NodeJS.ErrnoException | null) => {
      if (err?.code === CODE_ADDRESS_IN_USE) return terminateAll(ERROR_PORT_IN_USE(port));
    });

    server.once(SERVER_MESSAGES.LISTENING, () => server.close(() => resolve()));
    server.listen(port, SERVER_CONFIG.HOST);
  });
}

const terminateAll = (message: string): never => {
  process.stderr.write(`${message}\n`);
  const ppid = process.ppid;
  if (ppid && ppid !== process.pid) {
    try {
      process.kill(ppid, CODE_SERVER_TERMINATED);
    } catch {}
  }
  process.exit(1);
};
