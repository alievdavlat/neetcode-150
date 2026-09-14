/**
 * Shared node shapes used by the linked-list, tree and graph problems.
 * Import these instead of redeclaring them inside a solution file.
 */

export class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

export class RandomListNode {
  val: number;
  next: RandomListNode | null;
  random: RandomListNode | null;

  constructor(val = 0, next: RandomListNode | null = null, random: RandomListNode | null = null) {
    this.val = val;
    this.next = next;
    this.random = random;
  }
}

export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

export class GraphNode {
  val: number;
  neighbors: GraphNode[];

  constructor(val = 0, neighbors: GraphNode[] = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}
