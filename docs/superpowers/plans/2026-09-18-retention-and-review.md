# Remembering solved problems — plan

Date: 2026-09-18
Status: implemented 2026-09-18 — all eight stages

## The problem

"I forget how to solve problems I already solved." That is the normal outcome of solving
something once, and it is not a discipline failure.

The workspace is not empty on this: it already has a review interval, a `due` flag and a
Due filter. What it does not have is a schedule that learns, a review that makes you
retrieve rather than read, or any record of how a review went. This plan is mostly about
connecting parts that already exist.

## What the data says

Fourteen problems have history. Seven have passed (001–007). One has fifteen attempts, two
hints and no pass (008). Six have been opened and never run.

One fact from that log matters more than the rest.

**A bulk recheck can mark a problem as reviewed.** `summarize()` counts any record with
`ok: true` as a pass, including `kind: 'sync'`, which is what the Recheck button writes:

```ts
const attempts = records.filter((record) => record.kind === 'run');   // correct
const passes = records.filter((record) => record.ok);                 // includes syncs
```

`lastPass` drives `due`, so a recheck resets the review clock.

Measured against the current log the damage is small but real: 001–005 last passed from a
genuine attempt, so the fix moves nothing for them. **007 is the case that proves it** — it
has zero hand runs and zero opens, and its only pass is a sync. Today it counts as solved
and recently reviewed on the strength of a batch job.

That is the distinction the whole plan rests on. A sync proves the file still compiles and
still passes. It says nothing about whether he could write it again. Only the second thing
is what he is losing, so only the second thing may advance the schedule.

**Passes outnumber attempts** for the same reason — 001 shows 9 attempts and 10 passes.

## What already exists

Most of the primitives are here. This plan is mostly about wiring them into a loop.

| Piece | Where | Note |
| --- | --- | --- |
| Full run log per problem | `studio/.studio/history.json` | 60 records, plus opens and hint level |
| Review interval | `history.ts` `reviewInterval()` | fixed 3 / 7 / 21 days |
| `due`, `dueInDays` | `ProblemHistory` | already shown in the brief and as a rail filter |
| Blank-slate copy | scratch mode, the **Fresh** toggle | the retrieval primitive, already built |
| Your previous solutions | `.studio/solutions/<n>/<time>.ts` + `solution-diff.tsx` | the elaboration primitive |
| The note field | "What tripped you up? What is the one idea to remember?" | exactly the right prompt |
| Hints, 3 levels, recorded | `/api/hint` | a measured signal of difficulty |
| `solveMinutes` | measured from open → first pass | the honest retention metric |
| Step-by-step replay | the Simulation tab | the strongest elaboration tool here |

## Diagnosis

Five failure modes, in the order they hurt.

### 1. A recheck counts as a review

Described above. Until this is fixed nothing else in this plan can work, because the queue
is always empty.

### 2. The interval never grows

```ts
const reviewInterval = (runsToFirstPass: number | null, hintLevel: number) => {
  if (hintLevel >= 2 || (runsToFirstPass ?? 99) > 5) return 3;
  if (hintLevel === 1 || (runsToFirstPass ?? 99) > 2) return 7;
  return 21;
};
```

Both arguments are frozen after the first solve. Re-solve a problem cleanly ten times and
it still comes back every 21 days. Fail it ten times and it still comes back every 3. This
is a reminder, not spaced repetition: the schedule learns nothing from how the review went.

### 3. Opening a solved problem shows the answer

The default view of a solved problem is your own solution. Reading it produces a strong
feeling of knowing and almost no memory. Retrieval — starting from the stub — is what
builds durable recall, and it exists as the **Fresh** toggle, but it is not what a review
starts in.

### 4. Nothing records how the review went

A re-solve is logged as another run. The system cannot tell "re-derived it in four minutes
with no hints" from "opened my old file and pressed Run". Without that, no schedule can
adapt even if it wanted to.

