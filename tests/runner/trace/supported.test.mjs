import test from 'node:test';
import assert from 'node:assert/strict';
import { traceSupport } from './supported.mjs';

test('a function over numbers and arrays of them is traceable', () => {
  const signature = {
    kind: 'function',
    name: 'twoSum',
    params: [
      { name: 'nums', type: 'number[]' },
      { name: 'target', type: 'number' },
    ],
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
