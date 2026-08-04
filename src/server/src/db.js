import { MongoClient } from 'mongodb';
import { settings } from './config.js';

const MAX_CONNECT_ATTEMPTS = 10;

let client;
let db;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(error) {
  const message = String(error?.message ?? '');
  const causeCode = error?.cause?.code;
  return (
    causeCode === 'EAI_AGAIN' ||
    causeCode === 'ENOTFOUND' ||
    causeCode === 'ECONNREFUSED' ||
    message.includes('Server selection timed out')
  );
}

export async function connect() {
  let lastError;

  for (let attempt = 1; attempt <= MAX_CONNECT_ATTEMPTS; attempt += 1) {
    client = new MongoClient(settings.mongoUrl, { serverSelectionTimeoutMS: 3000 });

    try {
      await client.connect();
      db = client.db(settings.mongoDb);
      return db;
    } catch (error) {
      lastError = error;

      try {
        await client.close();
      } catch {
        // Ignore cleanup errors; the original connection error is more useful.
      }

      if (!isRetryable(error)) {
        throw error;
      }

      if (attempt === MAX_CONNECT_ATTEMPTS) {
        break;
      }

      const delayMs = Math.min(500 * attempt, 4000);
      console.warn(
        `[db] Mongo not ready yet (${attempt}/${MAX_CONNECT_ATTEMPTS}). Retrying in ${delayMs}ms...`,
      );
      await wait(delayMs);
    }
  }

  const hint =
    'MongoDB stayed unreachable. In a Dev Container, ensure the `mongo` service is running and healthy. Try: docker compose -f .devcontainer/docker-compose.yml ps';

  throw new Error(`${hint}\nOriginal error: ${lastError?.message ?? 'unknown error'}`, {
    cause: lastError,
  });
}

export async function disconnect() {
  if (client) {
    await client.close();
  }

  client = undefined;
  db = undefined;
}

export function items() {
  if (!db) {
    throw new Error('Database is not connected. Call connect() first.');
  }
  return db.collection('items');
}