### 5. A review costs as much as the first solve

If the only review is a full re-solve, a queue of eight problems is three hours and gets
skipped. Skipped queues rot, and a rotten queue is worse than none because it also removes
the feeling that anything is being tracked.

## Principles

- **Retrieve, do not recognise.** A review starts blank. The old solution is not reachable
  until the attempt is over.
- **Let the measurement grade it.** The app already times the attempt, counts the runs and
  records hints. Self-reported confidence is the least reliable input available; use it only
  as an override.
- **Two review sizes.** A full re-solve, and a 45-second recall drill. The drill keeps the
  queue moving on days when there is no hour to spare.
- **Interleave.** Mix categories in the queue. Blocking by topic feels better and works
  worse.
- **Never let a problem vanish.** Cap the interval. A 21-day success should not become a
  two-year gap.

## Stages

Each stage is shippable on its own and useful without the ones after it.

---

### Stage 1 — Stop rechecks from resetting the clock

**Change.** In `summarize()`, count only real attempts as passes:

```ts
const passes = attempts.filter((record) => record.ok);
```

**Why first.** It is one line and it is the difference between a queue that fills and a
queue that is always empty. Everything after this depends on it.

**Watch for.** `runsToFirstPass` and `solveMinutes` already derive from `attempts`, so they
do not move. Measured against today's log only 007 changes: it has no hand runs at all, so
it loses its `lastPassAt` entirely and stops counting as reviewed. 001–005 are unaffected
because their last pass was a real attempt. The fix matters for what it prevents from here
on, not for what it corrects today.

**Done when.** A recheck leaves `dueInDays` unchanged.

---

### Stage 2 — An adaptive schedule

**Change.** Add a per-problem `interval` and `ease`, updated by a grade.

```
seed:    interval = reviewInterval(runsToFirstPass, hintLevel)   // keep the existing 3/7/21
         ease     = 2.3

grade 0  (failed, or revealed the solution)
         lapses  += 1
         ease     = max(1.3, ease - 0.20)
         interval = 1

grade 1  (solved, but slow or after several runs)
         ease     = max(1.3, ease - 0.05)
         interval = max(1, round(interval * 1.2))

grade 2  (solved cleanly, first or second run, no hints)
         ease     = min(2.8, ease + 0.05)
         interval = min(180, round(interval * ease))
```

The seed keeps the existing judgement about the first solve, which is a real signal: a
problem that took six attempts genuinely should start at three days.

**Data model.** `history.json` gains:

```jsonc
"reviews": {
  "003": [
    { "at": "2026-09-20T09:12:00Z", "grade": 2, "kind": "solve", "minutes": 4, "runs": 1, "hints": 0, "revealed": false }
  ]
},
"schedule": {
  "003": { "interval": 21, "ease": 2.35 }
}
```

`ProblemHistory` gains `interval`, `ease`, `reviewCount`, `lapses`. `dueInDays` and `due`
keep their meaning and are computed from the last review rather than the last pass, falling
back to the last pass when there are no reviews yet.

**Migration.** No review history exists. Seed on read: `interval = reviewInterval(...)`,
`ease = 2.3`. Nothing in the UI breaks, and the first real review starts adapting.

**Done when.** Reviewing a problem successfully twice pushes it from 21 → ~48 → ~110 days,
and failing it once drops it to 1.

---

### Stage 3 — Review means retrieval

**Change.** A `Review` action on a due problem opens it in a review session:

- the editor opens the **scratch** copy reset to the stub, not your saved file
- the `My file` toggle, `Compare`, and the note are hidden for the duration
- a single **Reveal** button exists, and pressing it is recorded as `revealed: true`
- on a pass, the session ends and the diff against your last snapshot opens automatically —
  that comparison is the point, not a formality
- on reveal or abandon, the session ends at grade 0 and shows the solution and the note

