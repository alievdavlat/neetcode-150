# Algorithm trace visualizer implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Record what a student's own solution did, step by step, and replay it beside the editor in the studio.

**Architecture:** The solution's TypeScript source is instrumented by text insertion at AST positions — never adding or removing a newline, so recorded line numbers point straight at the original file. The instrumented copy is written as `.ts` and imported by a worker that has already put the recorder on `globalThis.__t`; Node's own type stripping handles the annotations, so nothing is compiled. The trace path is a sibling of the run path: `run.mjs`, `worker.mjs`, `execute.mjs` and `run-problem.mjs` are not touched.

**Tech Stack:** Node 24 (type stripping, `node:test`, worker threads), the `typescript` package already in the workspace (AST only, no emit), Next.js 16 and React 19 for the studio.

**Spec:** [2026-09-17-algorithm-trace-visualizer-design.md](../specs/2026-09-17-algorithm-trace-visualizer-design.md)

---

## Proven up front

A spike validated the risky parts before this plan was written, on the hash-map `twoSum` with `nums = [3,2,4], target = 6`:

- Text insertion at AST positions keeps the line count identical (11 → 11).
- Node imports the instrumented `.ts` directly with `--experimental-strip-types`; no emit step.
- The recorder reached through `globalThis.__t` needs no injected import.
- The run produced `[2,1]` and exactly **16 steps**, which is the acceptance number below.

Two rules came out of the spike and are load-bearing:

1. A step marker is emitted as `;globalThis.__t.s(...)`, with a leading semicolon, because a statement may end without one (`const obj = {}`).
2. When two edits land on the same offset, closing wrappers must be applied before step markers. Edits carry a `rank` and are applied right-to-left by `(at, rank, insertion order)`.

## The `__t` runtime surface

Every task below uses these five calls. They are the whole contract between instrumenter and recorder.

| Call | Returns | Purpose |
| --- | --- | --- |
| `__t.v(id, value)` | `value` | A value site: statement initializer, condition, `return` argument, loop initializer |
| `__t.u(id, before, after)` | `undefined` | A loop incrementor, recording both sides |
| `__t.s(id, scope)` | `undefined` | Attaches the live variables to the step with this id |
| `__t.l(id, index, value)` | `value` | A substitution leaf inside a value site |
| `__t.x(id, name, key, write)` | `key` | An element access, for the `touched` list |

## File structure

| File | Responsibility |
| --- | --- |
| `tests/runner/trace/supported.mjs` | Decides from a signature whether a problem is traceable |
| `tests/runner/trace/recorder.mjs` | Value snapshots, step collection, chain assembly, step budget |
| `tests/runner/trace/instrument.mjs` | TypeScript source in, instrumented source plus meta out. Pure, no I/O |
| `tests/runner/trace/*.test.mjs` | `node:test` suites, colocated |
| `tests/runner/trace/fixtures/*.ts` | Acceptance fixtures, committed, never the live solution files |
| `studio/bridge/trace-worker.mjs` | Instruments, writes, imports, runs one case, posts the trace |
| `studio/bridge/trace.mjs` | Worker plus timeout, prints `TraceResult` as JSON |
| `studio/src/app/api/trace/route.ts` | `POST` endpoint |
| `studio/src/components/trace-stage.tsx` | Renders values: array cells, key→value rows, scalars |
| `studio/src/components/trace-expression.tsx` | Renders one step's substitution chain |
| `studio/src/components/trace-panel.tsx` | Transport controls and step state |

Modified: `studio/src/lib/types.ts`, `studio/src/server/problems.ts`, `studio/src/components/studio.tsx`, `studio/src/components/monaco-surface.tsx`, root `package.json`.

---

### Task 1: The traceability gate

**Files:**
- Create: `tests/runner/trace/supported.mjs`
- Create: `tests/runner/trace/supported.test.mjs`
- Modify: `package.json` (add the `test:trace` script)

- [ ] **Step 1: Add the test script**

In `package.json`, after the `"test:mem"` line:

```json
    "test:trace": "node --experimental-strip-types --disable-warning=ExperimentalWarning --test tests/runner/trace/*.test.mjs",
```

- [ ] **Step 2: Write the failing test**

Create `tests/runner/trace/supported.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { traceSupport } from './supported.mjs';

test('a function over numbers and arrays of them is traceable', () => {
  const signature = {
    kind: 'function',
    name: 'twoSum',
    params: [{ name: 'nums', type: 'number[]' }, { name: 'target', type: 'number' }],
    returns: '[number, number]',
  };
  assert.deepEqual(traceSupport(signature), { ok: true, reason: null });
});

test('a node argument is refused by name', () => {
  const signature = {
    kind: 'function',
    name: 'reverseList',
    params: [{ name: 'head', type: 'ListNode | null' }],
    returns: 'ListNode | null',
  };
  assert.equal(traceSupport(signature).ok, false);
  assert.match(traceSupport(signature).reason, /ListNode/);
});

test('a class problem is refused', () => {
  assert.equal(traceSupport({ kind: 'class', name: 'LRUCache' }).ok, false);
  assert.match(traceSupport({ kind: 'class', name: 'LRUCache' }).reason, /class/i);
});

test('an unsupported return type is refused even when the parameters are fine', () => {
  const signature = {
    kind: 'function',
    name: 'buildTree',
    params: [{ name: 'values', type: 'number[]' }],
    returns: 'TreeNode | null',
  };
  assert.equal(traceSupport(signature).ok, false);
  assert.match(traceSupport(signature).reason, /TreeNode/);
});
```

- [ ] **Step 3: Run it to watch it fail**

Run: `npm run test:trace`
Expected: FAIL, `Cannot find module './supported.mjs'`

- [ ] **Step 4: Write the implementation**

Create `tests/runner/trace/supported.mjs`:

```js
/**
 * Which problems the tracer can handle, read from the signature the stub
 * already declares. There is no hand-kept list of problem numbers: a problem
 * becomes traceable the moment its types are ones the stage can draw.
 */
const VALUE_TYPES = new Set([
  'number',
  'string',
  'boolean',
  'void',
  'number[]',
  'string[]',
  'boolean[]',
  'number[][]',
  'string[][]',
  '[number, number]',
]);

/** `number[] | null` and `number | undefined` are the array type with a nullable tail. */
const core = (type) =>
  type
    .split('|')
    .map((part) => part.trim())
    .filter((part) => part !== 'null' && part !== 'undefined')
    .join(' | ');

export function traceSupport(signature) {
  if (signature.kind !== 'function') {
    return { ok: false, reason: 'class problems are not traceable yet - only plain functions are' };
  }

  for (const param of signature.params ?? []) {
    const type = core(param.type);
    if (!VALUE_TYPES.has(type)) {
      return { ok: false, reason: `a ${type} argument is not traceable yet` };
    }
  }

  const returns = core(signature.returns ?? '');
  if (!VALUE_TYPES.has(returns)) {
    return { ok: false, reason: `a ${returns} result is not traceable yet` };
  }

  return { ok: true, reason: null };
}
```

- [ ] **Step 5: Run it to watch it pass**

Run: `npm run test:trace`
Expected: PASS, 4 tests

- [ ] **Step 6: Commit**

```bash
git add package.json tests/runner/trace/supported.mjs tests/runner/trace/supported.test.mjs
git commit -m "Add the tracer's traceability gate"
```

---

### Task 2: Value snapshots

**Files:**
- Create: `tests/runner/trace/recorder.mjs`
- Create: `tests/runner/trace/recorder.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `tests/runner/trace/recorder.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { snapshot } from './recorder.mjs';

test('numbers and booleans are scalars', () => {
  assert.deepEqual(snapshot(3), { t: 'scalar', text: '3' });
  assert.deepEqual(snapshot(true), { t: 'scalar', text: 'true' });
  assert.deepEqual(snapshot(undefined), { t: 'scalar', text: 'undefined' });
});

test('strings keep their quotes', () => {
  assert.deepEqual(snapshot('cat'), { t: 'scalar', text: "'cat'" });
});

test('an array becomes indexed items', () => {
  assert.deepEqual(snapshot([3, 2, 4]), { t: 'array', items: ['3', '2', '4'], truncated: false });
});

test('a typed array is an array too', () => {
  assert.deepEqual(snapshot(new Int32Array(2)), { t: 'array', items: ['0', '0'], truncated: false });
});

