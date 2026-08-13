# Dev Container Demo - T2T Session 1

A deliberately small web application used to demonstrate **reproducible development
environments**. It is not a lesson in React, Express or MongoDB.

What it proves: a browser page calls a REST API, which reads a database, and none of
those three things were installed on your laptop.

---

## What you need

Only two things:

- **Docker** - Docker Desktop, OrbStack, or Docker Engine on Linux
- **VS Code** with the **Dev Containers** extension

No Node.js. No MongoDB. No version managers.

---

## Running it

1. Open this folder in VS Code.
2. When prompted, choose **Reopen in Container**.
   (Or run **Dev Containers: Reopen in Container** from the Command Palette.)
3. Wait for the first build. Subsequent starts take seconds.
4. In the container terminal:

```bash
npm --prefix src/server run seed   # load sample data
npm --prefix src/server run dev    # API   -> http://localhost:4000
npm --prefix src/client run dev    # Web   -> http://localhost:5173
```

Open <http://localhost:5173>.

Check the API directly if the page looks empty:

```bash
curl http://localhost:4000/api/health
curl http://localhost:4000/api/items
```

Run the tests:

```bash
npm --prefix src/server test
```

---

## Debugging

You do not need Node.js on your laptop to debug. The editor's server half runs *inside*
the container, so the debugger starts and attaches in there too.

**Option 1 — launch under the debugger.** Set a breakpoint in
`src/server/src/routes/items.js`, then press **F5** and pick **Debug API**.

**Option 2 — attach to a server you already started.**

```bash
npm --prefix src/server run dev:debug   # starts with the inspector enabled
```

Then pick **Attach to running API** in the Run and Debug panel.

Either way, add an item at <http://localhost:5173> and execution stops on your breakpoint.
The inspector port never leaves the container, so it needs no port forwarding.

---

## How it is wired

```
Your laptop
└── Docker
    ├── app container    Node 22, editor attaches here, runs web + API
    └── mongo container  MongoDB 7, reachable at the hostname `mongo`
```

Both containers share a network. The API reaches the database at `mongodb://mongo:27017`
because `mongo` is the Docker Compose service name. Your laptop reaches the app through
forwarded ports.

---

## Layout

```
.
├── .devcontainer/           Environment definition
│   ├── devcontainer.json      What the editor opens
│   ├── docker-compose.yml     Which containers exist
│   └── post-create.sh         One-time setup after the container is built
├── .vscode/
│   └── launch.json          Shared debug configuration
├── .github/                 Automation (Session 4)
├── docs/                    Documentation (Session 3)
├── src/
│   ├── client/              React front end
│   └── server/              Express REST API
├── tests/                   Test suite
├── .env.example             Committed configuration template - no secrets
├── .gitattributes           Line-ending normalization
├── .gitignore
├── .pre-commit-config.yaml  Hook rules - shared, installed per clone
├── CONTRIBUTING.md          How a change travels through the repository
├── LICENSE
└── README.md
```

---

## Configuration

`.env.example` is committed and contains placeholder values only.
`.env` is git-ignored and holds your real local values.

The Dev Container copies the template on first creation, which is why the app runs
immediately after cloning. Read `.env.example` to see every value the application expects.

---

## Automation

Two gates are committed to this repository:

- `.pre-commit-config.yaml` defines the local hook checks. Run `pre-commit install` in
  each clone so commits are checked before they reach history.
- `.github/workflows/ci.yml` defines the shared pipeline. Pull requests run the test and
  docs jobs, and you can rehearse them locally with `act --pull=false pull_request` after
  pre-pulling `catthehacker/ubuntu:act-latest`.

`pre-commit` runs inside the dev container. `act` runs on the host shell that can reach
Docker, which is usually your WSL shell on Windows.

Step-by-step instructions are in [Run the gates locally](docs/how-to/run-the-gates.md).
How a change travels through review is in [CONTRIBUTING.md](CONTRIBUTING.md).

---

## API

| Method | Path               | What is does             |
| :----- | :-------------     | :----------------------- |
| GET    | `/api/health`      | Liveness check           |
| GET    | `/api/items`       | List the 50 newest items |
| POST   | `/api/items`       | Create an item           |
| DELETE | `/api/items/:id`   | Delete an item           |


```bash
curl -X POST http://localhost:4000/api/items \
  -H 'Content-Type: application/json' \
  -d '{"name":"my first item"}'

curl -i -X DELETE http://localhost:4000/api/items/<id>   
```


