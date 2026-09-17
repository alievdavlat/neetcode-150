# Studio

A LeetCode-shaped browser UI over this workspace. Same 150 problems, same files on
disk, same test runner — only the surface is different.

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

## Big-O

The **Big-O** toggle next to Run adds the complexity probe: each passing variant is timed
at doubling input sizes and the standard curves are ranked by how constant `t(n)/f(n)`
stays. The result is drawn as your measured curve against `O(1)`, `O(log n)`, `O(n)`,
`O(n log n)` and `O(n²)`, all normalised through your first measurement, with the fitted
one highlighted and the target from the problem file compared against it.

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
node --experimental-strip-types bridge/problems.mjs                    # the 150 problems
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
