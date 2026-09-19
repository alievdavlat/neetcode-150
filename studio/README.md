# Studio

A LeetCode-shaped browser UI over this workspace. Same 1109 problems across 22
categories, same files on disk, same test runner — only the surface is different.

```bash
npm install     # once, inside studio/
npm run dev     # http://localhost:3150
```

Or from the workspace root: `npm run studio`.

## What it shows

| Pane | Comes from |
| --- | --- |
| Problem list, search, difficulty and status filters | `_gen/data/*.mjs` |
| Description, examples, constraints, follow-up, links | `_gen/data/*.mjs` + the file's doc block |
| Editor | the real `NN-category/NNN-slug.ts` file |
| Verdicts, per-case input → output, timings | `tests/runner/` |

## Two modes

The toggle in the editor toolbar decides which copy of a problem you are working on.
It is remembered per problem.

| Mode | Reads | Saves to | Counts towards progress |
| --- | --- | --- | --- |
| **My file** | your solution in the workspace | the same file | yes |
| **Fresh** | the doc block plus the generated stub | `.studio/scratch/<dir>/<file>` | no |

**Fresh** is for solving a problem again without seeing your old answer: it never reads
and never writes your solution file. The practice copy keeps the doc block, so the header
is still there and promoting it back cannot lose it. Tests run against the practice copy
with the same cases, and the verdict is shown without touching the status in the sidebar.

**Copy to my file** writes the practice copy over your solution. It asks first, because
that overwrites whatever is in the file. After it succeeds the editor switches back to
My file.

Delete `.studio/scratch` at any time — every practice copy is reseeded from the stub on
the next visit.

## The editor writes to your files

The editor is Monaco on the actual file, not a copy.

- `Ctrl/Cmd + S` saves to disk.
- `Ctrl/Cmd + Enter` saves if needed, then runs.
- Nothing is written until you save, so closing the tab on a half-written attempt
  loses only what was never saved. Switching problem or mode with unsaved edits asks
  before discarding them.
- Editing a file in VS Code and reloading the studio picks up the change; the studio
  never holds a file open or writes behind your back.

Only paths matching `NN-category/NNN-slug.ts` — and their practice copies — can be read
or written, an empty file is refused, and nothing else in the workspace is reachable
through the API.

## Statuses are measured, not guessed

A problem is green because its tests were run and passed, never because the file looks
finished. Anything started but unverified — a solution written in VS Code, or a file
changed after its last run — is re-run automatically when the page loads, and **Recheck**
in the header does the same on demand. The number beside Recheck is how many problems are
waiting for a verdict.

Each category header in the sidebar carries a ▶ button that runs every started problem in
that category in one process — about three seconds for nine problems.

When a problem goes green the Done column of its category README is ticked, and unticked
again if a later run fails. Those ticks are never a guess: they follow the same verdicts
the sidebar shows. `node _gen/generate.mjs` rewrites those tables, so a regenerate clears
them — one more Recheck puts them back.

## Collections

The sidebar can narrow the whole workspace to a named list. `collections/*.json` holds the
numbers a list covers — nothing else — so a list can never point at a problem this
workspace does not have. **Blind 75** ships with it: all 75 are already here, so it is a
view, not a copy.

Below the filters is a row of technique tags (`hash map`, `sliding window`, `dfs`, …).
They are derived from each problem's own pattern line: every problem carries a unique
sentence there, so grouping by it would give one group per problem. Twenty-one tag
rules in `src/lib/meta.ts` cover the whole workspace instead.

## Languages

The interface and every problem's prose are available in English, Russian and Uzbek.
The picker is in Settings; the choice is a cookie, so there is no locale in the URL.

Only the active language is ever sent to the browser: `src/i18n/server.ts` imports one
dictionary on the server and hands it to the provider. Problem prose lives outside the
app, in `_gen/i18n/<locale>/<category>.json`, and is merged over the English by
`_gen/i18n/index.mjs` — field by field, so a missing translation falls back rather than
blanking. Only `title`, `statement`, `pattern`, `followUp` and `constraints` are
translated; `examples` are never touched, because the test runner parses its cases out
of them.

## Notes

Each problem has a note box under the description, stored in `.studio/notes/<number>.md`.
It is for what tripped you up, and it is the first thing you see when a review comes due.

## Practice history

Every run — and every time you open a problem — is appended to `.studio/history.json`, and
the brief shows what it adds up to: how many runs, which run first passed, how long the
first solve took from the moment you opened it, when you last ran it, and how many hints
you opened. A bulk Recheck is recorded too but never counted as an attempt.

When a problem comes back for review depends on how it went: solved on the first run with
no hints waits three weeks, one that took more than five runs or two hints comes back in
three days. A due problem is marked in the sidebar, in the palette and behind a filter
chip; the brief counts down to the next one.

