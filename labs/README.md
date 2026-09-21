# Labs

A lab is a small stack you are given **working but wrong**. You edit the compose
file and the configuration; the checks bring it up, put it under load, break it
on purpose, and say what held.

```bash
npm run lab                        # what this machine can bring up
npm run lab -- scale-out           # run the checks
npm run lab -- scale-out --keep    # leave the stack up so you can poke at it
```

The stack is torn down afterwards, volumes included, even when a check throws.

## What a lab is made of

```
labs/<slug>/
  lab.json                  title, course, lesson, needs, the port to talk to
  stack/                    what you edit: compose file, config, Dockerfiles
  checks/01-<slug>/
    description.md          what this check asks for, and what to read up on
    check.mjs               how it is judged
```

`needs` is checked against the machine before anything starts:

```json
{ "needs": { "memoryMb": 400, "containers": 4, "docker": true } }
```

A laptop with no room says so and refuses, with the arithmetic. The task, the
stack and the checks still open — you can write the answer there and run it on
a machine that has the memory.

## Writing a check

```js
export default {
  title: 'Killing a replica loses nothing',

  async run({ compose, load, waitFor, port, log }) {
    const result = await load({ path: '/', seconds: 6, during: () => compose.kill('app2') });
    if (result.failed > 0) throw new Error(`${result.failed} of ${result.sent} requests failed`);
  },
};
```

`compose` has `up`, `kill`, `stop`, `start`, `restart`, `recreate`, `ps`, `logs`
and `down`. `load` returns `{ sent, ok, failed, byStatus, byServer, examples }`
and takes a `during` callback for the disruption.

## Rules learned by getting them wrong

Every one of these came from a check that passed against a stack that was
plainly broken.

- **Judge invariants, not milliseconds.** "No request was lost" is true on a
  laptop and on a workstation. "p99 under 200 ms" is not, and a lab that passes
  on one machine and fails on another teaches nothing.
- **Disrupt whoever is actually serving.** Killing a replica that the balancer
  never uses proves nothing — the first version of check 2 killed `app2` while
  every request went to `app1`, and passed. Use `busiest()` from
  `tests/runner/labs/services.mjs`.
- **Replace, do not restart, when testing persistence.** `docker compose
  restart` keeps the container and everything written inside it, so a store
  with no volume survives it. `recreate` is what throws the writable layer away.
- **Keep loading after the disruption ends.** `docker compose restart` on a
  container whose process ignores `SIGTERM` takes the full ten second grace
  period. A load window that closed first reported a flawless run. `load` now
  extends its deadline past `during`.
- **Wait for the thing you are asking about.** After replacing the store, the
  app answers `/health` long before the store accepts connections; reading one
  instant too early looks exactly like data loss.
- **Build images, do not bind-mount.** Docker Desktop on the Hyper-V backend
  keeps an allow-list of shared host directories, and the first mount of a new
  one hangs while waiting for a permission prompt that never arrives. A build
  context goes over the API and works everywhere.

## Proving a lab before committing it

The same rule as the test cases and the challenges: a lab has to fail on the
starter **and** pass on a correct answer. Write the fix somewhere outside the
repository, apply it, run the checks, then restore the starter and run them
again — the answer is never committed.

For `scale-out` that was four checks red on the starter, four green with the
fix, four red again after restoring it.
