const LIST = `import { ListNode } from '../shared/types.ts';`;

export default {
  category: 'Linked List',
  dir: '06-linked-list',
  intro: `
Pointer surgery. Two habits carry this whole section: a dummy head node so the first
element is not a special case, and slow/fast pointers so you can find the middle or a cycle
in one pass. Draw the three nodes you are rewiring before you type anything.
`,
  problems: [
    {
      n: 35,
      title: 'Reverse Linked List',
      slug: 'reverse-linked-list',
      difficulty: 'Easy',
      leetcode: 'reverse-linked-list',
      pattern: 'prev / curr / next rewiring',
      complexity: 'O(n) time, O(1) space',
      imports: LIST,
      statement: `
Given the head of a singly linked list, reverse it and return the new head.
`,
      examples: [
        `Input:  head = 1 -> 2 -> 3 -> 4 -> 5
Output: 5 -> 4 -> 3 -> 2 -> 1`,
        `Input:  head = 1 -> 2
Output: 2 -> 1`,
        `Input:  head = null
Output: null`,
      ],
      constraints: [
        'The list has 0 to 5000 nodes',
        '-5000 <= Node.val <= 5000',
      ],
      followUp: 'Write it both iteratively and recursively.',
      stub: `
export function reverseList(head: ListNode | null): ListNode | null {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 36,
      title: 'Merge Two Sorted Lists',
      slug: 'merge-two-sorted-lists',
      difficulty: 'Easy',
      leetcode: 'merge-two-sorted-lists',
      pattern: 'Dummy head + splice the smaller node',
      complexity: 'O(n + m) time, O(1) space',
      imports: LIST,
      statement: `
Given the heads of two sorted linked lists, splice them into one sorted list built from the
original nodes, and return its head.
`,
      examples: [
        `Input:  list1 = 1 -> 2 -> 4, list2 = 1 -> 3 -> 4
Output: 1 -> 1 -> 2 -> 3 -> 4 -> 4`,
        `Input:  list1 = null, list2 = null
Output: null`,
        `Input:  list1 = null, list2 = 0
Output: 0`,
      ],
      constraints: [
        'Each list has 0 to 50 nodes',
        '-100 <= Node.val <= 100',
        'Both lists are sorted in non-decreasing order',
      ],
      followUp: 'Reuse the existing nodes — do not allocate new ones.',
      stub: `
export function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 37,
      title: 'Reorder List',
      slug: 'reorder-list',
      difficulty: 'Medium',
      leetcode: 'reorder-list',
      pattern: 'Find middle, reverse second half, interleave',
      complexity: 'O(n) time, O(1) space',
      imports: LIST,
      statement: `
Given the head of a list L0 -> L1 -> ... -> Ln-1 -> Ln, reorder it in place to
L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ... You may not change the node values, only the
links. The function returns nothing — mutate the list.
`,
      examples: [
        `Input:  head = 1 -> 2 -> 3 -> 4
Output: 1 -> 4 -> 2 -> 3`,
        `Input:  head = 1 -> 2 -> 3 -> 4 -> 5
Output: 1 -> 5 -> 2 -> 4 -> 3`,
      ],
      constraints: [
        'The list has 1 to 5 * 10^4 nodes',
        '1 <= Node.val <= 1000',
      ],
      followUp: 'Three familiar sub-problems in a row. Name them before you code.',
      stub: `
export function reorderList(head: ListNode | null): void {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 38,
      title: 'Remove Nth Node From End of List',
      slug: 'remove-nth-node-from-end-of-list',
      difficulty: 'Medium',
      leetcode: 'remove-nth-node-from-end-of-list',
      pattern: 'Two pointers n apart + dummy head',
      complexity: 'O(n) time, O(1) space',
      imports: LIST,
      statement: `
Given the head of a linked list, remove the nth node counting from the end and return the
head of the modified list.
`,
      examples: [
        `Input:  head = 1 -> 2 -> 3 -> 4 -> 5, n = 2
Output: 1 -> 2 -> 3 -> 5`,
        `Input:  head = 1, n = 1
Output: null`,
        `Input:  head = 1 -> 2, n = 1
Output: 1`,
      ],
      constraints: [
        'The list has sz nodes with 1 <= sz <= 30',
        '0 <= Node.val <= 100',
        '1 <= n <= sz',
      ],
      followUp: 'Can you do it in one pass?',
      stub: `
export function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 39,
      title: 'Copy List with Random Pointer',
      slug: 'copy-list-with-random-pointer',
      difficulty: 'Medium',
      leetcode: 'copy-list-with-random-pointer',
      pattern: 'Map original -> clone, then wire pointers in a second pass',
      complexity: 'O(n) time, O(n) space (O(1) with node interleaving)',
      imports: `import { RandomListNode } from '../shared/types.ts';`,
      statement: `
Each node of the list has a next pointer and a random pointer that may point at any node in
the list or at null. Build a deep copy: n brand new nodes whose values match, whose next
and random pointers mirror the original structure, and where no pointer in the copy
references a node from the original list.
`,
      examples: [
        `Input:  [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]
        (each pair is [val, index the random pointer targets])
Output: an independent list with the same shape`,
        `Input:  [[1, 1], [2, 1]]
Output: an independent list with the same shape`,
      ],
      constraints: [
        '0 <= n <= 1000',
        '-10^4 <= Node.val <= 10^4',
        'Node.random is null or points at a node in the list',
      ],
      followUp: 'The hash map is the obvious answer. Can you do it in O(1) extra space?',
      stub: `
export function copyRandomList(head: RandomListNode | null): RandomListNode | null {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 40,
      title: 'Add Two Numbers',
      slug: 'add-two-numbers',
      difficulty: 'Medium',
      leetcode: 'add-two-numbers',
      pattern: 'Digit-by-digit addition with a carry',
      complexity: 'O(max(n, m)) time, O(max(n, m)) space',
      imports: LIST,
      statement: `
Two non-negative integers are stored as linked lists with the digits in reverse order, one
digit per node. Add them and return the sum as a linked list in the same format. Neither
number has a leading zero, except the number 0 itself.
`,
      examples: [
        `Input:  l1 = 2 -> 4 -> 3, l2 = 5 -> 6 -> 4
Output: 7 -> 0 -> 8        // 342 + 465 = 807`,
        `Input:  l1 = 0, l2 = 0
Output: 0`,
        `Input:  l1 = 9 -> 9 -> 9 -> 9 -> 9 -> 9 -> 9, l2 = 9 -> 9 -> 9 -> 9
Output: 8 -> 9 -> 9 -> 9 -> 0 -> 0 -> 0 -> 1`,
      ],
      constraints: [
        'Each list has 1 to 100 nodes',
        '0 <= Node.val <= 9',
        'The numbers have no leading zeros',
      ],
      followUp: 'Do not convert to numbers — the lists are longer than Number can hold.',
      stub: `
export function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 41,
      title: 'Linked List Cycle',
      slug: 'linked-list-cycle',
      difficulty: 'Easy',
      leetcode: 'linked-list-cycle',
      pattern: "Floyd's slow and fast pointers",
      complexity: 'O(n) time, O(1) space',
      imports: LIST,
      statement: `
Return true when the linked list contains a cycle — that is, when some node can be reached
again by following next pointers.
`,
      examples: [
        `Input:  head = 3 -> 2 -> 0 -> -4, tail connects to index 1
Output: true`,
        `Input:  head = 1 -> 2, tail connects to index 0
Output: true`,
        `Input:  head = 1, no cycle
Output: false`,
      ],
      constraints: [
        'The list has 0 to 10^4 nodes',
        '-10^5 <= Node.val <= 10^5',
      ],
      followUp: 'Can you do it with O(1) memory instead of a visited set?',
      stub: `
export function hasCycle(head: ListNode | null): boolean {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 42,
      title: 'Find the Duplicate Number',
      slug: 'find-the-duplicate-number',
      difficulty: 'Medium',
      leetcode: 'find-the-duplicate-number',
      pattern: "Floyd's cycle detection on the array-as-linked-list",
      complexity: 'O(n) time, O(1) space',
      statement: `
An array nums of n + 1 integers holds values in the range [1, n], so at least one value
repeats. Return the repeated number. You must not modify the array and you must use only
constant extra space.
`,
      examples: [
        `Input:  nums = [1, 3, 4, 2, 2]
Output: 2`,
        `Input:  nums = [3, 1, 3, 4, 2]
Output: 3`,
        `Input:  nums = [3, 3, 3, 3, 3]
Output: 3`,
      ],
      constraints: [
        '1 <= n <= 10^5 and nums.length === n + 1',
        '1 <= nums[i] <= n',
        'Exactly one value is repeated, possibly many times',
        'The array is read-only and only O(1) extra space is allowed',
      ],
      followUp: 'Read i -> nums[i] as a next pointer. Where must the cycle entrance be?',
      stub: `
export function findDuplicate(nums: number[]): number {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 43,
      title: 'LRU Cache',
      slug: 'lru-cache',
      difficulty: 'Medium',
      leetcode: 'lru-cache',
      pattern: 'Hash map + doubly linked list (or JS Map ordering)',
      complexity: 'O(1) average per operation',
      statement: `
Design a cache with a fixed capacity that evicts the least recently used key. get(key)
returns the value or -1 when the key is absent; put(key, value) inserts or updates a key
and evicts the least recently used entry once capacity is exceeded. Both operations must
run in O(1) average time, and both count as a use of that key.
`,
      examples: [
        `Input:  capacity = 2; put(1,1), put(2,2), get(1), put(3,3), get(2),
        put(4,4), get(1), get(3), get(4)
Output: 1, -1, -1, 3, 4`,
      ],
      constraints: [
        '1 <= capacity <= 3000',
        '0 <= key <= 10^4 and 0 <= value <= 10^5',
        'At most 2 * 10^5 calls to get and put combined',
      ],
      followUp: 'Build the doubly linked list by hand at least once before leaning on Map.',
      stub: `
export class LRUCache {
  constructor(capacity: number) {
    throw new Error('Not implemented');
  }

  get(key: number): number {
    throw new Error('Not implemented');
  }

  put(key: number, value: number): void {
    throw new Error('Not implemented');
  }
}
`,
    },
    {
      n: 44,
      title: 'Merge k Sorted Lists',
      slug: 'merge-k-sorted-lists',
      difficulty: 'Hard',
      leetcode: 'merge-k-sorted-lists',
      pattern: 'Pairwise merge in rounds (or a min-heap of heads)',
      complexity: 'O(n log k) time, O(1) space with pairwise merging',
      imports: LIST,
      statement: `
Given an array of k sorted linked lists, merge them into a single sorted list and return
its head.
`,
      examples: [
        `Input:  lists = [1 -> 4 -> 5, 1 -> 3 -> 4, 2 -> 6]
Output: 1 -> 1 -> 2 -> 3 -> 4 -> 4 -> 5 -> 6`,
        `Input:  lists = []
Output: null`,
        `Input:  lists = [null]
Output: null`,
      ],
      constraints: [
        '0 <= k <= 10^4',
        'Each list has 0 to 500 nodes sorted ascending',
        '-10^4 <= Node.val <= 10^4',
        'The total number of nodes across all lists does not exceed 10^4',
      ],
      followUp: 'Merging one list at a time is O(kn). Halving the number of lists each round is not.',
      stub: `
export function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  throw new Error('Not implemented');
}
`,
    },
    {
      n: 45,
      title: 'Reverse Nodes in k-Group',
      slug: 'reverse-nodes-in-k-group',
      difficulty: 'Hard',
      leetcode: 'reverse-nodes-in-k-group',
      pattern: 'Reverse a bounded window, then reconnect the group boundaries',
      complexity: 'O(n) time, O(1) space',
      imports: LIST,
      statement: `
Reverse the nodes of a linked list k at a time and return the modified list. If the number
of remaining nodes is smaller than k, leave that tail as it is. Node values may not be
changed — only the links.
`,
      examples: [
        `Input:  head = 1 -> 2 -> 3 -> 4 -> 5, k = 2
Output: 2 -> 1 -> 4 -> 3 -> 5`,
        `Input:  head = 1 -> 2 -> 3 -> 4 -> 5, k = 3
Output: 3 -> 2 -> 1 -> 4 -> 5`,
      ],
      constraints: [
        'The list has n nodes with 1 <= k <= n <= 5000',
        '0 <= Node.val <= 1000',
      ],
      followUp: 'Can you do it with O(1) extra memory — no recursion stack?',
      stub: `
export function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  throw new Error('Not implemented');
}
`,
    },
  ],
};
