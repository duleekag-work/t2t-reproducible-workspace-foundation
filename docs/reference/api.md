# API

Base URL: `http://localhost:4000`

All responses are JSON. Errors have the shape `{ "error": "<message>" }`.

## Endpoints

| Method | Path | Success | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | `200` | Liveness check |
| `GET` | `/api/items` | `200` | List the 50 newest items |
| `POST` | `/api/items` | `201` | Create an item |
| `DELETE` | `/api/items/:id` | `204` | Remove an item |

## `GET /api/items`

Returns an array, newest first, limited to 50.

```json
[{ "id": "507f1f77bcf86cd799439011", "name": "example", "createdAt": "2026-08-04T09:00:00.000Z" }]
```

## `POST /api/items`

Body: `{ "name": string }`

| Status | Condition |
| :--- | :--- |
| `201` | Created. Returns the new item including its `id`. |
| `400` | `name` is missing, empty, not a string, or longer than 80 characters. |

Names are trimmed of surrounding whitespace before storage.

## `DELETE /api/items/:id`

| Status | Condition |
| :--- | :--- |
| `204` | Deleted. No body. |
| `400` | `id` is not a 24-character hexadecimal string. The database is not queried. |
| `404` | `id` is well-formed but matches no item. |

## Errors

`500` responses carry the generic message `Internal server error`. The cause is written
to the server log at `error` level — see [Configuration](configuration.md) for how to
raise log verbosity.
