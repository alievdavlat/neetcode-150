import { ListNode } from '../../../shared/types.ts';

/**
 * A cycle cannot be written as an array, so these build the nodes directly and
 * `rawArgs` tells the runner to hand them over without decoding.
 */
const chain = (values, cycleIndex) => {
  const nodes = values.map((value) => new ListNode(value));
  nodes.forEach((node, index) => {
    node.next = nodes[index + 1] ?? null;
  });
  if (cycleIndex >= 0 && nodes.length > 0) nodes.at(-1).next = nodes[cycleIndex];
  return nodes[0] ?? null;
};

export default {
  rawArgs: true,
  rawResult: true,
  compare: 'exact',
  cases: [
    { label: 'cycle back to the second node', args: [chain([3, 2, 0, -4], 1)], expect: true },
    { label: 'two nodes pointing at each other', args: [chain([1, 2], 0)], expect: true },
    { label: 'single node linked to itself', args: [chain([1], 0)], expect: true },
    { label: 'no cycle', args: [chain([1, 2, 3], -1)], expect: false },
    { label: 'single node, no cycle', args: [chain([1], -1)], expect: false },
    { label: 'empty list', args: [null], expect: false },
  ],
};
