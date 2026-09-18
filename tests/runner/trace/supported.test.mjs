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

test('a linked list is traceable, now that the stage draws one', () => {
  const signature = {
    kind: 'function',
    name: 'reverseList',
    params: [{ name: 'head', type: 'ListNode | null' }],
    returns: 'ListNode | null',
  };
  assert.deepEqual(traceSupport(signature), { ok: true, reason: null });
});

test('a tree is traceable too', () => {
  const signature = {
    kind: 'function',
    name: 'maxDepth',
    params: [{ name: 'root', type: 'TreeNode | null' }],
    returns: 'number',
  };
  assert.deepEqual(traceSupport(signature), { ok: true, reason: null });
});

test('a class problem is refused', () => {
  assert.equal(traceSupport({ kind: 'class', name: 'LRUCache' }).ok, false);
  assert.match(traceSupport({ kind: 'class', name: 'LRUCache' }).reason, /class/i);
});

test('an unsupported return type is refused even when the parameters are fine', () => {
  const signature = {
    kind: 'function',
    name: 'cloneGraph',
    params: [{ name: 'values', type: 'number[]' }],
    returns: 'GraphNode | null',
  };
  assert.equal(traceSupport(signature).ok, false);
  assert.match(traceSupport(signature).reason, /GraphNode/);
});
