# 1. Use Dev Containers for the development environment

- **Status:** Accepted
- **Date:** 2026-08-04

## Context

Running this project by hand requires Node 22 and MongoDB 7 on every machine that touches
it. In practice four things drifted between laptops: the runtime version, whether the
database was installed at all, operating system behaviour such as line endings and path
separators, and configuration that only ever existed in one person's shell history.

The result was that "works on my machine" appeared as a recurring class of defect rather
than an occasional accident. The failure is asymmetric — whoever set the project up
successfully never encounters it again, so it is never fixed, and every new joiner pays
the same cost.

## Decision

The development environment is defined in `.devcontainer/` and runs in Docker.

- `devcontainer.json` declares what the editor opens, which ports are forwarded, and which
  extensions travel with the project.
- `docker-compose.yml` declares the containers: an application workspace and a database.
- `post-create.sh` creates `.env` from the committed template and installs dependencies.

The editor attaches inside the container, so the terminal, the debugger and the language
tooling all run there. Nothing is installed on the host except Docker and the editor.

## Consequences

**Positive**

- Clone-to-running is minutes on any host operating system, and it is a property that can
  be tested rather than asserted.
- The environment is reviewed and versioned like source code; a change to it arrives
  through the same pull request process as everything else.
- A broken environment is deleted and recreated rather than repaired.
- Setup documentation cannot silently go stale, because it is an executable script.

**Negative**

- Docker is now a hard prerequisite. Anyone who cannot run it cannot work on the project.
- File I/O is slower on macOS and Windows unless the repository lives inside the WSL2
  filesystem.
- The first container build is slow and requires network access to pull images.
- Contributors must learn enough container vocabulary to debug the environment when it
  misbehaves.

**Neutral**

- The editor integration is VS Code specific. The environment definition is not, and the
  containers run regardless of which editor is attached.
