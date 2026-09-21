# A practice playground — plan

Date: 2026-09-21
Status: stages 1-6 built and verified 2026-09-21; 7-8 not started
Branch: `playground`

## The problem

The workspace teaches one third of what it holds. 1393 problems have a runner, a verdict,
a Big-O probe and a review schedule. The other side — 18 courses, 151 hours, 487 lessons —
is a video player with a note box. You watch someone set up a load balancer and then close
the tab.

What is wanted is the opposite of watching: build the architecture, write the code, run it,
break it, deploy it. And later the same thing CodeCrafters sells — write your own HTTP
server, your own Git, your own Redis, stage by stage.

Two machines have to run it: this desktop (64 GB, 6 cores) and a laptop with 8 GB. The
laptop is not an afterthought. A lab that makes the laptop swap is a lab that never gets
used, and a plan that pretends otherwise is a plan for one machine.

## What the data says

**The courses are not one kind of thing.** Grouped by the practice they would need:

| Practice shape | Courses | Lessons |
| --- | --- | --- |
| Write a function, cases judge it | NeetCode 150, Data structures, Interview patterns | 150 |
| Write a program, something talks to it | Networking, Git, SQL, C, OS, Concurrency | 143 |
| Set up infrastructure and break it | Docker, System design, Linux | 68 |
| Think, with no mechanical answer | Design patterns ×2, SOLID, OSI theory | 126 |

Only the first row is served today. The second row is one engine away — it is the
CodeCrafters shape. The third needs containers, and sometimes a real machine.

**Infrastructure is cheap; dev servers are not.** Measured from the containers already
running on this machine:

| Container | Memory |
| --- | --- |
| postgres | 82 MB |
| redis | 27 MB |
| nginx | 11 MB |
| strapi (`dev`) | 2.15 GB |
| next (`dev`) | 3.23 GB |

A load balancer, two small services, a database and a cache come to roughly 250 MB. That
fits on the 8 GB laptop with room to spare. What does not fit is a framework in dev mode —
which is also why the studio itself should run built rather than `next dev` on that laptop.

**The hardware.** Desktop: 64 GB, 6 cores / 12 threads, Docker holding 39 GB, Hyper-V on.
Laptop: 8 GB. Docker Desktop on the laptop should be capped around 3 GB, leaving the editor
and a browser alive.

## What already exists

Most of the machinery. This plan is again mostly wiring parts that are already here.

- `runBridge()` spawns a Node process, parses its JSON, kills it on a deadline.
- `tests/runner/` judges cases, reports per-case failures, probes complexity and memory.
- `/api/ops` counts operations inside a run — the same counter can count *anything*,
  including database calls.
- The trace engine instruments and replays a run step by step.
- The verdict panel, the status dots, `.studio/history.json`, the review ladder, the repeat
  plans, the notes, the diff against the last passing solve — all of it is generic over
  "a thing you attempt and either pass or fail".
- The course player already pairs a lesson with practice; it just has nothing to pair for
  a lesson about caching.

Missing: a runner that starts *your program* and talks to it, and a runner that brings up
a *stack* and breaks it.

## How this is done elsewhere

**CodeCrafters** runs the tests on your own machine. A Go binary holds a registry mapping a
stage slug to a test function, reads `CODECRAFTERS_SUBMISSION_DIR` and
`CODECRAFTERS_CURRENT_STAGE_SLUG` from the environment, spawns the program the repository
declares, and asserts against it — with memory monitoring and CPU/memory limits around the
child process, output captured through pipes or a PTY. No server does any work.

**Killercoda, KodeKloud, Play with Docker** give you a remote VM in their cloud. That is a
business model, not an architecture a solo project can copy.

So the model is the local one, and it is the right one anyway: the whole point is that the
thing runs on the machine in front of you.

Two details worth stealing outright:

1. **A declared run command.** The challenge repository says how to start the program
   (`your_program.sh`). The tester never guesses. That is what makes a second language —
   C, from the C course — a data change rather than an engine change.
2. **Re-run the earlier stages.** Passing stage 5 means stages 1–5 still pass. Regressions
   are the lesson, not an annoyance.

## Principles

The first four exist because of the laptop.

