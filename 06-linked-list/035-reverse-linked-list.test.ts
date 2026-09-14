import test from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray } from '../shared/testing.ts';
import { reverseList } from './035-reverse-linked-list.ts';

test('reverses a multi-node list', () => {
  assert.deepEqual(listToArray(reverseList(buildList([1, 2, 3, 4, 5]))), [5, 4, 3, 2, 1]);
  assert.deepEqual(listToArray(reverseList(buildList([1, 2]))), [2, 1]);
});

test('handles the empty and single-node lists', () => {
  assert.equal(reverseList(null), null);
  assert.deepEqual(listToArray(reverseList(buildList([1]))), [1]);
});

test('leaves no dangling next pointer on the new tail', () => {
  const reversed = reverseList(buildList([1, 2, 3]));
  assert.equal(reversed?.next?.next?.next, null);
});
