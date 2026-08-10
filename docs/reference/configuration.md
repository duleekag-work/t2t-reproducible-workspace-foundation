# Configuration

Every value the application reads from the environment is listed here.

`.env.example` is committed and contains placeholder values only. `.env` is git-ignored
and holds your real local values. The Dev Container copies the template on first creation.

All settings are read in exactly one place per component — `src/server/src/config.js` for
the API — and every one has a default, so the application starts with no `.env` at all.

## Server

| Key | Default | Purpose |
| :--- | :--- | :--- |
| `PORT` | `4000` | Port the API listens on. |
| `MONGO_URL` | `mongodb://mongo:27017` | Database connection string. `mongo` is the Docker Compose service name; outside the container this would be `localhost`. |
| `MONGO_DB` | `t2t_demo` | Database name. |
| `LOG_LEVEL` | `info` | Lowest level written to the log. One of `debug`, `info`, `warn`, `error`. |

## Client

| Key | Default | Purpose |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:4000` | Where browser code sends API requests. |

!!! warning "The `VITE_` prefix is public"
    Vite exposes any variable prefixed with `VITE_` to browser code, which means it ships
    to every visitor. Never put a secret behind that prefix.

## Changing a value

Edit `.env` and restart the process. The file is read once at startup.

```bash
# .env
LOG_LEVEL=debug
```

```bash
npm --prefix src/server run dev
```

For a single run, override without editing the file:

```bash
LOG_LEVEL=debug npm --prefix src/server run dev
```

Either way, `git status` stays clean — behaviour changed, tracked files did not.

## Log levels

| Level | Use for |
| :--- | :--- |
| `debug` | Detail useful only while diagnosing a problem. |
| `info` | Normal, noteworthy events — startup, a resource created. |
| `warn` | Wrong but survivable; someone should look eventually. |
| `error` | The operation failed and a human may need to act. |

Setting `LOG_LEVEL=debug` includes every level. Setting `LOG_LEVEL=error` includes only
errors. An unrecognised value falls back to `info`.
