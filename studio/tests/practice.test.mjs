import test from 'node:test';
import assert from 'node:assert/strict';
import { practiceFor } from '../src/lib/practice.ts';

const PROBLEMS = [
  { number: '001', title: 'Contains Duplicate', difficulty: 'Easy', tags: ['hash map'] },
  { number: '002', title: 'Valid Anagram', difficulty: 'Easy', tags: ['hash map', 'sorting'] },
  { number: '010', title: 'Valid Palindrome', difficulty: 'Easy', tags: ['two pointers'] },
  { number: '013', title: 'Container With Most Water', difficulty: 'Medium', tags: ['two pointers'] },
];

test('a lesson that names problems links to exactly those', () => {
  const { named, related } = practiceFor('1 Contains Duplicate, 2 Valid Anagram', PROBLEMS);

  assert.deepEqual(named.map((problem) => problem.number), ['001', '002']);
  assert.equal(related.some((problem) => problem.number === '001'), false);
});

test('a lesson about a technique links to problems that share it', () => {
  const { named, related, tags } = practiceFor('Two Pointers', PROBLEMS);

  assert.deepEqual(named, []);
  assert.deepEqual(tags, ['two pointers']);
  assert.deepEqual(related.map((problem) => problem.number), ['010', '013']);
});

test('a lesson about nothing in the tag list gets no practice, rather than a guess', () => {
  const { named, related, tags } = practiceFor('Install Linux', PROBLEMS);

  assert.deepEqual(named, []);
  assert.deepEqual(related, []);
  assert.deepEqual(tags, []);
});

test('a short title cannot be matched inside unrelated words', () => {
  const short = [{ number: '999', title: '3Sum', difficulty: 'Medium', tags: [] }];
  const { named } = practiceFor('Summary of the chapter', short);

  assert.deepEqual(named, []);
});

test('the limit caps how much practice one lesson offers', () => {
  const many = Array.from({ length: 30 }, (unused, index) => ({
    number: String(index + 100),
    title: `Problem number ${index}`,
    difficulty: 'Easy',
    tags: ['hash map'],
  }));

  assert.equal(practiceFor('Hashmap', many).related.length, 8);
});

/**
 * The walkthrough's problem files carry the timestamp of the lesson that teaches
 * them, so that pairing is a join rather than a read of the title.
 */
test('a lesson pairs with the problems whose file points at it', () => {
  const taught = [
    { number: '001', title: 'Contains Duplicate', difficulty: 'Easy', tags: [], lessonAt: 129 },
    { number: '002', title: 'Valid Anagram', difficulty: 'Easy', tags: [], lessonAt: 129 },
    { number: '003', title: 'Two Sum', difficulty: 'Easy', tags: [], lessonAt: 1110 },
  ];

  const { named } = practiceFor('A title that names nothing', taught, 129);
  assert.deepEqual(named.map((problem) => problem.number), ['001', '002']);
});

test('a title match still counts when the lesson time misses it', () => {
  const taught = [
    { number: '001', title: 'Contains Duplicate', difficulty: 'Easy', tags: [], lessonAt: 129 },
    { number: '010', title: 'Valid Palindrome', difficulty: 'Easy', tags: [], lessonAt: null },
  ];

  const { named } = practiceFor('Valid Palindrome', taught, 129);
  assert.deepEqual(named.map((problem) => problem.number), ['001', '010']);
});

test('no lesson time falls back to the title alone', () => {
  const { named } = practiceFor('1 Contains Duplicate, 2 Valid Anagram', PROBLEMS);
  assert.deepEqual(named.map((problem) => problem.number), ['001', '002']);
});