test('a plain object becomes key to value rows', () => {
  assert.deepEqual(snapshot({ 3: 0, 2: 1 }), {
    t: 'map',
    entries: [['2', '1'], ['3', '0']],
    truncated: false,
  });
});

test('a Map becomes rows as well', () => {
  assert.deepEqual(snapshot(new Map([['act', ['cat']]])), {
    t: 'map',
    entries: [['act', "['cat']"]],
    truncated: false,
  });
});

test('a long array is cut and says so', () => {
  const big = snapshot(Array.from({ length: 300 }, (_, i) => i));
  assert.equal(big.items.length, 200);
  assert.equal(big.truncated, true);
});

test('a long string is cut and says so', () => {
  const long = snapshot('x'.repeat(300));
  assert.equal(long.text.length <= 124, true);
  assert.match(long.text, /…/);
});
```

Note on the object test: JavaScript orders integer-like keys ascending, so `{ 3: 0, 2: 1 }` iterates as `2` then `3`. The expected rows are `[['2','1'], ['3','0']]`.

- [ ] **Step 2: Run it to watch it fail**

Run: `npm run test:trace`
Expected: FAIL, `Cannot find module './recorder.mjs'`

- [ ] **Step 3: Write the implementation**

Create `tests/runner/trace/recorder.mjs`:

```js
const MAX_ITEMS = 200;
const MAX_ENTRIES = 50;
const MAX_TEXT = 120;

const cut = (text) => (text.length > MAX_TEXT ? `${text.slice(0, MAX_TEXT - 1)}…` : text);

/** One line of text for a value sitting inside an array cell or a map row. */
export function show(value) {
  if (typeof value === 'string') return cut(`'${value}'`);
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'number' && !Number.isFinite(value)) return String(value);
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'object') {
    try {
      return cut(JSON.stringify(value));
    } catch {
      return cut(String(value));
    }
  }
  return cut(String(value));
}

const isIndexed = (value) => Array.isArray(value) || ArrayBuffer.isView(value);

/**
 * The shape the stage draws. Taken eagerly, because the point of a trace is the
 * value at that moment rather than the value at the end.
 */
export function snapshot(value) {
  if (isIndexed(value)) {
    const items = Array.from(value).slice(0, MAX_ITEMS).map(show);
    return { t: 'array', items, truncated: value.length > MAX_ITEMS };
  }

  if (value instanceof Map) {
    const all = [...value.entries()];
    return {
      t: 'map',
      entries: all.slice(0, MAX_ENTRIES).map(([key, item]) => [String(key), show(item)]),
      truncated: all.length > MAX_ENTRIES,
    };
  }

  if (value instanceof Set) {
    const all = [...value];
    return { t: 'array', items: all.slice(0, MAX_ITEMS).map(show), truncated: all.length > MAX_ITEMS };
  }

  if (value !== null && typeof value === 'object') {
    const all = Object.entries(value);
    return {
      t: 'map',
      entries: all.slice(0, MAX_ENTRIES).map(([key, item]) => [key, show(item)]),
      truncated: all.length > MAX_ENTRIES,
    };
  }

  return { t: 'scalar', text: show(value) };
}
```

- [ ] **Step 4: Run it to watch it pass**

Run: `npm run test:trace`
Expected: PASS, 12 tests

- [ ] **Step 5: Commit**

```bash
git add tests/runner/trace/recorder.mjs tests/runner/trace/recorder.test.mjs
git commit -m "Add value snapshots for the tracer"
```

---

### Task 3: Step collection, chains and the budget

**Files:**
- Modify: `tests/runner/trace/recorder.mjs`
- Modify: `tests/runner/trace/recorder.test.mjs`

- [ ] **Step 1: Write the failing test**

Append to `tests/runner/trace/recorder.test.mjs`:

```js
import { createRecorder, TraceBudgetExceeded } from './recorder.mjs';

const META = [
  { id: 0, kind: 'stmt', line: 4, text: 'target - nums[i]', changed: 'calc', leaves: [{ start: 0, end: 6 }, { start: 9, end: 16 }] },
  { id: 1, kind: 'loop-update', line: 3, text: 'i++', changed: 'i', op: '+', leaves: [] },
];

test('a value site builds a three part chain', () => {
  const { api, steps } = createRecorder(META);
  api.l(0, 0, 6);
  api.l(0, 1, 3);
  api.v(0, 3);
  api.s(0, { i: 0, calc: 3 });

  assert.equal(steps.length, 1);
  assert.deepEqual(steps[0].chain, ['target - nums[i]', '6 - 3', '3']);
  assert.equal(steps[0].line, 4);
  assert.equal(steps[0].changed, 'calc');
  assert.deepEqual(steps[0].vars, { i: { t: 'scalar', text: '0' }, calc: { t: 'scalar', text: '3' } });
});

test('a value site returns its value untouched', () => {
  const { api } = createRecorder(META);
  assert.equal(api.v(0, 42), 42);
  assert.equal(api.l(0, 0, 'cat'), 'cat');
});

test('an update records both sides', () => {
  const { api, steps } = createRecorder(META);
  api.u(1, 0, 1);
  assert.deepEqual(steps[0].chain, ['i++', '0 + 1', '1']);
  assert.equal(steps[0].kind, 'loop-update');
});

test('element accesses land in touched', () => {
  const { api, steps } = createRecorder(META);
  assert.equal(api.x(0, 'nums', 2, false), 2);
  api.v(0, 4);
  assert.deepEqual(steps[0].touched, [{ name: 'nums', key: 2, write: false }]);
});

test('the budget stops the run rather than the machine', () => {
  const { api } = createRecorder(META, { maxSteps: 2 });
  api.v(0, 1);
  api.v(0, 2);
  assert.throws(() => api.v(0, 3), TraceBudgetExceeded);
});
```

- [ ] **Step 2: Run it to watch it fail**

Run: `npm run test:trace`
Expected: FAIL, `createRecorder is not a function`

- [ ] **Step 3: Write the implementation**

Append to `tests/runner/trace/recorder.mjs`:

```js
export const MAX_STEPS = 20000;

export class TraceBudgetExceeded extends Error {
  constructor() {
    super('trace budget exceeded');
    this.name = 'TraceBudgetExceeded';
  }
}

/** Splice the recorded leaf values back over their own ranges, right to left. */
function substitute(entry, leaves) {
  let text = entry.text;
  for (let index = entry.leaves.length - 1; index >= 0; index -= 1) {
    const value = leaves[index];
    if (value === undefined) continue;
    const { start, end } = entry.leaves[index];
    text = text.slice(0, start) + value + text.slice(end);
  }
  return text;
}

/**
 * Collects what the instrumented copy reports. The five calls on `api` are the
 * whole contract with the instrumenter; everything else here is bookkeeping.
 */
