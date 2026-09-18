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

const SIMPLE = `export function count(nums: number[]): number {
  let total = 0;
  total = total + nums.length;
  return total;
}
`;

const lines = (text) => text.split('\n').length;

test('the line count never moves', () => {
  const { code } = instrument(SOURCE, { functionName: 'twoSum' });
  assert.equal(lines(code), lines(SOURCE));
});

test('every line keeps its original indent', () => {
  const { code } = instrument(SOURCE, { functionName: 'twoSum' });
  for (const [index, line] of code.split('\n').entries()) {
    const original = SOURCE.split('\n')[index];
    assert.equal(line.startsWith(original.slice(0, 2)), true, `line ${index + 1} lost its indent`);
  }
});

test('an unknown function name is refused', () => {
  assert.throws(() => instrument(SOURCE, { functionName: 'nope' }), /nope/);
});

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

test('a for loop is three separate sites', () => {
  const { code, meta } = instrument(SOURCE, { functionName: 'twoSum' });
  const kinds = meta.map((entry) => entry.kind);

  assert.equal(kinds.includes('loop-init'), true);
  assert.equal(kinds.includes('loop-cond'), true);
  assert.equal(kinds.includes('loop-update'), true);

  const update = meta.find((entry) => entry.kind === 'loop-update');
  assert.equal(update.text, 'i++');
  assert.equal(update.op, '+');
  assert.match(code, new RegExp(`globalThis\\.__t\\.u\\(${update.id},\\(i\\+\\+\\),i,\\{`));
});

test('an if condition and a return are their own sites', () => {
  const { meta } = instrument(SOURCE, { functionName: 'twoSum' });
  const cond = meta.find((entry) => entry.kind === 'cond');
  const ret = meta.filter((entry) => entry.kind === 'return');

  assert.equal(cond.text, 'calc in obj');
  assert.equal(cond.line, 5);
  assert.deepEqual(
    ret.map((entry) => entry.text),
    ['[i, obj[calc]]', '[-1, -1]'],
  );
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

test('a for of loop wraps its iterable', () => {
  const source = `export function join(strs: string[]): string {
  let out = '';
  for (const word of strs) {
    out = out + word;
  }
  return out;
}
`;
  const { code, meta } = instrument(source, { functionName: 'join' });
  const bind = meta.find((entry) => entry.kind === 'loop-update');

  assert.equal(bind.text, 'word of strs');
  assert.equal(bind.changed, 'word');
  assert.match(code, new RegExp(`globalThis\\.__t\\.i\\(${bind.id},strs,\\(\\) =>`));
  assert.match(code, /globalThis\.__t\.s\(\d+,\{strs,out,word\}\)/);
});

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
  assert.match(code, new RegExp(`globalThis\\.__t\\.x\\(${write.id},"obj",.*,true,"nums\\[i\\]"\\)`));
});

test('an assignment target is never wrapped as a leaf', () => {
  const { code } = instrument(SOURCE, { functionName: 'twoSum' });
  assert.equal(/globalThis\.__t\.l\([^)]*\)\s*=[^=]/.test(code), false, 'a call ended up on the left of =');
});

test('a counter target is never wrapped as a leaf either', () => {
  const { code } = instrument(SIMPLE, { functionName: 'count' });
  assert.equal(/globalThis\.__t\.l\([^)]*\)\s*=[^=]/.test(code), false);
  assert.match(code, /=\s*globalThis\.__t\.l\(\d+,\d+,total\)/);
});
