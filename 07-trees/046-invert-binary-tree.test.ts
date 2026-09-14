import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTree, treeToArray } from '../shared/testing.ts';
import { invertTree } from './046-invert-binary-tree.ts';

test('mirrors a full tree', () => {
  assert.deepEqual(
    treeToArray(invertTree(buildTree([4, 2, 7, 1, 3, 6, 9]))),
    [4, 7, 2, 9, 6, 3, 1],
  );
});

test('mirrors a three-node tree', () => {
  assert.deepEqual(treeToArray(invertTree(buildTree([2, 1, 3]))), [2, 3, 1]);
});

test('handles the empty tree and a lopsided one', () => {
  assert.equal(invertTree(null), null);
  assert.deepEqual(treeToArray(invertTree(buildTree([1, null, 2]))), [1, 2]);
});