export function createRecorder(meta, { maxSteps = MAX_STEPS } = {}) {
  const steps = [];
  const pending = new Map();
  let lastId = null;

  const buffer = (id) => {
    if (!pending.has(id)) pending.set(id, { leaves: [], touched: [] });
    return pending.get(id);
  };

  const push = (step) => {
    if (steps.length >= maxSteps) throw new TraceBudgetExceeded();
    steps.push(step);
    return step;
  };

  const emit = (id, chain) => {
    const entry = meta[id];
    const held = buffer(id);
    pending.delete(id);
    lastId = id;
    return push({
      line: entry.line,
      kind: entry.kind,
      chain,
      vars: {},
      changed: entry.changed ?? null,
      touched: held.touched,
    });
  };

  const api = {
    l: (id, index, value) => {
      buffer(id).leaves[index] = show(value);
      return value;
    },

    x: (id, name, key, write) => {
      buffer(id).touched.push({ name, key, write });
      return key;
    },

    v: (id, value) => {
      const entry = meta[id];
      const chain = [entry.text];
      const filled = substitute(entry, buffer(id).leaves);
      if (filled !== chain.at(-1)) chain.push(filled);
      const result = show(value);
      if (result !== chain.at(-1)) chain.push(result);
      emit(id, chain);
      return value;
    },

    u: (id, before, after) => {
      const entry = meta[id];
      emit(id, [entry.text, `${show(before)} ${entry.op} 1`, show(after)]);
    },

    s: (id, scope) => {
      const entry = meta[id];
      const target = lastId === id ? steps.at(-1) : emit(id, [entry.text]);
      target.vars = Object.fromEntries(Object.entries(scope).map(([name, value]) => [name, snapshot(value)]));
    },
  };

  return { api, steps };
}
```

- [ ] **Step 4: Run it to watch it pass**

Run: `npm run test:trace`
Expected: PASS, 17 tests

- [ ] **Step 5: Commit**

```bash
git add tests/runner/trace/recorder.mjs tests/runner/trace/recorder.test.mjs
git commit -m "Collect steps, chains and the budget in the tracer"
```

---

### Task 4: Instrumenter scaffolding

Parse, apply edits right to left, and prove the line count never moves. No steps are emitted yet.

**Files:**
- Create: `tests/runner/trace/instrument.mjs`
- Create: `tests/runner/trace/instrument.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `tests/runner/trace/instrument.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { instrument } from './instrument.mjs';

const SOURCE = `export function twoSum(nums: number[], target: number): [number, number] {
  const obj: Record<string, number> = {}
  for (let i = 0; i < nums.length; i++) {
    const calc = target - nums[i];
    if (calc in obj) return [i, obj[calc]];
    obj[nums[i]] = i;
  }

  return [-1, -1];
}
`;

const lines = (text) => text.split('\n').length;

test('the line count never moves', () => {
  const { code } = instrument(SOURCE, { functionName: 'twoSum' });
  assert.equal(lines(code), lines(SOURCE));
});

test('no inserted text carries a newline', () => {
  const { code } = instrument(SOURCE, { functionName: 'twoSum' });
  for (const [index, line] of code.split('\n').entries()) {
    const original = SOURCE.split('\n')[index];
    assert.equal(line.startsWith(original.slice(0, 2)), true, `line ${index + 1} lost its indent`);
  }
});

test('an unknown function name is refused', () => {
  assert.throws(() => instrument(SOURCE, { functionName: 'nope' }), /nope/);
});
```

- [ ] **Step 2: Run it to watch it fail**

Run: `npm run test:trace`
Expected: FAIL, `Cannot find module './instrument.mjs'`

- [ ] **Step 3: Write the implementation**

Create `tests/runner/trace/instrument.mjs`:

```js
import ts from 'typescript';

/**
 * Instrument a solution by inserting text at AST positions. Nothing is emitted
 * or reprinted: every insertion is newline-free, so the instrumented copy has
 * the same lines as the file the student is looking at and a recorded line
 * number needs no mapping.
 *
 * The recorder is reached through `globalThis.__t`, which the worker sets
 * before importing the copy - that way no import has to be injected into a file
 * whose first line is a doc comment.
 */
export function instrument(source, { functionName }) {
  const file = ts.createSourceFile('solution.ts', source, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);

  const fn = file.statements.find(
    (node) => ts.isFunctionDeclaration(node) && node.name?.text === functionName,
  );
  if (!fn) throw new Error(`no exported function named ${functionName} in this file`);

  const meta = [];
  const edits = [];

  const context = {
    file,
    source,
    meta,
    edits,
    lineOf: (pos) => file.getLineAndCharacterOfPosition(pos).line + 1,
    textOf: (node) => source.slice(node.getStart(file), node.getEnd()),
    oneLine: (node) =>
      file.getLineAndCharacterOfPosition(node.getStart(file)).line ===
      file.getLineAndCharacterOfPosition(node.getEnd()).line,
    insert: (at, text, rank = 0) => {
      if (text.includes('\n')) throw new Error('an insertion may not contain a newline');
      edits.push({ at, text, rank, order: edits.length });
    },
  };

  walk(context, fn);

  let code = source;
  const ordered = [...edits].sort((a, b) => b.at - a.at || b.rank - a.rank || b.order - a.order);
  for (const edit of ordered) code = code.slice(0, edit.at) + edit.text + code.slice(edit.at);

  return { code, meta };
}

/** Filled in by the next tasks. */
function walk() {}
```

- [ ] **Step 4: Run it to watch it pass**

Run: `npm run test:trace`
Expected: PASS, 20 tests

- [ ] **Step 5: Commit**

```bash
git add tests/runner/trace/instrument.mjs tests/runner/trace/instrument.test.mjs
git commit -m "Add the tracer's instrumenter scaffolding"
```

---

### Task 5: Statement steps and scope tracking

**Files:**
- Modify: `tests/runner/trace/instrument.mjs`
- Modify: `tests/runner/trace/instrument.test.mjs`

- [ ] **Step 1: Write the failing test**

Append to `tests/runner/trace/instrument.test.mjs`:

```js
const SIMPLE = `export function count(nums: number[]): number {
  let total = 0;
  total = total + nums.length;
  return total;
}
`;

test('each statement gets a step marker carrying the live scope', () => {
  const { code, meta } = instrument(SIMPLE, { functionName: 'count' });

  assert.match(code, /globalThis\.__t\.s\(0,\{nums,total\}\)/);
  assert.match(code, /globalThis\.__t\.s\(1,\{nums,total\}\)/);
  assert.equal(meta[0].kind, 'stmt');
  assert.equal(meta[0].line, 2);
  assert.equal(meta[0].changed, 'total');
  assert.equal(meta[1].changed, 'total');
});

test('a step marker starts with a semicolon so a missing one cannot bite', () => {
  const { code } = instrument(SIMPLE, { functionName: 'count' });
  assert.match(code, /;globalThis\.__t\.s\(/);
});

test('a block scoped name is out of scope after its block', () => {
  const source = `export function f(n: number): number {
  for (let i = 0; i < n; i++) {
    const double = i * 2;
  }
  return n;
}
`;
  const { code } = instrument(source, { functionName: 'f' });
  assert.match(code, /globalThis\.__t\.s\(\d+,\{n,i,double\}\)/);
  assert.equal(/globalThis\.__t\.s\(\d+,\{n,double/.test(code), false);
});
```

- [ ] **Step 2: Run it to watch it fail**

Run: `npm run test:trace`
Expected: FAIL, no `__t.s` in the output

- [ ] **Step 3: Write the implementation**

In `tests/runner/trace/instrument.mjs`, replace the placeholder `walk` with:

