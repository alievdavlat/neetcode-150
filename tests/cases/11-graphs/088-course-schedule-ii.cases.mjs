/**
 * Any valid topological order is accepted, so comparing against one expected
 * array would fail a correct answer - the doc block even says [0, 2, 1, 3] is
 * as good as [0, 1, 2, 3]. These cases check the order is valid instead.
 * `useExamples: false` drops the derived cases that would compare exactly.
 */
const validOrder = (order, numCourses, prerequisites) => {
  if (!Array.isArray(order)) return `expected an array, got ${typeof order}`;
  if (order.length !== numCourses) return `expected ${numCourses} courses, got ${order.length}`;
  if (new Set(order).size !== numCourses) return 'the order repeats or skips a course';

  const position = new Map(order.map((course, index) => [course, index]));
  for (const [course, needs] of prerequisites) {
    if (position.get(needs) > position.get(course)) {
      return `course ${course} is taken before its prerequisite ${needs}`;
    }
  }
  return true;
};

const solvable = (numCourses, prerequisites, label) => ({
  label,
  args: [numCourses, prerequisites],
  check: (order, [courses, edges]) => validOrder(order, courses, edges),
});

const impossible = (numCourses, prerequisites, label) => ({
  label,
  args: [numCourses, prerequisites],
  check: (order) =>
    Array.isArray(order) && order.length === 0 ? true : `expected an empty array, got ${JSON.stringify(order)}`,
});

export default {
  useExamples: false,
  cases: [
    solvable(2, [[1, 0]], 'one prerequisite'),
    solvable(4, [[1, 0], [2, 0], [3, 1], [3, 2]], 'diamond - several orders are valid'),
    solvable(1, [], 'single course, no prerequisites'),
    solvable(3, [], 'no edges at all'),
    impossible(2, [[1, 0], [0, 1]], 'two courses depending on each other'),
    impossible(3, [[0, 1], [1, 2], [2, 0]], 'three-course cycle'),
  ],
};