**Files.** `studio.tsx` gains a `review` session state; `solution-editor.tsx` hides the
mode toggle and Compare while a session is open; a new `review-panel.tsx` holds the session
header, the timer and the end-of-session actions.

**Done when.** Starting a review on a solved problem shows a stub, and the saved solution
is not reachable without recording a reveal.

---

### Stage 4 — Grade from what was measured

**Change.** Derive the grade at the end of a session; do not ask first.

```
revealed or no pass                              -> 0
passed, runs <= 2, no hints, minutes <= baseline -> 2
otherwise                                        -> 1
```

`baseline` is the first-solve `solveMinutes`, or the median of previous reviews once there
are two. Show the derived grade with the numbers behind it — "4 min, 1 run, no hints → clean"
— and offer one click to lower it. Lowering is allowed; raising is not.

**Why one-directional.** The only dishonesty that hurts is claiming a review went better
than it did. Claiming it went worse just brings the problem back sooner, which is harmless.

**Done when.** Finishing a review writes a grade nobody typed.

---

### Stage 5 — The recall drill

**Change.** A second review kind that costs under a minute and never opens the editor.

The drill shows the statement and examples, then asks two questions:

1. **Which pattern?** Picked from the tag list, or typed.
2. **What is the one idea?** Free text.

Then it reveals your saved note and the problem's `pattern` line side by side with what you
just wrote, and you mark whether you had it.

Scheduling: a drill advances the interval at a reduced rate — `interval * (1 + (ease - 1) * 0.5)`
— and **cannot move a problem past 30 days**. Past that ceiling only a full re-solve counts.
Without the ceiling it is possible to drill a problem to a six-month interval without ever
writing the code again, which is exactly the illusion this is meant to break.

**Why this is the highest-value stage for retention.** What decays is not the syntax, it is
the mapping from "sorted array, find a pair" to "two pointers, converge from the ends". The
drill exercises that mapping directly, and it is cheap enough to actually do.

**Done when.** Eight due problems can be drilled in ten minutes, and the queue empties.

---

### Stage 6 — Make the queue unavoidable

**Change.** A `Due today` band at the top of the home page, above the collections: the
count, the first few problems, and a **Start review** button that walks the queue one at a
time and returns to the queue after each.

- Daily cap of eight. Overflow says "and 12 more waiting" rather than showing 20.
- Order: most overdue first, then interleaved so consecutive problems are from different
  categories.
- The band disappears when the queue is empty, and says so for one visit.

**Done when.** Opening the app on a day with work due makes that the first thing on screen.

---

### Stage 7 — Leeches

**Change.** A problem with three consecutive grade-0 reviews is marked a leech. It leaves
the normal rotation and appears in a small **Stuck** list with a prompt: rewrite the note in
one sentence, or split the problem into the sub-skill that is actually missing.

008 is already one by any measure — fifteen attempts, two hints, no pass.

**Why.** Without this, three hard problems occupy every review session forever and the rest
of the queue starves.

**Done when.** A repeatedly failed problem stops appearing in the daily queue and starts
appearing in Stuck.

---

### Stage 8 — Show whether it is working

**Change.** Two numbers per problem in the brief, and one chart:

- **re-solve time across reviews** — the honest retention metric. Flat or falling is
  learning; rising is not.
- **runs to pass across reviews**.

And one workspace-level line on the home page: how many problems are at an interval over 60
days, which is the count of things actually retained rather than recently seen.

**Done when.** The question "am I remembering these?" has a number instead of a feeling.

---

## What this deliberately does not do

- **No flashcards of code.** Memorising a solution is the wrong target; the pattern and the
  one idea are the target.
- **No Anki export.** Splitting the loop across two apps means the retrieval happens where
  the runner is not, and the grade never comes back.
- **No scheduling of the catalogue.** Only problems with a real pass enter the rotation.
  1,104 problems exist; roughly 150 will ever be solved, and only those are reviewed.
- **No confidence slider.** It is the least reliable signal available and it displaces the
  measured ones.