```js
const declaredName = (statement) => {
  if (ts.isVariableStatement(statement)) {
    const declaration = statement.declarationList.declarations[0];
    return ts.isIdentifier(declaration.name) ? declaration.name.text : null;
  }

  const expression = statement.expression;
  if (ts.isBinaryExpression(expression) && expression.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
    return rootName(expression.left);
  }
  if (ts.isPostfixUnaryExpression(expression) || ts.isPrefixUnaryExpression(expression)) {
    return rootName(expression.operand);
  }
  return null;
};

/** `obj[nums[i]]` changes `obj`, not `nums`. */
function rootName(node) {
  let current = node;
  while (ts.isElementAccessExpression(current) || ts.isPropertyAccessExpression(current)) {
    current = current.expression;
  }
  return ts.isIdentifier(current) ? current.text : null;
}

function record(context, kind, node, extra = {}) {
  const id = context.meta.length;
  context.meta.push({
    id,
    kind,
    line: context.lineOf(node.getStart(context.file)),
    text: context.textOf(node),
    changed: null,
    leaves: [],
    ...extra,
  });
  return id;
}

/** Wrap a value-producing node so the recorder sees its result. */
function wrapValue(context, id, node) {
  context.insert(node.getStart(context.file), `globalThis.__t.v(${id},`, 2);
  context.insert(node.getEnd(), ')', 2);
}

function walk(context, fn) {
  const scope = fn.parameters.filter((p) => ts.isIdentifier(p.name)).map((p) => p.name.text);
  walkBlock(context, fn.body, scope);
}

function walkBlock(context, block, inherited) {
  let live = [...inherited];

  for (const statement of block.statements) {
    if (ts.isVariableStatement(statement)) {
      const declaration = statement.declarationList.declarations[0];
      const id = record(context, 'stmt', statement, { changed: declaredName(statement) });
      if (declaration.initializer && context.oneLine(declaration.initializer)) {
        context.meta[id].text = context.textOf(declaration.initializer);
        wrapValue(context, id, declaration.initializer);
      }
      if (ts.isIdentifier(declaration.name)) live = [...live, declaration.name.text];
      context.insert(statement.getEnd(), `;globalThis.__t.s(${id},{${live.join(',')}});`, 1);
      continue;
    }

    if (ts.isExpressionStatement(statement)) {
      const id = record(context, 'stmt', statement, { changed: declaredName(statement) });
      context.meta[id].text = context.textOf(statement.expression);
      if (context.oneLine(statement.expression)) wrapValue(context, id, statement.expression);
      context.insert(statement.getEnd(), `;globalThis.__t.s(${id},{${live.join(',')}});`, 1);
      continue;
    }

    walkControl(context, statement, live);
  }
}

/** Filled in by the next task. */
function walkControl() {}
```

- [ ] **Step 4: Run it to watch it pass**

Run: `npm run test:trace`
Expected: PASS, 23 tests

- [ ] **Step 5: Commit**

```bash
git add tests/runner/trace/instrument.mjs tests/runner/trace/instrument.test.mjs
git commit -m "Instrument statements with their live scope"
```

---

### Task 6: Loops, conditions and returns

**Files:**
- Modify: `tests/runner/trace/instrument.mjs`
- Modify: `tests/runner/trace/instrument.test.mjs`

- [ ] **Step 1: Write the failing test**

Append to `tests/runner/trace/instrument.test.mjs`:

```js
test('a for loop is three separate sites', () => {
  const { code, meta } = instrument(SOURCE, { functionName: 'twoSum' });
  const kinds = meta.map((entry) => entry.kind);

  assert.equal(kinds.includes('loop-init'), true);
  assert.equal(kinds.includes('loop-cond'), true);
  assert.equal(kinds.includes('loop-update'), true);

  const update = meta.find((entry) => entry.kind === 'loop-update');
  assert.equal(update.text, 'i++');
  assert.equal(update.op, '+');
  assert.match(code, new RegExp(`globalThis\\.__t\\.u\\(${update.id},i\\+\\+,i\\)`));
});

test('an if condition and a return are their own sites', () => {
  const { meta } = instrument(SOURCE, { functionName: 'twoSum' });
  const cond = meta.find((entry) => entry.kind === 'cond');
  const ret = meta.filter((entry) => entry.kind === 'return');

  assert.equal(cond.text, 'calc in obj');
  assert.equal(cond.line, 5);
  assert.deepEqual(ret.map((entry) => entry.text), ['[i, obj[calc]]', '[-1, -1]']);
});

test('a while loop records its condition', () => {
  const source = `export function f(n: number): number {
  while (n > 0) {
    n = n - 1;
  }
  return n;
}
`;
  const { meta } = instrument(source, { functionName: 'f' });
  const cond = meta.find((entry) => entry.kind === 'loop-cond');
  assert.equal(cond.text, 'n > 0');
});
```

- [ ] **Step 2: Run it to watch it fail**

Run: `npm run test:trace`
Expected: FAIL, no `loop-init` in the meta

- [ ] **Step 3: Write the implementation**

In `tests/runner/trace/instrument.mjs`, replace the placeholder `walkControl` with:

```js
const bodyOf = (statement) => (ts.isBlock(statement) ? statement : { statements: [statement] });

function walkControl(context, statement, live) {
  if (ts.isForStatement(statement)) {
    let inner = [...live];

    if (statement.initializer && ts.isVariableDeclarationList(statement.initializer)) {
      const declaration = statement.initializer.declarations[0];
      if (declaration.initializer) {
        const id = record(context, 'loop-init', declaration.initializer, {
          changed: ts.isIdentifier(declaration.name) ? declaration.name.text : null,
        });
        wrapValue(context, id, declaration.initializer);
      }
      if (ts.isIdentifier(declaration.name)) inner = [...inner, declaration.name.text];
    }

    if (statement.condition) {
      const id = record(context, 'loop-cond', statement.condition);
      wrapValue(context, id, statement.condition);
    }

    if (statement.incrementor) {
      const counter = rootName(statement.incrementor);
      const op = statement.incrementor.operator === ts.SyntaxKind.MinusMinusToken ? '-' : '+';
      const id = record(context, 'loop-update', statement.incrementor, { changed: counter, op });
      context.insert(statement.incrementor.getStart(context.file), `globalThis.__t.u(${id},`, 2);
      context.insert(statement.incrementor.getEnd(), `,${counter})`, 2);
    }

    walkBlock(context, bodyOf(statement.statement), inner);
    return;
  }

  if (ts.isWhileStatement(statement) || ts.isDoStatement(statement)) {
    const id = record(context, 'loop-cond', statement.expression);
    wrapValue(context, id, statement.expression);
    walkBlock(context, bodyOf(statement.statement), live);
    return;
  }

  if (ts.isIfStatement(statement)) {
    const id = record(context, 'cond', statement.expression);
    wrapValue(context, id, statement.expression);
    walkBlock(context, bodyOf(statement.thenStatement), live);
    if (statement.elseStatement) walkBlock(context, bodyOf(statement.elseStatement), live);
    return;
  }

  if (ts.isReturnStatement(statement) && statement.expression && context.oneLine(statement.expression)) {
    const id = record(context, 'return', statement.expression);
    wrapValue(context, id, statement.expression);
    return;
  }

  if (ts.isBlock(statement)) walkBlock(context, statement, live);
}
```

- [ ] **Step 4: Run it to watch it pass**

Run: `npm run test:trace`
Expected: PASS, 26 tests

- [ ] **Step 5: Commit**

```bash
git add tests/runner/trace/instrument.mjs tests/runner/trace/instrument.test.mjs
git commit -m "Instrument loop control, conditions and returns"
```

---

### Task 7: Substitution leaves and touched cells

**Files:**
- Modify: `tests/runner/trace/instrument.mjs`
- Modify: `tests/runner/trace/instrument.test.mjs`

- [ ] **Step 1: Write the failing test**

Append to `tests/runner/trace/instrument.test.mjs`:

```js
test('the leaves of a value site are wrapped and their ranges recorded', () => {
  const { code, meta } = instrument(SOURCE, { functionName: 'twoSum' });
  const calc = meta.find((entry) => entry.text === 'target - nums[i]');

  assert.deepEqual(
    calc.leaves.map((leaf) => calc.text.slice(leaf.start, leaf.end)),
    ['target', 'nums[i]'],
  );
  assert.match(code, new RegExp(`globalThis\\.__t\\.l\\(${calc.id},0,target\\)`));
});

test('an element access reports the array it touched', () => {
  const { code, meta } = instrument(SOURCE, { functionName: 'twoSum' });
  const calc = meta.find((entry) => entry.text === 'target - nums[i]');
  assert.match(code, new RegExp(`globalThis\\.__t\\.x\\(${calc.id},"nums",`));
});

test('a write is marked as a write', () => {
  const { code, meta } = instrument(SOURCE, { functionName: 'twoSum' });
  const write = meta.find((entry) => entry.text === 'obj[nums[i]] = i');
  assert.match(code, new RegExp(`globalThis\\.__t\\.x\\(${write.id},"obj",.*,true\\)`));
});

test('an assignment target is never wrapped as a leaf', () => {
  const { code } = instrument(SOURCE, { functionName: 'twoSum' });
  assert.equal(/globalThis\.__t\.l\([^)]*\)\s*=/.test(code), false, 'a call ended up on the left of =');
});

test('a counter target is never wrapped as a leaf either', () => {
  const source = `export function f(n: number): number {
  let total = 0;
  total = total + n;
  return total;
}
`;
  const { code } = instrument(source, { functionName: 'f' });
  assert.equal(/globalThis\.__t\.l\([^)]*\)\s*=/.test(code), false);
  assert.match(code, /=\s*globalThis\.__t\.l\(\d+,\d+,total\)/);
});
```

- [ ] **Step 2: Run it to watch it fail**

Run: `npm run test:trace`
Expected: FAIL, `calc.leaves` is empty

- [ ] **Step 3: Write the implementation**

In `tests/runner/trace/instrument.mjs`, replace `wrapValue` with the version below and add `wrapLeaves`:

```js
/** Wrap a value-producing node, plus the leaves that make its substitution readable. */
function wrapValue(context, id, node) {
  context.insert(node.getStart(context.file), `globalThis.__t.v(${id},`, 2);
  context.insert(node.getEnd(), ')', 2);
  wrapLeaves(context, id, node);
}

const isLeaf = (node) =>
  ts.isIdentifier(node) || ts.isElementAccessExpression(node) || ts.isPropertyAccessExpression(node);

/**
 * `obj[k] = v` must not become `__t.l(id,0,obj[k]) = v` - that is a call on the
 * left of an assignment, which will not parse. Assignment targets are visited
 * for their element accesses but never wrapped as leaves.
 */
const isAssignTarget = (node) => {
  const parent = node.parent;
  if (!parent) return false;
  if (ts.isBinaryExpression(parent) && parent.left === node && parent.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
    return true;
  }
  return ts.isPostfixUnaryExpression(parent) || ts.isPrefixUnaryExpression(parent);
};

/**
 * A leaf is the outermost readable piece of an expression: `nums[i]` is a leaf,
 * the `i` inside it is not, or the substituted text would nest into itself. The
 * index is still wrapped separately, for `touched` rather than for the chain.
 */
function wrapLeaves(context, id, root) {
  const entry = context.meta[id];
  const base = root.getStart(context.file);

  const visit = (node, insideLeaf) => {
    if (ts.isElementAccessExpression(node)) {
      const name = rootName(node.expression);
      const write =
        ts.isBinaryExpression(node.parent) &&
        node.parent.left === node &&
        node.parent.operatorToken.kind === ts.SyntaxKind.EqualsToken;
      if (name) {
        context.insert(node.argumentExpression.getStart(context.file), `globalThis.__t.x(${id},"${name}",`, 3);
        context.insert(node.argumentExpression.getEnd(), `,${write})`, 3);
      }
    }

    if (!insideLeaf && isLeaf(node) && node !== root && !isAssignTarget(node)) {
      const index = entry.leaves.length;
      entry.leaves.push({ start: node.getStart(context.file) - base, end: node.getEnd() - base });
      context.insert(node.getStart(context.file), `globalThis.__t.l(${id},${index},`, 4);
      context.insert(node.getEnd(), ')', 4);
      node.forEachChild((child) => visit(child, true));
      return;
    }

    node.forEachChild((child) => visit(child, insideLeaf));
  };

  root.forEachChild((child) => visit(child, false));
}
```

Ranks matter here: the value wrapper is rank 2, element-access wrappers rank 3, leaf wrappers rank 4. At a shared offset the highest rank ends up innermost, which is what keeps `__t.v(__t.l(...))` nesting in the right order.

- [ ] **Step 4: Run it to watch it pass**

Run: `npm run test:trace`
Expected: PASS, 29 tests

- [ ] **Step 5: Commit**

```bash
git add tests/runner/trace/instrument.mjs tests/runner/trace/instrument.test.mjs
git commit -m "Record substitution leaves and touched cells"
```

---

### Task 8: End-to-end acceptance against fixtures

Fixtures are committed with the tests and never read from the student's live files, which change as they work.

**Files:**
- Create: `tests/runner/trace/fixtures/two-sum.ts`
- Create: `tests/runner/trace/fixtures/valid-anagram.ts`
- Create: `tests/runner/trace/acceptance.test.mjs`

- [ ] **Step 1: Write the fixtures**

Create `tests/runner/trace/fixtures/two-sum.ts`:

```ts
export function twoSum(nums: number[], target: number): [number, number] {
  const obj: Record<string, number> = {}
  for (let i = 0; i < nums.length; i++) {
    const calc = target - nums[i];
    if (calc in obj) return [i, obj[calc]];
    obj[nums[i]] = i;
  }

  return [-1, -1];
}
```

Create `tests/runner/trace/fixtures/valid-anagram.ts`:

```ts
export function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const freq: number[] = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    freq[s.charCodeAt(i) - 97]++;
    freq[t.charCodeAt(i) - 97]--;
  }

  return freq.every((count) => count === 0);
}
```

- [ ] **Step 2: Write the failing test**

Create `tests/runner/trace/acceptance.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { instrument } from './instrument.mjs';
import { createRecorder } from './recorder.mjs';

const HERE = new URL('./', import.meta.url);

/** Instrument a fixture, run it once, and hand back the steps and the result. */
async function trace(fixture, functionName, args) {
  const source = await readFile(new URL(`fixtures/${fixture}`, HERE), 'utf8');
  const { code, meta } = instrument(source, { functionName });

  const dir = new URL('.tmp/', HERE);
  await mkdir(dir, { recursive: true });
  const target = new URL(`${fixture.replace('.ts', '')}-${Date.now()}.ts`, dir);
  await writeFile(target, code, 'utf8');

  const { api, steps } = createRecorder(meta);
  globalThis.__t = api;
  try {
    const module = await import(target.href);
    const result = module[functionName](...args);
    return { steps, result, meta };
  } finally {
    delete globalThis.__t;
    await rm(target, { force: true });
  }
}

test('the hash map two sum produces sixteen steps and the right pair', async () => {
  const { steps, result } = await trace('two-sum.ts', 'twoSum', [[3, 2, 4], 6]);

  assert.deepEqual(result, [2, 1]);
  assert.equal(steps.length, 16);
  assert.deepEqual(steps.at(-1).chain, ['[i, obj[calc]]', '[2, 1]', '[2,1]']);
  assert.equal(steps.at(-1).kind, 'return');
});

test('the counting anagram produces seventeen steps and passes', async () => {
  const { steps, result } = await trace('valid-anagram.ts', 'isAnagram', ['cat', 'act']);

  assert.equal(result, true);
  assert.equal(steps.length, 17);
  assert.equal(steps.at(-1).chain.at(-1), 'true');
});

test('every step points at a line the fixture actually has', async () => {
  const source = await readFile(new URL('fixtures/two-sum.ts', HERE), 'utf8');
  const total = source.split('\n').length;
  const { steps } = await trace('two-sum.ts', 'twoSum', [[3, 2, 4], 6]);

  for (const step of steps) {
    assert.equal(step.line >= 1 && step.line <= total, true, `line ${step.line} is out of range`);
  }
});

test('a loop counter is visible changing across the trace', async () => {
  const { steps } = await trace('two-sum.ts', 'twoSum', [[3, 2, 4], 6]);
  const counters = steps.filter((step) => step.kind === 'loop-update').map((step) => step.chain.at(-1));
  assert.deepEqual(counters, ['1', '2']);
});
```

- [ ] **Step 3: Run it to watch it fail or pass**

Run: `npm run test:trace`
Expected: the step counts are the point of this task. If a count differs, fix the instrumenter rather than the expectation — 16 and 12 were measured from a working spike.

- [ ] **Step 4: Add the temp directory to git's ignore list**

Append to `.gitignore` at the workspace root:

```
tests/runner/trace/.tmp/
```

- [ ] **Step 5: Commit**

```bash
git add .gitignore tests/runner/trace/fixtures tests/runner/trace/acceptance.test.mjs
git commit -m "Pin the tracer's behaviour with end-to-end fixtures"
```

---

### Task 9: The bridge

**Files:**
- Create: `studio/bridge/trace-worker.mjs`
- Create: `studio/bridge/trace.mjs`

- [ ] **Step 1: Write the worker**

Create `studio/bridge/trace-worker.mjs`:

```js
import { parentPort, workerData } from 'node:worker_threads';
import { mkdir, writeFile } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import { loadProblems } from '../../tests/runner/derive-cases.mjs';
import { prepare } from '../../tests/runner/discover.mjs';
import { instrument } from '../../tests/runner/trace/instrument.mjs';
import { createRecorder, TraceBudgetExceeded, show } from '../../tests/runner/trace/recorder.mjs';
import { traceSupport } from '../../tests/runner/trace/supported.mjs';

const { number, variant, caseIndex, file } = workerData;
const ROOT = new URL('../../', import.meta.url);

const shell = (status, message, extra = {}) => ({
  number,
  variant,
  caseIndex,
  status,
  message,
  args: [],
  expect: null,
  result: null,
  steps: [],
  truncated: false,
  source: '',
  ...extra,
});

const problem = (await loadProblems()).find((entry) => entry.number === number);
if (!problem) {
  parentPort.postMessage(shell('unsupported', `no problem numbered ${number}`));
} else {
  const support = traceSupport(problem.signature);
  if (!support.ok) {
    parentPort.postMessage(shell('unsupported', support.reason));
  } else {
    const target = file ? { ...problem, file } : problem;
    const prepared = await prepare(target);
    const testCase = prepared.cases?.[caseIndex];

    if (prepared.status === 'missing' || prepared.status === 'load-error') {
      parentPort.postMessage(shell('uninstrumentable', prepared.error?.message ?? 'the file could not be loaded'));
    } else if (!testCase) {
      parentPort.postMessage(shell('unsupported', 'this problem has no runnable case to trace'));
    } else {
      const source = await readFile(new URL(target.file, ROOT), 'utf8');
      let instrumented;
      try {
        instrumented = instrument(source, { functionName: variant });
      } catch (error) {
        parentPort.postMessage(shell('uninstrumentable', error.message, { source }));
        throw error;
      }

      const dir = new URL('studio/.studio/trace/', ROOT);
      await mkdir(dir, { recursive: true });
      const copy = new URL(`${number}-${variant}-${Date.now()}.ts`, dir);
      await writeFile(copy, instrumented.code, 'utf8');

      const { api, steps } = createRecorder(instrumented.meta);
      globalThis.__t = api;

      const args = testCase.args.map((arg) =>
        typeof arg === 'object' && arg !== null ? structuredClone(arg) : arg,
      );

      let status = 'ok';
      let message = null;
      let result = null;
      let truncated = false;

      try {
        const module = await import(copy.href);
        result = show(module[variant](...args));
      } catch (error) {
        if (error instanceof TraceBudgetExceeded) truncated = true;
        else {
          status = 'threw';
          message = error.message;
        }
      } finally {
        delete globalThis.__t;
      }

      parentPort.postMessage({
        number,
        variant,
        caseIndex,
        status,
        message,
        args: args.map(show),
        expect: testCase.expect === undefined ? null : show(testCase.expect),
        result,
        steps,
        truncated,
        source,
      });
    }
  }
}
```

- [ ] **Step 2: Write the bridge script**

Create `studio/bridge/trace.mjs`, mirroring `run.mjs`:

```js
import { Worker } from 'node:worker_threads';

/**
 * Trace one case of one variant and print the result as JSON. A worker keeps an
 * endless loop out of the dev server, exactly as the run bridge does.
 */
const WORKER = new URL('./trace-worker.mjs', import.meta.url);
const TIMEOUT_MS = 15000;

const [number, variant, index, ...flags] = process.argv.slice(2);
const fileFlag = flags.indexOf('--file');
const file = fileFlag === -1 ? null : flags[fileFlag + 1];

const workerArgv = () =>
  process.execArgv.filter((flag) => !flag.startsWith('--expose') && !flag.startsWith('--max-old'));

const outcome = await new Promise((resolve) => {
  const worker = new Worker(WORKER, {
    workerData: { number, variant, caseIndex: Number(index), file },
    execArgv: workerArgv(),
  });

  const timer = setTimeout(() => {
    worker.terminate();
    resolve({ status: 'stalled', message: `no answer after ${TIMEOUT_MS}ms` });
  }, TIMEOUT_MS);

  worker.on('message', (trace) => {
    clearTimeout(timer);
    resolve(trace);
  });

  worker.on('error', (error) => {
    clearTimeout(timer);
    resolve({ status: 'crashed', message: error.message });
  });
});

process.stdout.write(
  JSON.stringify({
    number,
    variant,
    caseIndex: Number(index),
    args: [],
    expect: null,
    result: null,
    steps: [],
    truncated: false,
    source: '',
    ...outcome,
  }),
);
```

- [ ] **Step 3: Run it by hand against a real problem**

```bash
node --experimental-strip-types --disable-warning=ExperimentalWarning studio/bridge/trace.mjs 003 twoSum 0
```

Expected: one line of JSON with `"status":"ok"` and a non-empty `steps` array. If the live `003` holds the `indexOf` solution, the step count will differ from the fixture's 16 — that is correct, the trace follows whatever is in the file.

- [ ] **Step 4: Commit**

```bash
git add studio/bridge/trace.mjs studio/bridge/trace-worker.mjs
git commit -m "Add the trace bridge"
```

---

### Task 10: Types, server and endpoint

**Files:**
- Modify: `studio/src/lib/types.ts`
- Modify: `studio/src/server/problems.ts`
- Create: `studio/src/app/api/trace/route.ts`

- [ ] **Step 1: Add the types**

Append to `studio/src/lib/types.ts`:

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

- [ ] **Step 2: Add the server call**

In `studio/src/server/problems.ts`, add next to `runProblem`:

```ts
/** Trace one case of one variant. The run path is untouched; this is a sibling. */
export async function traceProblem(
  number: string,
  variant: string,
  caseIndex: number,
  mode: SourceMode = 'file',
): Promise<TraceResult> {
  const problems = await getProblems();
  const problem = problems.find((entry) => entry.number === number);
  if (!problem) throw new Error(`no problem numbered ${number}`);

  const args = [number, variant, String(caseIndex)];
  if (mode === 'scratch') args.push('--file', problemPath(problem.file, 'scratch'));

  return runBridge<TraceResult>({ script: 'trace.mjs', args, timeoutMs: 30000 });
}
```

This mirrors `runProblem` line for line — same `getProblems()` lookup, same `problemPath(problem.file, 'scratch')` call. Add `TraceResult` to the existing `@/lib/types` import at the top of the file.

- [ ] **Step 3: Add the endpoint**

Create `studio/src/app/api/trace/route.ts`:

```ts
import { fail, modeOf, ok } from '@/server/http';
import { traceProblem } from '@/server/problems';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    number?: string;
    variant?: string;
    caseIndex?: number;
    mode?: string;
  } | null;

  if (!body?.number || !/^\d{3}$/.test(body.number)) return fail('a three digit problem number is required');
  if (!body.variant || !/^[A-Za-z_$][\w$]*$/.test(body.variant)) return fail('a variant name is required');

  const index = Number.isInteger(body.caseIndex) && body.caseIndex! >= 0 ? body.caseIndex! : 0;

  try {
    return ok({ trace: await traceProblem(body.number, body.variant, index, modeOf(body.mode)) });
  } catch (error) {
    return fail(error, 500);
  }
}
```

- [ ] **Step 4: Check the types and the endpoint**

```bash
node --experimental-strip-types --disable-warning=ExperimentalWarning studio/bridge/trace.mjs 003 twoSum 0
```

Expected: JSON as in Task 9. Then start the studio and:

```bash
curl -s -X POST http://localhost:3150/api/trace -H "Content-Type: application/json" -d '{"number":"003","variant":"twoSum","caseIndex":0,"mode":"file"}'
```

Expected: `"status":"ok"` with steps.

- [ ] **Step 5: Commit**

```bash
git add studio/src/lib/types.ts studio/src/server/problems.ts studio/src/app/api/trace/route.ts
git commit -m "Expose the trace over an endpoint"
```

---

### Task 11: The stage and the expression chain

**Files:**
- Create: `studio/src/components/trace-stage.tsx`
- Create: `studio/src/components/trace-expression.tsx`

- [ ] **Step 1: Write the stage**

Create `studio/src/components/trace-stage.tsx`:

```tsx
'use client';

import type { TraceStep, TraceValue } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TraceStageProps {
  step: TraceStep;
}

const touchedKey = (step: TraceStep, name: string, key: string | number) =>
  step.touched.find((entry) => entry.name === name && String(entry.key) === String(key));

function renderValue(name: string, value: TraceValue, step: TraceStep, changed: boolean) {
  if (value.t === 'array') {
    return (
      <div className="flex flex-wrap gap-1">
        {value.items.map((item, index) => {
          const hit = touchedKey(step, name, index);
          return (
            <div
              key={index}
              className={cn(
                'flex w-12 flex-col items-center rounded-md border px-1 py-1 font-mono text-[11px]',
                hit?.write ? 'border-medium/60 bg-medium/10' : hit ? 'border-cool/60 bg-cool/10' : 'border-line',
              )}
            >
              <span className="text-foreground/90">{item}</span>
              <span className="text-[10px] text-muted-foreground">{index}</span>
            </div>
          );
        })}
        {value.truncated && <span className="self-center text-[11px] text-muted-foreground">…</span>}
      </div>
    );
  }

  if (value.t === 'map') {
    if (value.entries.length === 0) {
      return <p className="font-mono text-[11px] text-muted-foreground">empty</p>;
    }
    return (
      <div className="space-y-0.5">
        {value.entries.map(([key, item]) => (
          <div
            key={key}
            className={cn(
              'flex gap-2 rounded px-1.5 py-0.5 font-mono text-[11px]',
              touchedKey(step, name, key) && 'bg-cool/10',
            )}
          >
            <span className="text-foreground/90">{key}</span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="text-foreground/70">{item}</span>
          </div>
        ))}
        {value.truncated && <span className="text-[11px] text-muted-foreground">…</span>}
      </div>
    );
  }

  return (
    <span className={cn('font-mono text-[11px]', changed ? 'text-foreground' : 'text-foreground/70')}>
      {value.text}
    </span>
  );
}

export function TraceStage({ step }: TraceStageProps) {
  const names = Object.keys(step.vars);

  if (names.length === 0) {
    return <p className="text-[11px] text-muted-foreground">no variables in scope here</p>;
  }

  return (
    <dl className="space-y-2">
      {names.map((name) => (
        <div
          key={name}
          className={cn('rounded-lg px-2 py-1.5', step.changed === name && 'bg-medium/[0.07]')}
        >
          <dt className="mb-1 font-mono text-[10px] tracking-wide text-muted-foreground">{name}</dt>
          <dd>{renderValue(name, step.vars[name], step, step.changed === name)}</dd>
        </div>
      ))}
    </dl>
  );
}
```

- [ ] **Step 2: Write the expression chain**

Create `studio/src/components/trace-expression.tsx`:

```tsx
'use client';

import type { TraceKind, TraceStep } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TraceExpressionProps {
  step: TraceStep;
}

const LABEL: Record<TraceKind, string> = {
  stmt: 'statement',
  'loop-init': 'loop start',
  'loop-cond': 'loop test',
  'loop-update': 'loop step',
  cond: 'test',
  return: 'return',
};

const TONE: Record<TraceKind, string> = {
  stmt: 'border-cool/40 text-cool',
  'loop-init': 'border-medium/40 text-medium',
  'loop-cond': 'border-medium/40 text-medium',
  'loop-update': 'border-medium/40 text-medium',
  cond: 'border-primary/40 text-primary',
  return: 'border-pass/40 text-pass',
};

export function TraceExpression({ step }: TraceExpressionProps) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className={cn('rounded border px-1.5 py-0.5 font-mono text-[10px]', TONE[step.kind])}>
          {LABEL[step.kind]}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">line {step.line}</span>
      </div>

      <div className="space-y-1">
        {step.chain.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 font-mono text-[12px]">
            {index > 0 && <span className="text-muted-foreground">&rarr;</span>}
            <span className={index === step.chain.length - 1 ? 'text-foreground' : 'text-foreground/60'}>
              {entry}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Check the types**

Run: `cd studio && npx tsc --noEmit`
Expected: the 13 pre-existing errors in `monaco-surface.tsx` and `solution-diff.tsx`, and nothing new. Compare against `git stash` if unsure.

- [ ] **Step 4: Commit**

```bash
git add studio/src/components/trace-stage.tsx studio/src/components/trace-expression.tsx
git commit -m "Render trace values and expression chains"
```

---

### Task 12: The panel and the wiring

**Files:**
- Create: `studio/src/components/trace-panel.tsx`
- Modify: `studio/src/components/monaco-surface.tsx`
- Modify: `studio/src/components/studio.tsx`

- [ ] **Step 1: Write the panel**

Create `studio/src/components/trace-panel.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Pause, Play, Wand2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TraceExpression } from './trace-expression';
import { TraceStage } from './trace-stage';
import type { TraceResult } from '@/lib/types';

interface TracePanelProps {
  trace: TraceResult | null;
  tracing: boolean;
  onTrace: () => void;
  onStep: (line: number | null) => void;
}

const PLAY_MS = 800;

export function TracePanel({ trace, tracing, onTrace, onStep }: TracePanelProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const steps = trace?.steps ?? [];
  const current = steps[index] ?? null;

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [trace]);

  useEffect(() => {
    onStep(current?.line ?? null);
  }, [current, onStep]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setIndex((at) => {
        if (at >= steps.length - 1) {
          setPlaying(false);
          return at;
        }
        return at + 1;
      });
    }, PLAY_MS);
    return () => clearInterval(timer);
  }, [playing, steps.length]);

  const notice = (title: string, body: string) => (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-sm rounded-2xl border border-line bg-panel/60 p-6 text-center">
        <div className="mb-3 flex justify-center">
          <AlertTriangle className="size-6 text-medium" />
        </div>
        <p className="mb-1 font-heading text-sm font-semibold">{title}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  );

  if (tracing) return notice('Recording', 'Running your solution one step at a time.');

  if (!trace) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <button
          type="button"
          onClick={onTrace}
          className="flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-xs transition-colors hover:border-primary/40"
        >
          <Wand2 className="size-3.5" />
          Simulate this solution
        </button>
      </div>
    );
  }

  if (trace.status === 'unsupported') return notice('Not traceable yet', trace.message ?? '');
  if (trace.status === 'uninstrumentable') return notice('Could not read your file', trace.message ?? '');
  if (trace.status === 'stalled') return notice('Timed out', trace.message ?? '');
  if (trace.status === 'crashed') return notice('The tracer crashed', trace.message ?? '');
  if (steps.length === 0) return notice('Nothing to show', 'The run produced no steps.');

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <button type="button" aria-label="previous step" onClick={() => setIndex((at) => Math.max(0, at - 1))}>
          <ChevronLeft className="size-4" />
        </button>
        <button type="button" aria-label="play" onClick={() => setPlaying((on) => !on)}>
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <button
          type="button"
          aria-label="next step"
          onClick={() => setIndex((at) => Math.min(steps.length - 1, at + 1))}
        >
          <ChevronRight className="size-4" />
        </button>
        <input
          type="range"
          min={0}
          max={steps.length - 1}
          value={index}
          aria-label="step"
          onChange={(event) => setIndex(Number(event.target.value))}
          className="flex-1"
        />
        <span className="font-mono text-[11px] text-muted-foreground">
          {index + 1} / {steps.length}
        </span>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-4">
          {current && <TraceExpression step={current} />}
          {current && <TraceStage step={current} />}

          {trace.status === 'threw' && (
            <p className="rounded-lg border border-fail/30 bg-fail/[0.05] p-3 text-[11px] text-fail">
              It threw after this point: {trace.message}
            </p>
          )}
          {trace.truncated && (
            <p className="text-[11px] text-muted-foreground">
              The trace hit its step budget; the rest was cut.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
```

- [ ] **Step 2: Let the editor highlight a line**

`monaco-surface.tsx` already keeps `monacoRef` and `editorRef`; this reuses both and adds one ref of its own.

Add `activeLine?: number | null` to `MonacoSurfaceProps`, accept it in the destructured parameters, declare the ref beside the existing ones:

```tsx
  const decorationsRef = useRef<string[]>([]);
```

and add the effect after the existing ones:

```tsx
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      activeLine
        ? [
            {
              range: new monaco.Range(activeLine, 1, activeLine, 1),
              options: { isWholeLine: true, className: 'trace-active-line' },
            },
          ]
        : [],
    );

    if (activeLine) editor.revealLineInCenterIfOutsideViewport(activeLine);
  }, [activeLine]);