Every passing run also snapshots the file into `.studio/solutions/<number>/` (last five).
**Compare** in the toolbar diffs what is in the editor against the last solve — which is
what makes **Fresh** mode a loop: solve it again blind, then see what you did differently.

## Hints are opt-in

The pattern, the target complexity and the walkthrough link start hidden — they are the
answer's shape, and reading them by accident is not practice. Each is one click away, and
opening one is recorded, so the history line tells you honestly whether a solve was yours.

## When a case fails

A failing case spells out **Input**, **Your output** and **Output should be** — and where a
case only checks a property (Encode and Decode, for example, checks a round trip) there is
no single right answer, so that row is left out rather than filled with `undefined`.

**add console.log** writes the failing call to the end of your file with the expected value
already in the comment, so the line you debug with can never disagree with the test.
Anything your file logs at import time is shown back under **your console output**.

## Type errors

Monaco cannot resolve `../shared/types.ts` in a browser, so its own checker is off. Instead
the real compiler runs when a file is opened and after every save; anything it reports for
the open file is underlined in the editor and counted in the toolbar. It builds a
single-file program in process (`src/server/typecheck.ts`) rather than shelling out to
`tsc` over the workspace, which is what keeps it fast enough to run on every save.

## Keyboard

| Key | What it does |
| --- | --- |
| `Ctrl/Cmd + S` | save |
| `Ctrl/Cmd + Enter` | save, then run |
| `Ctrl/Cmd + K` | jump to any problem by number, title, category or pattern |
| `Ctrl/Cmd + ↓` / `↑` | next / previous problem |
| `Ctrl/Cmd + →` | next problem that is not solved |

## Big-O

The **Big-O** toggle next to Run adds the complexity probe: each passing variant is timed
at doubling input sizes and the standard curves are ranked by how constant `t(n)/f(n)`
stays. The result is one chart holding **every variant you wrote** — `fn`, `fn2`, `fn3` as
separate lines — against `O(1)`, `O(log n)`, `O(n)`, `O(n log n)` and `O(n²)`, all
normalised through the first measurement, with the fitted curves highlighted and the target
from the problem file compared against it. The quickest variant is badged `fastest`, and
each card also shows heap growth for one call, so a faster-but-hungrier approach is
visible rather than assumed.

It is on by default and remembered. It is not a cost while you are debugging: the probe
only times a variant whose cases all pass, so a failing solution runs exactly as fast as
it would with the probe off. On a passing solution it adds roughly a second per variant
(measured: 0.67s → 2.59s for the two variants of Contains Duplicate). Turn it off if you
are iterating on something already correct and want the tightest loop; any variant run
without it shows a **Measure Big-O** button in its card.

It is a measurement, not a proof. `O(n)` and `O(n log n)` cannot be told apart at sizes
this small — the log factor moves less than the noise — so the runner reports the pair
instead of picking one, and the chart says so. Runs with the probe take a few seconds.

## Status colours

| Dot | Meaning |
| --- | --- |
| grey | not started — the file still matches the generated stub |
| blue | in progress — you changed it, no run recorded yet |
| red | the last run had a failing variant |
| green | every variant passed on the last run |
| dashed ring | the file changed after that run, so the verdict is stale |

Run results are cached in `studio/.studio/results.json` (gitignored) so progress
survives a reload. Deleting that file only resets the colours.

## How it talks to the runner

Next.js never imports the runner or a solution file. Two small scripts in `bridge/`
are spawned as their own Node process and print JSON:

```bash
node --experimental-strip-types bridge/problems.mjs                    # every problem
node --experimental-strip-types bridge/run.mjs 003                     # one report
node --experimental-strip-types bridge/run.mjs 003 --file <path>       # ... from another file
node --experimental-strip-types bridge/run.mjs 003 --big-o             # ... with the complexity probe
node --experimental-strip-types bridge/run-all.mjs 001 002 003         # compact verdicts, for Recheck
```

`run.mjs` runs the problem in a worker thread and terminates it after ten seconds, so an
endless loop in a solution can never hang the dev server. `--file` is what points the
runner at a practice copy: the cases, the signature and the node conversions still come
from `_gen/data`, only the code is read from somewhere else. The report is the runner's
own object, rendered instead of printed.

## Layout

```
bridge/          spawned Node scripts, the only code that touches the runner
.studio/         run results and practice copies, gitignored
scripts/         copies the Monaco bundle into public/ so the editor works offline
src/server/      path guard, child process wrapper, status derivation
src/app/api/     file read/write, run, promote, sync
src/components/  rail, brief, editor, verdicts
```

## Notes

- Monaco's TypeScript semantic checks are off; it cannot resolve `../shared/types.ts`
  in the browser and would underline correct code. Use `npm run check` at the root for
  real type errors.
- The studio has its own `package.json` and `tsconfig.json`; the root `tsconfig`
  excludes this folder so `npm run check` stays about the problems.