1. **Nothing runs unless asked.** No stack starts on page load, no poller, no warm-up. The
   studio already auto-syncs problem statuses on load; the lab engine will not copy that.
2. **A lab declares its cost, and the machine decides.** Every challenge and lab carries
   `needs: { memoryMb, containers, docker }`. A machine profile — total and free memory,
   cores, whether Docker answers and how much it was given — is measured once and cached.
   A lab that does not fit is shown, labelled, and refuses to start, with the arithmetic
   in the message: *needs 800 MB, Docker has 240 MB free*.
3. **Verdicts are invariants, not stopwatch readings.** "No request was lost during the
   restart", "the ledger holds exactly one charge", "the database was read once, not a
   hundred times". Those are true on both machines. Absolute latency targets belong only
   to labs marked desktop-only, or they turn into a lab that passes here and fails there.
4. **Write anywhere, run where there is room.** The solution is a file in git. On the
   laptop a heavy lab still opens: the task, the editor, the expected verdict shape, and
   the last recorded run. You write there and run it here. Hiding the lab would be worse.
5. **Every child process has a cap, a deadline and an owner.** Memory limit, CPU quota,
   timeout, and a kill on disconnect. A lab that leaks containers after a crash is a lab
   that eats the laptop tomorrow.
6. **One verdict shape, one history.** A stage result and a lab result are the same object
   the runner already produces, so statuses, the review ladder, notes and the diff work
   without knowing what kind of thing was attempted.
7. **Measured, not promised.** The harness records its own peak memory and wall time per
   run, so a lab's declared cost is checked against reality instead of trusted.

## Tiers

| Tier | What it uses | Footprint | Laptop |
| --- | --- | --- | --- |
| **T0** | Node processes only, no Docker | ~80 MB | yes |
| **T1** | 3–5 alpine containers | ~300 MB | yes, with Docker capped at 3 GB |
| **T2** | Many replicas, heavy images, VMs | 1 GB+ | no — opens read-only, runs on the desktop |

The first challenge and the first lab are deliberately T0 and T1. T2 exists so that the
honest answer to "this needs a real machine" has somewhere to live.

## Stages

### Stage 1 — Machine profile and the capability gate

Measure once per boot: total memory, free memory, cores, Docker reachable, Docker's memory
allocation, free disk. Cache it in `.studio/machine.json` with a timestamp. Expose it to the
UI. Every challenge and lab declares `needs`; the list shows three states — ready, heavy
(runs, but it is most of what this machine has), unavailable (with the arithmetic).

Cheap, and everything after it depends on it.

### Stage 2 — The stage runner

The engine behind every "build your own X".

- A challenge is a folder: `challenges/<slug>/` with `challenge.json` (title, course,
  lesson timestamp, `needs`, run command) and `stages/<n>-<slug>/` holding a description
  and a tester module.
- A tester module exports `run(ctx)` and returns the same verdict object the case runner
  returns, so the verdict panel needs no new rendering.
- `ctx` gives the tester: a spawned handle on the student's program, helpers to open a
  socket, send bytes, read with a deadline, and assert; and a logger whose lines become the
  "what the tester did" panel.
- The student's code lives in the workspace like a problem file, so the editor, the diff,
  the snapshots and the review ladder all keep working.
- Running stage *n* runs stages 1..n. The verdict names the first stage that broke.

Resource limits live here, once, for everything: `--max-old-space-size`, a wall-clock
deadline, a kill on abort, and peak-RSS sampling.

### Stage 3 — First challenge: HTTP server (T0)

Six stages, no Docker, two processes, about 80 MB:

1. Bind port 4221 and accept a connection
2. Answer `GET /` with `200 OK`
3. `GET /echo/abc` returns `abc` with the right `Content-Length`
4. Read a request header and echo `User-Agent`
5. Serve four connections at once
6. `GET /files/<name>` from a directory, and `404` for what is not there

Every one of those is a lesson in the Networking course — sockets, ports, HTTP verbs,
status codes. This is the stage that proves the format; if the format is wrong, it is wrong
cheaply here.

### Stage 4 — The stack harness (T1)

The same runner, one level up.

