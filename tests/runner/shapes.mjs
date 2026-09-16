import { ListNode, TreeNode, GraphNode, RandomListNode } from '../../shared/types.ts';

/** Array to linked list, and back. `null` and `[]` both mean an empty list. */
const list = {
  empty: [],
  decode(value) {
    if (value === null || value === undefined) return null;
    const values = Array.isArray(value) ? value : [value];
    let head = null;
    for (let index = values.length - 1; index >= 0; index -= 1) {
      head = new ListNode(values[index], head);
    }
    return head;
  },
  encode(node) {
    const values = [];
    let cursor = node;
    while (cursor && values.length < 100000) {
      values.push(cursor.val);
      cursor = cursor.next;
    }
    return values;
  },
};

/** LeetCode level-order arrays, where `null` marks a missing child. */
const tree = {
  empty: [],
  decode(value) {
    if (!Array.isArray(value) || value.length === 0 || value[0] === null) return null;

    const root = new TreeNode(value[0]);
    const queue = [root];
    let index = 1;

    while (queue.length > 0 && index < value.length) {
      const node = queue.shift();
      if (index < value.length) {
        const left = value[index];
        index += 1;
        if (left !== null && left !== undefined) {
          node.left = new TreeNode(left);
          queue.push(node.left);
        }
      }
      if (index < value.length) {
        const right = value[index];
        index += 1;
        if (right !== null && right !== undefined) {
          node.right = new TreeNode(right);
          queue.push(node.right);
        }
      }
    }

    return root;
  },
  encode(node) {
    if (!node) return [];

    const values = [];
    const queue = [node];
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) {
        values.push(null);
        continue;
      }
      values.push(current.val);
      queue.push(current.left, current.right);
    }

    while (values.length > 0 && values.at(-1) === null) values.pop();
    return values;
  },
};

/** Adjacency list, 1-indexed the way the problem statements write it. */
const graph = {
  empty: [],
  decode(value) {
    if (!Array.isArray(value) || value.length === 0) return null;

    const nodes = value.map((_, index) => new GraphNode(index + 1));
    value.forEach((neighbours, index) => {
      nodes[index].neighbors = neighbours.map((label) => nodes[label - 1]);
    });
    return nodes[0];
  },
  encode(node) {
    if (!node) return [];

    const seen = new Map();
    const queue = [node];
    seen.set(node.val, node);
    while (queue.length > 0) {
      const current = queue.shift();
      for (const neighbour of current.neighbors ?? []) {
        if (seen.has(neighbour.val)) continue;
        seen.set(neighbour.val, neighbour);
        queue.push(neighbour);
      }
    }

    const labels = [...seen.keys()].sort((a, b) => a - b);
    return labels.map((label) => (seen.get(label).neighbors ?? []).map((n) => n.val).sort((a, b) => a - b));
  },
};

/** Pairs of `[value, randomIndex]`, with a null index meaning no random link. */
const randomList = {
  empty: [],
  decode(value) {
    if (!Array.isArray(value) || value.length === 0) return null;

    const nodes = value.map(([val]) => new RandomListNode(val));
    value.forEach(([, randomIndex], index) => {
      nodes[index].next = nodes[index + 1] ?? null;
      nodes[index].random = randomIndex === null || randomIndex === undefined ? null : nodes[randomIndex];
    });
    return nodes[0];
  },
  encode(node) {
    const nodes = [];
    let cursor = node;
    while (cursor) {
      nodes.push(cursor);
      cursor = cursor.next;
    }
    const position = new Map(nodes.map((item, index) => [item, index]));
    return nodes.map((item) => [item.val, item.random === null ? null : position.get(item.random) ?? null]);
  },
};

const listArray = {
  empty: [],
  decode: (value) => (Array.isArray(value) ? value.map((item) => list.decode(item)) : []),
  encode: (value) => (Array.isArray(value) ? value.map((item) => list.encode(item)) : []),
};

const raw = { decode: (value) => value, encode: (value) => value };

const BY_TYPE = {
  'ListNode | null': list,
  ListNode: list,
  'TreeNode | null': tree,
  TreeNode: tree,
  'GraphNode | null': graph,
  GraphNode: graph,
  'RandomListNode | null': randomList,
  RandomListNode: randomList,
  'Array<ListNode | null>': listArray,
  'ListNode[]': listArray,
};

export const adapterFor = (type) => BY_TYPE[type] ?? raw;

export const isNodeType = (type) => Object.hasOwn(BY_TYPE, type);

/** True when a signature touches any of the node classes. */
export const usesNodes = (signature) => {
  if (signature.kind !== 'function') return false;
  return signature.params.some((param) => isNodeType(param.type)) || isNodeType(signature.returns);
};
