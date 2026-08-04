import express from 'express';
import cors from 'cors';
import { settings } from './config.js';
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
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

await connect();

app.listen(settings.port, () => {
  console.log(`API listening on http://localhost:${settings.port}`);
  console.log(`Connected to ${settings.mongoUrl}/${settings.mongoDb}`);
});
