# Add an endpoint

Assumes the project is already running. If it is not, start with
[Getting started](../tutorial/getting-started.md).

## 1. Validate the input first

Untrusted input is checked at the boundary, in `src/server/src/validate.js`. Add a
function that returns a usable value or `null` — never a partially trusted one.

```js
export function parseSomething(value) {
  if (typeof value !== 'string') return null;
  // ...
}
```

## 2. Cover it with a test

Add cases to `tests/server/validate.test.js`, including a non-string input such as
`{ $ne: null }`. Run:

```bash
npm --prefix src/server test
```

## 3. Add the route

In `src/server/src/routes/items.js`, register the handler. Reject invalid input before
touching the database, and pass unexpected errors to `next`:

```js
itemsRouter.get('/:id', async (req, res, next) => {
  try {
    const id = parseItemId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: 'A valid item id is required.' });
    }
    // ...
  } catch (error) {
    next(error);
  }
});
```

Import anything new at the top of the file. A missing import surfaces as a `500`, not as
a helpful message.

## 4. Verify it by hand

```bash
curl -i http://localhost:4000/api/items/<id>
```

## 5. Document it

Add the row to [API](../reference/api.md) in the same change. Documentation that lags
behind the code is wrong documentation.
