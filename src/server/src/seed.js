import { connect, disconnect, items } from './db.js';
import { settings } from './config.js';

const SAMPLE = ['Reproducible environment', 'Committed configuration template', 'Readable repository layout'];

await connect();
await items().deleteMany({});
await items().insertMany(SAMPLE.map((name) => ({ name, createdAt: new Date() })));

console.log(`Seeded ${SAMPLE.length} items into ${settings.mongoDb}.`);
await disconnect();
