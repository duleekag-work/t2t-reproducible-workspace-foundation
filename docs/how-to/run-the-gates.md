# Run the gates locally

Two checks guard this repository: a hook that runs before a commit is written, and a
pipeline that runs when a change is proposed. Both run on your machine.

## 1. Install the hook

`.pre-commit-config.yaml` is committed, but the hook itself is installed per clone. Run
this once, inside the dev container:

```bash
pre-commit install
```

Anyone who skips this step has no hook at all.

## 2. Check the whole repository

The hook only sees staged files. To check everything:

```bash
pre-commit run --all-files
```

A secret found here is refused before it can enter history. Deleting it afterwards does
not remove it — the only real remedy is to rotate the credential.

## 3. Pre-pull the runner image

`act` runs the pipeline in Docker. Fetch the image once so later runs need no network:

```bash
docker pull catthehacker/ubuntu:act-latest
```

Pin the image so `act` never stops to ask which one to use:

```bash
mkdir -p ~/.config/act
echo '-P ubuntu-latest=catthehacker/ubuntu:act-latest' > ~/.config/act/actrc
```

## 4. Run the pipeline offline

Run these on the **host**, not inside the dev container — `act` needs a Docker socket.
On Windows the host means your WSL shell.

```bash
act --pull=false -l              # list the jobs and their triggers
act --pull=false pull_request    # run what a pull request would run
```

`--pull=false` keeps the run offline. If the image is not already local, the run fails
instead of downloading it.

## 5. Reproduce a failure

A red pipeline is a command that failed, and you can run that command yourself:

```bash
npm --prefix src/server ci
npm --prefix src/server test
mkdocs build --strict
```

!!! note "The hook is advisory; the pipeline is not"
    `git commit --no-verify` skips the hook, so it catches honest mistakes rather than
    enforcing policy. The pipeline runs on a clean checkout with none of your local
    state, which is what makes its result evidence.
