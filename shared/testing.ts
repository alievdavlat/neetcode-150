import { ListNode, TreeNode } from './types.ts';

/** Builds a linked list from plain values: buildList([1, 2, 3]) -> 1 -> 2 -> 3. */
export const buildList = (values: number[]): ListNode | null => {
  const dummy = new ListNode();
  let tail = dummy;
  for (const value of values) {
    tail.next = new ListNode(value);
    tail = tail.next;
  }
  return dummy.next;
};

/** Reads a linked list back into an array so assert.deepEqual can compare it. */
export const listToArray = (head: ListNode | null): number[] => {
  const values: number[] = [];
  for (let node = head; node !== null; node = node.next) values.push(node.val);
  return values;
};

/** Builds a tree from the level-order array LeetCode prints, nulls included. */
export const buildTree = (level: Array<number | null>): TreeNode | null => {
  if (level.length === 0 || level[0] === null) return null;

  const root = new TreeNode(level[0]);
  const queue: TreeNode[] = [root];
  let cursor = 0;
  let index = 1;

  while (cursor < queue.length && index < level.length) {
    const node = queue[cursor];
    cursor += 1;

    const leftValue = level[index];
    index += 1;
    if (leftValue !== null && leftValue !== undefined) {
      node.left = new TreeNode(leftValue);
      queue.push(node.left);
    }

    const rightValue = level[index];
    index += 1;
    if (rightValue !== null && rightValue !== undefined) {
      node.right = new TreeNode(rightValue);
      queue.push(node.right);
    }
  }

  return root;
};

/** Reads a tree back into level-order form with trailing nulls trimmed. */
export const treeToArray = (root: TreeNode | null): Array<number | null> => {
  if (root === null) return [];

  const values: Array<number | null> = [];
  const queue: Array<TreeNode | null> = [root];
  let cursor = 0;

  while (cursor < queue.length) {
    const node = queue[cursor];
    cursor += 1;
    if (node === null) {
      values.push(null);
      continue;
    }
    values.push(node.val);
    queue.push(node.left, node.right);
  }

  while (values.length > 0 && values[values.length - 1] === null) values.pop();
  return values;
};

const byText = (left: unknown, right: unknown): number => String(left).localeCompare(String(right));

/**
 * Puts a list of groups into a canonical order so tests do not depend on the order
 * your solution happens to produce. Use it on both sides of the assertion.
 */
export const normalizeGroups = <T>(groups: T[][]): T[][] =>
  groups
    .map((group) => [...group].sort(byText))
    .sort((left, right) => byText(left.join('|'), right.join('|')));
