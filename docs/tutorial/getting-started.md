# Getting started

This walks you from a fresh clone to seeing data on screen. It takes about ten minutes,
most of which is the container building while you wait.

You need **Docker** and **VS Code with the Dev Containers extension**. Nothing else — no
Node, no MongoDB, no version managers.

## 1. Open the project in its container

Open the folder in VS Code. When prompted, choose **Reopen in Container**.

The first build downloads two images and installs dependencies. Later starts take seconds.

When the terminal appears, confirm where you are:

```bash
node --version    # v22.x - inside the container
whoami            # node
```

Your laptop does not have Node installed. This terminal does.

## 2. Load some sample data

```bash
npm --prefix src/server run seed
```

## 3. Start the two services

In one terminal:

```bash
npm --prefix src/server run dev
```

In a second terminal:

```bash
npm --prefix src/client run dev
```

## 4. See it work

Open <http://localhost:5173>. You should see a list of items.

Type a name into the form and submit it. The item appears in the list. Refresh the page —
it is still there, because it was written to a database running in a second container.

## What just happened

You ran a two-service application without installing a runtime or a database. The
environment came from the repository.

## Where next

- To make a change, read [Add an endpoint](../how-to/add-an-endpoint.md).
- To understand how the pieces connect, read [Architecture](../explanation/architecture.md).
