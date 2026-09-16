import { adapterFor } from '../../runner/shapes.mjs';

const tree = adapterFor('TreeNode | null');

/**
 * The serialized format is the solver's own choice, so comparing the string to
 * anything would fail a correct answer. Only the round trip is checked: encode
 * the tree, rebuild it, and compare the rebuilt tree to the original shape.
 * `useExamples: false` drops the doc-block example, which would otherwise
 * compare a string against a level-order array.
 */
const roundTrip = (shape, label) => ({
  label,
  args: [shape],
  check: (data, [original], module) => {
    if (typeof data !== 'string') return `serialize returned ${typeof data}, expected a string`;
    const rebuilt = tree.encode(module.deserialize(data));
    if (JSON.stringify(rebuilt) === JSON.stringify(original)) return true;
    return `deserialize rebuilt ${JSON.stringify(rebuilt)}`;
  },
});

export default {
  only: ['serialize'],
  useExamples: false,
  cases: [
    roundTrip([1, 2, 3, null, null, 4, 5], 'doc block tree'),
    roundTrip([], 'empty tree'),
    roundTrip([1], 'single node'),
    roundTrip([1, null, 2, null, 3], 'right-skewed'),
    roundTrip([5, 4, null, 3, null, 2], 'left-skewed'),
    roundTrip([0, -1, 1], 'zero and negative values'),
  ],
};