```

Add the class to `studio/src/app/globals.css`:

```css
.trace-active-line {
  background: color-mix(in oklab, var(--primary) 14%, transparent);
}
```

- [ ] **Step 3: Wire the panel into the studio**

In `studio/src/components/studio.tsx`:

```tsx
  const [trace, setTrace] = useState<TraceResult | null>(null);
  const [tracing, setTracing] = useState(false);
  const [activeLine, setActiveLine] = useState<number | null>(null);

  const handleTrace = async () => {
    if (!active) return;
    const name = report?.variants[0]?.name;
    if (!name) {
      toast.error('Run it once first, so the tracer knows which export to follow');
      return;
    }

    setTracing(true);
    try {
      const answer = await request<{ trace: TraceResult }>('/api/trace', {
        method: 'POST',
        body: JSON.stringify({ number: active.number, variant: name, caseIndex: 0, mode }),
      });
      setTrace(answer.trace);
    } catch (error) {
      toast.error(messageOf(error));
    } finally {
      setTracing(false);
    }
  };
```

Reset it when the problem changes, beside the existing resets:

```tsx
    setTrace(null);
    setActiveLine(null);
```

Wrap the bottom panel in tabs, replacing the `<VerdictPanel … />` inside the lower `ResizablePanel`:

```tsx
              <Tabs defaultValue="verdict" className="flex h-full flex-col">
                <TabsList className="mx-3 mt-2 self-start">
                  <TabsTrigger value="verdict">Verdict</TabsTrigger>
                  <TabsTrigger value="trace">Simulation</TabsTrigger>
                </TabsList>

                <TabsContent value="verdict" className="min-h-0 flex-1">
                  <VerdictPanel
                    report={report}
                    running={running}
                    bigO={bigO}
                    problemTitle={active.title}
                    onMeasure={handleMeasure}
                    onSnippet={handleSnippet}
                  />
                </TabsContent>

                <TabsContent value="trace" className="min-h-0 flex-1">
                  <TracePanel trace={trace} tracing={tracing} onTrace={handleTrace} onStep={setActiveLine} />
                </TabsContent>
              </Tabs>
