import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeGroups } from '../shared/testing.ts';
import { groupAnagrams } from './004-group-anagrams.ts';

/**
 * The problem accepts any ordering, so both sides go through normalizeGroups
 * before they are compared.
 */
test('groups words that are anagrams of each other', () => {
  assert.deepEqual(
    normalizeGroups(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])),
    normalizeGroups([['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]),
  );
});

test('handles the single-word and empty-word inputs', () => {
  assert.deepEqual(normalizeGroups(groupAnagrams([''])), [['']]);
  assert.deepEqual(normalizeGroups(groupAnagrams(['a'])), [['a']]);
});

test('keeps words with the same letters but different counts apart', () => {
  assert.deepEqual(
    normalizeGroups(groupAnagrams(['aab', 'abb'])),
    normalizeGroups([['aab'], ['abb']]),
  );
});
