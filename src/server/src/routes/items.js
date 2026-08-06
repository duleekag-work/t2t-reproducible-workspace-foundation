import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { items } from '../db.js';
import { normalizeName, parseItemId } from '../validate.js';

export const itemsRouter = Router();

itemsRouter.get('/', async (_req, res, next) => {
  try {
    const found = await items().find().sort({ createdAt: -1 }).limit(50).toArray();
    res.json(
      found.map(({ _id, name, createdAt }) => ({
        id: _id.toString(),
        name,
        createdAt,
      })),
    );
  } catch (error) {
    next(error);
  }
});

itemsRouter.post('/', async (req, res, next) => {
  try {
    const name = normalizeName(req.body?.name);
    if (name === null) {
      return res.status(400).json({ error: 'A non-empty name of up to 80 characters is required.' });
    }

    const document = { name, createdAt: new Date() };
    const { insertedId } = await items().insertOne(document);
    res.status(201).json({ id: insertedId.toString(), ...document });
  } catch (error) {
    next(error);
  }
});

itemsRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = parseItemId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: 'A valid item id is required.' });
    }

    const { deletedCount } = await items().deleteOne({ _id: new ObjectId(id) });
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
