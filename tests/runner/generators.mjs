const letter = (index) => String.fromCharCode(97 + (index % 26));

const word = (seed, length = 6) =>
  Array.from({ length }, (_, offset) => letter(seed + offset)).join('');

const ascending = (n) => Array.from({ length: n }, (_, index) => index);

const square = (n) => {
  const side = Math.max(1, Math.round(Math.sqrt(n)));
  return Array.from({ length: side }, (_, row) => Array.from({ length: side }, (_, column) => row + column));
};

const pairs = (n) => Array.from({ length: n }, (_, index) => [index * 2, index * 2 + 1]);

const SMALL = new Set(['k', 'target', 'x', 'threshold', 'limit']);
const SIZED = new Set(['n', 'numCourses', 'capacity', 'numRows', 'rowIndex']);

/**
 * A number sitting next to a collection usually means k, a target or the size
 * itself. Guessing from the name beats guessing from the type.
 */
const numberFor = (name, n) => {
  if (SIZED.has(name)) return Math.max(1, Math.min(n, 40));
  if (SMALL.has(name)) return Math.max(1, Math.min(3, n));
  return Math.max(1, Math.min(3, n));
};

const GRID_NAMES = new Set(['grid', 'board', 'matrix', 'image', 'rooms', 'heights']);

const matrixFor = (name, n) => (GRID_NAMES.has(name) ? square(n) : pairs(n));

const BY_TYPE = {
  'number[]': (name, n) => ascending(n),
  number: (name, n) => numberFor(name, n),
  string: (name, n) => Array.from({ length: n }, (_, index) => letter(index)).join(''),
  'string[]': (name, n) => Array.from({ length: n }, (_, index) => word(index)),
  'number[][]': (name, n) => matrixFor(name, n),
  'string[][]': (name, n) => {
    const side = Math.max(1, Math.round(Math.sqrt(n)));
    return Array.from({ length: side }, (_, row) => Array.from({ length: side }, (_, column) => letter(row + column)));
  },
  'ListNode | null': (name, n) => ascending(n),
  ListNode: (name, n) => ascending(n),
  'TreeNode | null': (name, n) => ascending(n),
  TreeNode: (name, n) => ascending(n),
  'GraphNode | null': (name, n) =>
    Array.from({ length: n }, (_, index) => [index === 0 ? n : index, index + 2 > n ? 1 : index + 2]),
  'RandomListNode | null': (name, n) => Array.from({ length: n }, (_, index) => [index, (index + 1) % n]),
  'Array<ListNode | null>': (name, n) => {
    const lists = Math.max(1, Math.round(Math.sqrt(n)));
    const each = Math.max(1, Math.floor(n / lists));
    return Array.from({ length: lists }, (_, list) =>
      Array.from({ length: each }, (_, index) => list + index * lists),
    );
  },
};

/**
 * Build a size-n input from the stub's declared parameter types. Values are
 * generic and ascending, which keeps them valid for the problems that require
 * sorted input, but it cannot know a problem's real preconditions. Where the
 * shape matters, override `gen` in the problem's case file.
 */
export function defaultGenerator(signature) {
  if (signature.kind !== 'function' || signature.params.length === 0) return null;
  if (!signature.params.every((param) => Object.hasOwn(BY_TYPE, param.type))) return null;

  return (n) => signature.params.map((param) => BY_TYPE[param.type](param.name, n));
}
