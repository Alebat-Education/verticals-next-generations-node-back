import 'dotenv/config';
import app from './app';
import { CONFIG } from './config';

async function main() {
  try {
    app.listen(CONFIG.PORT, () => {
      // eslint-disable-next-line no-console
      console.log('HELLO WORLD! Server is running on port: ' + CONFIG.PORT);
    });
  } catch (error) {
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error('Error during initialization:', error.message);
    }
    process.exit(1);
  }
}

main();
