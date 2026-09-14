import test from 'node:test';
import assert from 'node:assert/strict';
import { MinStack } from './022-min-stack.ts';

/** Design problems are tested as a call sequence, checking the return of each query. */
test('tracks the minimum across pushes and pops', () => {
  const stack = new MinStack();

  stack.push(-2);
  stack.push(0);
  stack.push(-3);
  assert.equal(stack.getMin(), -3);

  stack.pop();
  assert.equal(stack.top(), 0);
  assert.equal(stack.getMin(), -2);
});

test('keeps the minimum correct when the same value is pushed twice', () => {
  const stack = new MinStack();

  stack.push(1);
  stack.push(1);
  stack.push(2);
  stack.pop();
  stack.pop();
  assert.equal(stack.getMin(), 1);
});

test('restores an older minimum after the newer one is popped', () => {
  const stack = new MinStack();

  stack.push(5);
  stack.push(3);
  assert.equal(stack.getMin(), 3);
  stack.pop();
  assert.equal(stack.getMin(), 5);
});
