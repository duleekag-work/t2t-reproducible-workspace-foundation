import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';

// One .env at the repository root serves every component.
config({ path: fileURLToPath(new URL('../../../.env', import.meta.url)) });

export const settings = {
  port: Number(process.env.PORT ?? 4000),
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://mongo:27017',
  mongoDb: process.env.MONGO_DB ?? 't2t_demo',

  logLevel: (process.env.LOG_LEVEL ?? 'info').toLowerCase(),
};