```

Pass `activeLine` down to `SolutionEditor` so it reaches `MonacoSurface`, and add the imports:

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TracePanel } from './trace-panel';
import type { TraceResult } from '@/lib/types';
```

- [ ] **Step 4: Check the types and try it**

```bash
cd studio && npx tsc --noEmit
```

Expected: the same 13 pre-existing errors, nothing new.

Then start the studio, open `003`, press Run, switch to the Simulation tab and press Simulate. Expected: the step counter fills, the slider scrubs, and the highlighted line in the editor follows the step.

- [ ] **Step 5: Commit**

```bash
git add studio/src/components/trace-panel.tsx studio/src/components/monaco-surface.tsx studio/src/components/studio.tsx studio/src/app/globals.css
git commit -m "Replay a trace beside the editor"
```

---

### Task 13: Choosing the variant and the case

Task 12 traces the first variant and the first case. The spec asks for more: a student with two solutions in one file should be able to pick between them, and a student whose run just failed should land on the failing case without hunting for it.

No new endpoint is needed. The last `RunReport` already carries what the pickers need: `report.variants[].name`, and `report.variants[].cases[]` in the same order the tracer indexes them, each with a `label` and a `passed` flag.

**Files:**
- Modify: `studio/src/components/trace-panel.tsx`
- Modify: `studio/src/components/studio.tsx`

