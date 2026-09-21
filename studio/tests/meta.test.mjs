import test from 'node:test';
import assert from 'node:assert/strict';
import en from '../src/i18n/dictionaries/en.json' with { type: 'json' };
import { translator } from '../src/i18n/lookup.ts';
import { duration, stamp, tagsOfText } from '../src/lib/meta.ts';

/**
 * The real English dictionary rather than a stub, so a renamed or deleted key
 * fails here instead of printing its own name on screen.
 */
const t = translator(en, 'en');

test('a lesson is minutes and a course is hours', () => {
  assert.equal(duration(t, 90), '2m');
  assert.equal(duration(t, 3540), '59m');
  assert.equal(duration(t, 3600), '1h 00m');
  assert.equal(duration(t, 14816), '4h 07m');
});

test('a timestamp reads like the video scrubber', () => {
  assert.equal(stamp(0), '0:00');
  assert.equal(stamp(75), '1:15');
  assert.equal(stamp(3862), '1:04:22');
});

test('the tag rules read one word or two', () => {
  assert.deepEqual(tagsOfText('Hashmap'), ['hash map']);
  assert.deepEqual(tagsOfText('Hash Set'), ['hash map']);
  assert.deepEqual(tagsOfText('Sliding Window'), ['sliding window']);
  assert.deepEqual(tagsOfText('Install Linux'), []);
});
