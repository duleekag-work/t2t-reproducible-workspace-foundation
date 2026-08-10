import express from 'express';
import cors from 'cors';
import { settings } from './config.js';
import { log } from './log.js';
import { connect } from './db.js';
import { itemsRouter } from './routes/items.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/items', itemsRouter);

// Errors are logged server-side; clients receive nothing internal.
app.use((error, req, res, _next) => {
  log.error('request failed', {
    method: req.method,
    path: req.path,
    message: error.message,
  });
  res.status(500).json({ error: 'Internal server error' });
});

await connect();

app.listen(settings.port, () => {
  log.info('api listening', { url: `http://localhost:${settings.port}` });
  log.info('database connected', { url: `${settings.mongoUrl}/${settings.mongoDb}` });
});
