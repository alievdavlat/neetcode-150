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
    { name: 'nums', key: 0, write: false },
  );
});