- [ ] **Step 1: Take the choices as props**

In `studio/src/components/trace-panel.tsx`, widen the props:

```tsx
interface TracePanelProps {
  trace: TraceResult | null;
  tracing: boolean;
  variants: string[];
  cases: { label: string; passed: boolean }[];
  variant: string | null;
  caseIndex: number;
  onPick: (variant: string, caseIndex: number) => void;
  onTrace: () => void;
  onStep: (line: number | null) => void;
}
```

and destructure them in the signature:

```tsx
export function TracePanel({
  trace,
  tracing,
  variants,
  cases,
  variant,
  caseIndex,
  onPick,
  onTrace,
  onStep,
}: TracePanelProps) {
```

- [ ] **Step 2: Draw the pickers**

Add this block directly above the transport row's `return`, and render it in both the idle branch and the stepping branch by lifting it into a local:

```tsx
  const pickers = (
    <div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2">
      {variants.length > 1 && (
        <select
          aria-label="variant"
          value={variant ?? ''}
          onChange={(event) => onPick(event.target.value, caseIndex)}
          className="rounded-md border border-line bg-transparent px-2 py-1 font-mono text-[11px]"
        >
          {variants.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      )}

      {cases.length > 0 && variant && (
        <select
          aria-label="case"
          value={caseIndex}
          onChange={(event) => onPick(variant, Number(event.target.value))}
          className="min-w-0 flex-1 rounded-md border border-line bg-transparent px-2 py-1 font-mono text-[11px]"
        >
          {cases.map((item, index) => (
            <option key={`${item.label}-${index}`} value={index}>
              {item.passed ? '' : 'failing - '}
              {item.label}
            </option>
          ))}
        </select>
      )}

      <button
        type="button"
        onClick={onTrace}
        className="rounded-md border border-line px-2 py-1 text-[11px] transition-colors hover:border-primary/40"
      >
        Simulate
      </button>
    </div>
  );
```

