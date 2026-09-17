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

## The editor writes to your files

The editor is Monaco on the actual file, not a copy.

- `Ctrl/Cmd + S` saves to disk.
- `Ctrl/Cmd + Enter` saves if needed, then runs.
- Nothing is written until you save, so closing the tab on a half-written attempt
  loses only what was never saved.
- Editing a file in VS Code and reloading the studio picks up the change; the studio
  never holds a file open or writes behind your back.

Only paths matching `NN-category/NNN-slug.ts` can be read or written, an empty file is
refused, and nothing else in the workspace is reachable through the API.

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
node --experimental-strip-types bridge/problems.mjs      # the 150 problems
node --experimental-strip-types bridge/run.mjs 003       # one report
```

`run.mjs` calls `runAll` from `tests/runner/schedule.mjs`, so an endless loop in a
solution is killed by the same worker timeout the CLI uses and can never hang the dev
server. The report is the runner's own object, rendered instead of printed.

## Layout

```
bridge/          spawned Node scripts, the only code that touches the runner
scripts/         copies the Monaco bundle into public/ so the editor works offline
src/server/      path guard, child process wrapper, status derivation
src/app/api/     file read/write, run, statuses
src/components/  rail, brief, editor, verdicts
```

## Notes

- Monaco's TypeScript semantic checks are off; it cannot resolve `../shared/types.ts`
  in the browser and would underline correct code. Use `npm run check` at the root for
  real type errors.
- The studio has its own `package.json` and `tsconfig.json`; the root `tsconfig`
  excludes this folder so `npm run check` stays about the problems.