- A lab is a folder with a `docker-compose.yml` **the student writes**, plus a fixed
  `harness/` the lab ships: the services under test are the student's, the load generator
  and the assertions are not.
- The harness can: bring the stack up and wait for health, send load, kill a container,
  pause a container, cut a network, restart, and tear everything down — including after a
  crash, which is a `finally`, not a hope.
- The load generator is in-process Node with keep-alive connections, not a separate tool,
  and its concurrency scales with the machine profile. Since verdicts are invariants
  (principle 3), scaling the load does not change the answer.

### Stage 5 — First lab: one service becomes three (T1)

`nginx` + two Node replicas + postgres, about 250 MB. The stack is given working but wrong.
The verdict checks invariants:

- both replicas served traffic (the balancer is actually balancing)
- when one replica is killed mid-load, no request is lost (health checks and retries)
- after `docker compose restart postgres`, the data written before is still there
- no request is served while a replica is starting up

That is four lessons of the System design course — load balancing, health checks, SPOF,
horizontal scaling — as something that either holds or does not.

### Stage 6 — Wiring into the courses

A challenge or lab declares `{ course, lessonAt }`. `practiceFor()` gains one more source
alongside timestamps, titles and tags: things declared for this course and this lesson.
The Practice pane beside the video stops being empty for system design and Docker. No new
UI.

### Stage 7 — Degraded mode

On a machine where a lab does not fit: the task, the editor and the last recorded verdict
open normally; the Run button explains what is missing and offers to write the attempt to
disk so the desktop picks it up from git. A lab is never hidden because the machine is
small — it is only not runnable there.

### Stage 8 — The second challenge, to prove the format generalises

Build your own Git, four stages: `init`, `hash-object`, `cat-file`, `commit-tree`. It uses
the same runner but asserts on the filesystem and on shelling out to real `git` for a
cross-check, rather than on a socket. If stage 2's `ctx` needs no surgery for this, the
engine is done.

## What this deliberately does not do

- **No cloud runner, no remote sandbox.** Everything runs on the machine in front of you.
- **No VM provisioning.** Hyper-V VMs for the Linux and Docker courses stay a manual,
  documented setup. Automating them is a second product.
- **No deploy-to-production automation.** The VPS lab, when it exists, verifies a
  deployment you performed — it does not perform it.
- **No multi-language on day one.** TypeScript first, C second because the C course wants
  it, and only because the run command is data.
- **No discrete-event simulator.** Measuring a real stack is both cheaper and truer.
- **No automatic grading of design essays.** Self-grading against a model answer, which the
  review machinery already supports.
- **No absolute latency targets** outside T2 labs.

## Order and cost

| Stage | Cost | Unblocks |
| --- | --- | --- |
| 1 Machine profile | half a day | everything the laptop touches |
| 2 Stage runner | two evenings | every "build your own X" |
| 3 HTTP server challenge | one evening | proof the format works |
| 4 Stack harness | two evenings | every infrastructure lab |
| 5 First lab | one evening | four System design lessons |
| 6 Course wiring | two hours | the empty Practice pane |
| 7 Degraded mode | half a day | the laptop |
| 8 Git challenge | one evening | proof it generalises |

Stages 1–3 are worth doing on their own: they need no Docker, they run on the laptop, and
they answer "is this worth building" before the expensive half starts.

The engine is not the expensive part. Authoring is. CodeCrafters is a company; this is one
person with evenings. Every stage description and every tester is hand-written, so the plan
is to build the engine once and then add challenges slowly, the way the case files for
category 01 and 02 were added.

## Where it lives

```
challenges/<slug>/challenge.json      title, course, lesson, needs, run command
challenges/<slug>/stages/<n>-<slug>/  description.md + tester.mjs
labs/<slug>/lab.json                  title, course, lesson, needs, tier
labs/<slug>/harness/                  load generator and assertions (fixed)
labs/<slug>/starter/                  what the student edits, including compose
studio/src/server/machine.ts          the machine profile
studio/src/server/lab.ts              stack lifecycle, fault injection
tests/runner/stages/                  the stage runner, next to the case runner
.studio/machine.json                  cached profile
```

Solutions and compose files live in the workspace and travel in git, which is what makes
principle 4 work: write on the laptop, run on the desktop.