Then render `{pickers}` as the first child of the stepping branch's outer `<div className="flex h-full flex-col">`, above the transport row, and replace the idle branch's lone button with:

```tsx
  if (!trace) {
    return (
      <div className="flex h-full flex-col">
        {pickers}
        <div className="flex flex-1 items-center justify-center p-8">
          <p className="max-w-xs text-center text-xs text-muted-foreground">
            Pick a case and press Simulate to watch this solution run one step at a time.
          </p>
        </div>
      </div>
    );
  }
```

- [ ] **Step 3: Choose the defaults in the studio**

In `studio/src/components/studio.tsx`, replace the `handleTrace` from Task 12 with a version that takes the picked pair, and add the selection state:

```tsx
  const [variant, setVariant] = useState<string | null>(null);
  const [caseIndex, setCaseIndex] = useState(0);

  const traceVariants = report?.variants.map((entry) => entry.name) ?? [];
  const traceCases =
    report?.variants.find((entry) => entry.name === variant)?.cases.map((item) => ({
      label: item.label,
      passed: item.passed,
    })) ?? [];

  const runTrace = async (pickedVariant: string, pickedCase: number) => {
    if (!active) return;

    setTracing(true);
    try {
      const answer = await request<{ trace: TraceResult }>('/api/trace', {
        method: 'POST',
        body: JSON.stringify({
          number: active.number,
          variant: pickedVariant,
          caseIndex: pickedCase,
          mode,
        }),
      });
      setTrace(answer.trace);
    } catch (error) {
      toast.error(messageOf(error));
    } finally {
      setTracing(false);
    }
  };

  const handlePick = (pickedVariant: string, pickedCase: number) => {
    setVariant(pickedVariant);
    setCaseIndex(pickedCase);
    setTrace(null);
  };

  const handleTrace = () => {
    if (!variant) {
      toast.error('Run it once first, so the tracer knows which export to follow');
      return;
    }
    runTrace(variant, caseIndex);
  };
```

Then, wherever the run report is stored after a run completes, seed the defaults from it — the first variant, and the first case that failed if there is one:

```tsx
  const seedTrace = (next: RunReport) => {
    const first = next.variants[0];
    setVariant(first?.name ?? null);
    const failingAt = first?.cases.findIndex((item) => !item.passed) ?? -1;
    setCaseIndex(failingAt === -1 ? 0 : failingAt);
    setTrace(null);
    setActiveLine(null);
  };
```

Call `seedTrace(answer.report)` immediately after `setReport(answer.report)` inside the existing run handler, and reset `setVariant(null)` alongside the other per-problem resets.

- [ ] **Step 4: Pass the new props**

```tsx
                <TabsContent value="trace" className="min-h-0 flex-1">
                  <TracePanel
                    trace={trace}
                    tracing={tracing}
                    variants={traceVariants}
                    cases={traceCases}
                    variant={variant}
                    caseIndex={caseIndex}
                    onPick={handlePick}
                    onTrace={handleTrace}
                    onStep={setActiveLine}
                  />
                </TabsContent>
```

- [ ] **Step 5: Check the types and try it**

```bash
cd studio && npx tsc --noEmit
```

Expected: the same 13 pre-existing errors, nothing new.

Then in the studio, open a problem with two exports — `002` with `isAnagram` and `isAnagram2` is the natural one — run it, and check that the variant dropdown lists both and that switching either dropdown clears the old trace. Break one case on purpose and confirm the failing case is the one selected after the next run.

- [ ] **Step 6: Commit**

```bash
git add studio/src/components/trace-panel.tsx studio/src/components/studio.tsx
git commit -m "Pick the variant and the case to trace"
```

---

## Done when

- `npm run test:trace` is green, including the 16-step and 12-step acceptance fixtures.
- `npm test` still passes exactly as it did before this branch.
- Opening a supported problem, running it, and pressing Simulate steps through the student's own code with the editor line following along.
- A file with two exports lets the student pick between them, and a run that failed lands on the failing case.
- An unsupported problem, a file that will not load, and a solution that throws each explain themselves in the panel instead of going blank.