## Order and cost

| Stage | Size | Unlocks |
| --- | --- | --- |
| 1 Recheck does not reset | one line | everything else |
| 2 Adaptive schedule | small, one module | intervals that grow |
| 3 Retrieval sessions | medium, UI | reviews that build memory |
| 4 Measured grading | small | the schedule gets real input |
| 5 Recall drill | medium | a queue that survives busy days |
| 6 Queue on the home page | small | the loop gets used |
| 7 Leeches | small | the queue stays healthy |
| 8 Trend numbers | small | evidence it is working |

Stages 1 and 2 together are most of the benefit and are roughly an afternoon. Stage 5 is
the one that decides whether the habit survives.

## Decisions taken while building

The three open questions were answered with defaults rather than left blocking. All three
are one constant away from changing.

1. **Daily cap: eight.** `DAILY_CAP` in `review-queue.tsx`. Overflow reads "and N more
   waiting" rather than showing the whole backlog.
2. **Drill ceiling: 30 days.** `DRILL_CEILING` in `server/schedule.ts`. Still a guess; it
   should be revisited once there are a few dozen drills to look at.
3. **A first solve schedules a review immediately**, seeded at 3, 7 or 21 days depending on
   how hard that first solve was. The seed is what keeps this from feeling like punishment:
   a clean first solve waits three weeks.

## Strict mode and the settings page (added after the first pass)

He asked for two more things: a way to be forced through a repeat rather than quietly
skipping it, and a switch to turn repeats off.

**Settings** live in `studio/.studio/settings.json` beside the history, not in the browser,
because the gate is decided while the page is rendered on the server.

- `reviewEnabled` — off removes the queue, the due badges and the Review buttons. The
  schedule keeps running underneath, so turning it back on resumes rather than restarts.
- `strictMode` — while anything is due, the home page, the collections and every other
  problem are closed. Only `/c/<board>?p=<the due one>&review=1` opens. Inside the session
  the rail is disabled, so the one open problem is the only one that opens.
- `dailyCap` — how many the queue offers at once.

**The gate opens on a passing run, not on ending the session.** Reveal still works — you
can look at your old solution — but looking does not let you out. That is the difference
between strict and a reminder.

**Two deliberate ways past it**, because a tool that can lock you out of itself with no
exit is broken rather than strict:

1. **Defer to tomorrow**, behind a confirmation, recorded as a failed review: interval back
   to one day, ease down, lapse counted. Inside a session the same thing is the two-step
   "Give up → Yes, take the lapse".
2. **`/settings` stays reachable while the gate is up**, and the gate links to it. He chose
   strict mode; he can unchoose it.

A leech never becomes the gate. Three failures in a row take a problem out of the rotation,
so the one problem you genuinely cannot do today cannot hold the workspace shut.

## Where it lives

| Piece | File |
| --- | --- |
| Interval, ease, grading — pure, tested | `studio/src/server/schedule.ts` |
| Review log, leech detection, summary | `studio/src/server/history.ts` |
| Record a review | `studio/src/app/api/review/route.ts` |
| Reset the practice copy to the stub | `studio/src/app/api/review/start/route.ts` |
| Session header, timer, Reveal / End | `studio/src/components/review-bar.tsx` |
| The sixty-second drill | `studio/src/components/recall-drill.tsx` |
| Due queue and the stuck list | `studio/src/components/review-queue.tsx` |
| Tests | `tests/runner/schedule/schedule.test.mjs`, `npm run test:review` |
| Settings file, defaults, clamping | `studio/src/server/settings.ts` |
| Settings API | `studio/src/app/api/settings/route.ts` |
| Settings page | `studio/src/app/settings/page.tsx`, `components/settings-form.tsx` |
| The gate | `studio/src/components/strict-gate.tsx`, applied in both page files |
| Due ordering, shared by every caller | `studio/src/server/review.ts` |
