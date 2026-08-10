import { settings } from './config.js';

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };

// Falls back to plain text until `logLevel` is uncommented in config.js.
const structured = settings.logLevel !== undefined;
const threshold = LEVELS[settings.logLevel] ?? LEVELS.info;

function emit(level, message, context = {}) {
  if (!structured) {
    console.log(message, context);
    return;
  }
  if (LEVELS[level] < threshold) return;
  process.stdout.write(
    JSON.stringify({
      ts: new Date().toISOString(),
      level,
      message: `[${level.toUpperCase()}] ${message}`,
      ...context,
    }) + '\n',
  );
}

export const log = {
  debug: (message, context) => emit('debug', message, context),
  info: (message, context) => emit('info', message, context),
  warn: (message, context) => emit('warn', message, context),
  error: (message, context) => emit('error', message, context),
};
