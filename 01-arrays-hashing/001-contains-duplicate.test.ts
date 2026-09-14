import test from 'node:test';
import assert from 'node:assert/strict';
import { containsDuplicate } from './001-contains-duplicate.ts';

test('reports a repeated value', () => {
  assert.equal(containsDuplicate([1, 2, 3, 1]), true);
  assert.equal(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]), true);
});

test('reports a fully distinct array', () => {
  assert.equal(containsDuplicate([1, 2, 3, 4]), false);
  assert.equal(containsDuplicate([7]), false);
});

test('handles the duplicate sitting at the far ends', () => {
  assert.equal(containsDuplicate([5, 1, 2, 3, 5]), true);
});
