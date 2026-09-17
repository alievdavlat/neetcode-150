# Algorithm trace visualizer — design

Date: 2026-09-17
Status: approved, ready for planning

## Why

The studio tells a student *whether* a solution is right (verdict panel) and *how fast it
grows* (complexity chart). It never shows *what the code did*. A student who writes a
wrong two-pointer loop sees "3 of 42 cases fail" and has to rebuild the execution in their
head.

This feature records what the student's own code did, step by step, and replays it beside
the editor: which line ran, what each sub-expression evaluated to, and what every local
variable held at that moment.

The reference point is jsv9000.app, but with one deliberate difference. jsv9000 is a
*simulator*: it has one fixed model (call stack, task queue, microtask queue) and animates
any code against it. There is no single fixed model for algorithms, so this is a *tracer*:
it instruments the source the student actually wrote and replays the real execution.
Nothing is hand-authored per problem.

## Goals

- Works on any solution the student writes, not on a curated list of canonical solutions.
- Shows sub-expression detail: `target - nums[i]` → `6 - 3` → `3`, not just the line.
- Shows loop control as its own steps: `let i = 0`, `i < nums.length`, `i++`.
- Adds zero runtime dependencies.
- Leaves the existing run path (`npm test`, big-O probing, memory) byte-for-byte unchanged.

## Non-goals (deferred to phase 2)

Pointer and window overlays, linked-list / tree / graph stages, a recursion call tree, a
line execution heatmap, an operation counter, editing the input from the UI, and replaying
an older snapshot against the current attempt. All are cheap once the trace exists; none
are in this phase.

## Scope

Traceable in this phase: **function** problems whose parameters and return type are drawn
from `number`, `string`, `boolean`, `number[]`, `string[]`, `number[][]`.

In practice that is most of `01-arrays-hashing`, `02-two-pointers`, `03-sliding-window`,
`05-binary-search` and much of `04-stack`.

Not traceable in this phase: problems taking `ListNode`, `TreeNode`, `GraphNode` or
`RandomListNode`, and class problems (LRU Cache, Trie, and friends).

The decision is derived from `problem.signature`, which `tests/runner/signature.mjs`
already computes from the stub. There is no hand-maintained list of supported problems.
An unsupported problem returns `status: 'unsupported'` with a message naming the reason,
so the panel explains itself instead of going blank.

## Architecture

```
UI "Simulate"
  → POST /api/trace { number, variant, caseIndex, mode }
    → traceProblem()  (studio/src/server/problems.ts)
      → runBridge('trace.mjs')            existing child-process mechanism, unchanged
        → Worker, 10s timeout             existing protection, unchanged
          → prepare(problem)              existing: cases, decoders, shape adapters
          → instrument(source)            new: TS AST → __step(...) calls
          → write studio/.studio/trace/<number>-<variant>.mjs
          → import it, call the variant with one decoded case
          → recorder collects steps
        → JSON TraceResult
```

The trace path is a sibling of the run path, not a modification of it. `run.mjs`,
`worker.mjs`, `execute.mjs` and `run-problem.mjs` are not touched.

### New files

| File | Responsibility |
| --- | --- |
| `tests/runner/trace/instrument.mjs` | Pure function. TypeScript source in, instrumented JavaScript source plus metadata out. No I/O. |
| `tests/runner/trace/recorder.mjs` | The `__step` runtime: collects steps, enforces the budget, snapshots values. |
| `tests/runner/trace/supported.mjs` | Decides from a signature whether a problem is traceable; returns the reason when it is not. |
| `studio/bridge/trace.mjs` | Spawns the worker with a timeout and prints `TraceResult` as JSON. Mirrors `run.mjs`. |
| `studio/bridge/trace-worker.mjs` | Instruments, writes the module, imports it, runs one case, posts the trace. |
| `studio/src/app/api/trace/route.ts` | `POST` endpoint, validates the body, delegates. |
| `studio/src/components/trace-panel.tsx` | Transport controls, step state, case picker. |
| `studio/src/components/trace-expression.tsx` | Renders one step's substitution chain. |
| `studio/src/components/trace-stage.tsx` | Renders values: array cells, key→value rows, scalars. |

### Changed files

| File | Change |
| --- | --- |
| `studio/src/lib/types.ts` | Trace types (below). |
| `studio/src/server/problems.ts` | `traceProblem()`, following `runProblem()`'s shape. |
| `studio/src/components/studio.tsx` | Trace state, and a `Tabs` wrapper around the bottom panel. |
| `studio/src/components/monaco-surface.tsx` | An `activeLine` prop that draws a line decoration. |

`verdict-panel.tsx` is deliberately untouched: the tab wrapper lives in `studio.tsx`, so
the verdict panel keeps its single responsibility.

## Instrumentation

### What gets a step

Only the traced function's own body is instrumented. Nested callbacks (`freq.every(c => …)`)
and built-in methods (`.sort()`, `.indexOf()`) run normally and produce no steps — their
result appears as the value of the enclosing expression. This is a real limitation and is
stated in the UI rather than hidden: a solution that delegates its work to `sort()` honestly
has few steps of its own.

| Syntax | Step kind | Recorded |
| --- | --- | --- |
| `const x = expr;` | `stmt` | the initializer chain; `changed: 'x'` |
| `x = expr;`, `x++`, `obj[k] = v` | `stmt` | the chain; `changed` names the target |
| `for` initializer | `loop-init` | the bound value |
| `for` / `while` condition | `loop-cond` | the boolean and its chain |
| `for` incrementor | `loop-update` | before and after |
| `for…of` / `for…in` binding | `loop-update` | the value bound this iteration |
| `if` condition | `cond` | the boolean and its chain |
| `return expr;` | `return` | the returned value's chain |

