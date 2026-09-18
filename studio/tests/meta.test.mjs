import test from 'node:test';
import assert from 'node:assert/strict';
import { duration, stamp, tagsOfText } from '../src/lib/meta.ts';

test('a lesson is minutes and a course is hours', () => {
  assert.equal(duration(90), '2m');
  assert.equal(duration(3540), '59m');
  assert.equal(duration(3600), '1h 00m');
  assert.equal(duration(14816), '4h 07m');
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
