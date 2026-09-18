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
  const target = new URL(`${fixture.replace('.ts', '')}-${Date.now()}-${Math.random().toString(36).slice(2)}.ts`, dir);
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

test('the hash map two sum produces seventeen steps and the right pair', async () => {
  const { steps, result } = await trace('two-sum.ts', 'twoSum', [[3, 2, 4], 6]);

  assert.deepEqual(result, [2, 1]);
  assert.equal(steps.length, 17);
  assert.equal(steps[0].kind, 'call');
  assert.deepEqual(steps[0].chain, ['twoSum([3,2,4], 6)']);
  assert.equal(steps[0].depth, 1);
  assert.deepEqual(steps.at(-1).chain, ['[i, obj[calc]]', '[2, 1]']);
  assert.equal(steps.at(-1).kind, 'return');
});

test('the counting anagram produces eighteen steps and passes', async () => {
  const { steps, result } = await trace('valid-anagram.ts', 'isAnagram', ['cat', 'act']);

  assert.equal(result, true);
  assert.equal(steps.length, 18);
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

test('the scope shows a block scoped name appearing and leaving', async () => {
  const { steps } = await trace('two-sum.ts', 'twoSum', [[3, 2, 4], 6]);

  const withCalc = steps.filter((step) => 'calc' in step.vars);
  const updates = steps.filter((step) => step.kind === 'loop-update');

  assert.equal(withCalc.length > 0, true);
  for (const step of updates) assert.equal('calc' in step.vars, false);
});

test('a touched cell is reported with its index', async () => {
  const { steps } = await trace('two-sum.ts', 'twoSum', [[3, 2, 4], 6]);
  const first = steps.find((step) => step.touched.some((entry) => entry.name === 'nums'));

  assert.deepEqual(
    first.touched.find((entry) => entry.name === 'nums'),
    { name: 'nums', key: 0, write: false, from: 'i' },
  );
});

test('a for…of names the value it bound this turn', async () => {
  const { steps, result } = await trace('group-words.ts', 'groupWords', [['ab', 'cd']]);

  assert.deepEqual(result, ['ab!', 'cd!']);

  const bindings = steps.filter((step) => step.kind === 'loop-update');
  assert.deepEqual(
    bindings.map((step) => step.chain.at(-1)),
    ["'ab'", "'cd'"],
  );
  assert.deepEqual(
    bindings.map((step) => step.vars.word?.text),
    ["'ab'", "'cd'"],
  );
});

test('the second name in a declaration list is visible for the rest of the trace', async () => {
  const { steps, result } = await trace('two-pointer.ts', 'pairSum', [[1, 2, 3, 4]]);

  assert.equal(result, 10);

  const born = steps.findIndex((step) => step.changed === 'right');
  assert.equal(born > -1, true, 'the second declarator never got a step of its own');
  assert.deepEqual(steps[born].chain, ['nums.length - 1', '4 - 1', '3']);
  assert.equal(
    steps.slice(born).every((step) => 'right' in step.vars),
    true,
  );
});

test('an update statement reports the value it leaves behind', async () => {
  const { steps } = await trace('two-pointer.ts', 'pairSum', [[1, 2, 3, 4]]);
  const bumps = steps.filter((step) => step.changed === 'left' && step.chain[0] === 'left++');

  for (const step of bumps) assert.equal(step.chain.at(-1), step.vars.left.text);
});

test('a compound assignment names what it changed', async () => {
  const { steps } = await trace('two-pointer.ts', 'pairSum', [[1, 2, 3, 4]]);
  const sums = steps.filter((step) => step.chain[0].startsWith('total +='));

  assert.equal(sums.length > 0, true);
  for (const step of sums) assert.equal(step.changed, 'total');
});

test('an incrementor moving two counters claims no arithmetic and still shows both', async () => {
  const { steps, result } = await trace('walk-pairs.ts', 'walkPairs', [[1, 2, 3, 4]]);

  assert.equal(result, 10);
  const updates = steps.filter((step) => step.kind === 'loop-update');
  assert.equal(updates.length > 0, true);

  for (const step of updates) {
    assert.deepEqual(step.chain, ['i++, j--']);
    assert.equal('i' in step.vars && 'j' in step.vars, true);
  }
});

test('a recursive call does not eat the substitution of the call that made it', async () => {
  const { steps, result } = await trace('fib.ts', 'fib', [4]);

  assert.equal(result, 3);
  const returns = steps.filter((step) => step.chain[0] === 'fib(n - 1) + fib(n - 2)');

  assert.equal(returns.length > 0, true);
  for (const step of returns) {
    assert.equal(step.chain.length, 3, `half filled: ${JSON.stringify(step.chain)}`);
    assert.match(step.chain[1], /^fib\(\d+ - 1\) \+ fib\(\d+ - 2\)$/);
  }
});

test('a prefix update says what it read, not what it had just written', async () => {
  const { steps, result } = await trace('prefix-count.ts', 'countUp', [[7, 8]]);

  assert.equal(result, 2);

  const bumps = steps.filter((step) => step.chain[0] === '++seen');
  assert.deepEqual(
    bumps.map((step) => step.chain),
    [
      ['++seen', '0 + 1', '1'],
      ['++seen', '1 + 1', '2'],
    ],
  );

  const counters = steps.filter((step) => step.kind === 'loop-update');
  assert.deepEqual(
    counters.map((step) => step.chain),
    [
      ['++i', '0 + 1', '1'],
      ['++i', '1 + 1', '2'],
    ],
  );
});