`switch`, `try`/`catch` and labelled statements are not instrumented in this phase; they
execute normally and contribute no steps.

### Line numbers

Instrumentation never opens a new line: every injected call is appended on the line it
belongs to. The instrumented module therefore has the same line count as the original, and
`step.line` points at the original source directly. This is asserted by a test.

### The substitution chain

For each instrumented expression the recorder builds up to three entries, dropping
duplicates:

1. the expression's original source text, taken from its AST range
2. the same text with each leaf — identifier, element access, property access — replaced by
   its recorded value
3. the resulting value

So `target - nums[i]` yields `["target - nums[i]", "6 - 3", "3"]`, while `i < nums.length`
yields `["i < nums.length", "0 < 3", "true"]`.

Update expressions are a special case, since no substitution describes them: `i++` yields
`["i++", "0 + 1", "1"]`.

### Scope

The instrumenter tracks the static scope chain: the function's parameters plus every
`let` / `const` / `var` visible at each instrumented position. A step reports exactly the
bindings live at its own position.

Block scoping therefore falls out for free, with no special casing. A `const calc` declared
inside a loop body is simply not in scope at the `i++` site, so the panel shows it
disappearing and being reborn each iteration — which is the truth about block-scoped
declarations, and something most students have never seen.

### Value snapshots

`recorder.snapshot(value)` produces a `TraceValue`:

- `number`, `boolean`, `null`, `undefined` → `scalar`
- `string` → `scalar`, quoted, truncated at 120 characters
- `Array` and typed arrays → `array` of item texts, at most 200 items
- `Map`, `Set` → `map` / `array`
- plain object → `map`, at most 50 entries
- anything else → `scalar` from `String(value)`, truncated

Snapshots are taken eagerly, because the point is the value *at that moment*. Truncation
sets the `truncated` flag on that value so the UI can say so.

## Data model

Added to `studio/src/lib/types.ts`:

```ts
export type TraceKind = 'stmt' | 'loop-init' | 'loop-cond' | 'loop-update' | 'cond' | 'return';

export type TraceValue =
  | { t: 'scalar'; text: string }
  | { t: 'array'; items: string[]; truncated: boolean }
  | { t: 'map'; entries: [string, string][]; truncated: boolean };

export interface TraceStep {
  line: number;
  kind: TraceKind;
  chain: string[];
  vars: Record<string, TraceValue>;
  changed: string | null;
  touched: { name: string; key: string | number; write: boolean }[];
}

export type TraceStatus = 'ok' | 'unsupported' | 'uninstrumentable' | 'threw' | 'stalled' | 'crashed';

export interface TraceResult {
  number: string;
  variant: string;
  caseIndex: number;
  status: TraceStatus;
  message: string | null;
  args: string[];
  expect: string | null;
  result: string | null;
  steps: TraceStep[];
  truncated: boolean;
  source: string;
}
```

`touched` records the element accesses evaluated during a step, which is what lets the
stage highlight the right array cell or object key. It comes from the AST, not from
guessing which numeric variable looks like an index. `key` is a number for array indices
and a string for object keys, and `write` separates `obj[k] = v` from a read.

## UI

No second code view. The bottom panel gains two tabs — **Verdict** and **Simulation** — and
the active step highlights its line in the Monaco editor already on screen. The student
watches their own file come alive rather than a copy of it.

The simulation tab shows, per step: the step kind, the substitution chain, and a variable
table with before → after values, the changed one emphasised. Arrays render as indexed
cells with touched cells marked; objects and maps render as key → value rows.

Transport: previous, play/pause, next, and a scrubber. The trace is recorded up front, so
stepping backwards is free.

Which case is traced: the first worked example from the doc block by default. If the last
run failed, the first failing case is selected instead — that is when a student most needs
this. A picker allows any other case.

## Limits and failure handling

| Situation | Behaviour |
| --- | --- |
| More than 20 000 steps | Recording stops, `truncated: true`, the panel says the rest was cut |
| Array longer than 200, object wider than 50 keys | Snapshot truncated, flagged on that value |
| The solution throws mid-trace | Steps collected so far are kept, `status: 'threw'` plus the message. This is the most valuable debugging case, so the partial trace must survive |
| Endless loop | The step budget trips first; the existing 10s worker timeout is the backstop |
| Instrumentation fails to parse | `status: 'uninstrumentable'` with the compiler's message |
| Problem out of scope | `status: 'unsupported'` with the reason, e.g. "a TreeNode argument is not supported yet" |

Tracing only ever runs on the small worked examples from the doc block, never on generated
probe sizes. Tests keep running at full size on the untouched run path.

## Testing

`node:test`, which Node 24 ships — no new dependency.

- Golden tests for `instrument.mjs`: `for`, `while`, `if`/`else`, an early `return`, and a
  nested loop, each asserting the exact sequence of step kinds and chains.
- A test asserting the instrumented source has the same line count as the input, which is
  what makes `step.line` trustworthy.
- Snapshot tests for `recorder.snapshot`: each value kind, plus both truncation paths.
- Acceptance, against **fixtures committed with the tests**, never against the live
  solution files — those change as the student works, and a test that reads them would
  break for reasons that have nothing to do with the tracer. Two fixtures: a hash-map
  `twoSum` traced on `nums = [3,2,4], target = 6`, expected to produce 16 steps ending in
  `["[i, obj[calc]]", "[2, obj[2]]", "[2, 1]"]`; and a counting `isAnagram` traced on
  `"cat"` / `"act"`, expected to produce 17 steps ending in `true`.
