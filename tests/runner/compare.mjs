const FLOAT_EPSILON = 1e-6;

/**
 * Structural equality that treats NaN as equal to itself and ignores key order.
 * Whole numbers are compared exactly; a non-integer on either side is compared
 * within a relative epsilon, the way an online judge accepts a median or an
 * average that differs in the last bits.
 */
export function deepEqual(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    if (a === b) return true;
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    if (Number.isInteger(a) && Number.isInteger(b)) return false;
    return Math.abs(a - b) <= FLOAT_EPSILON * Math.max(1, Math.abs(a), Math.abs(b));
  }
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return false;

  if (Array.isArray(a) || ArrayBuffer.isView(a)) {
    if (!Array.isArray(b) && !ArrayBuffer.isView(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a !== 'object') return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => deepEqual(a[key], b[key]));
}

const orderKey = (value) => JSON.stringify(value) ?? String(value);

const sortCopy = (list) => [...list].sort((a, b) => (orderKey(a) < orderKey(b) ? -1 : 1));

/**
 * Reshape a result so an order-insensitive answer compares equal.
 * `unordered` sorts the outer list, `groups` sorts inner lists then the outer one.
 */
export function canonicalize(value, mode) {
  if (mode === 'exact' || !Array.isArray(value)) return value;
  if (mode === 'unordered') return sortCopy(value);
  if (mode === 'groups') return sortCopy(value.map((item) => (Array.isArray(item) ? sortCopy(item) : item)));
  return value;
}

/**
 * Judge one result. A case may carry its own `check(result, args, module)`,
 * which returns true or a string explaining the failure - the module argument
 * lets a problem that exports a pair of functions test them against each other.
 * Otherwise the expected value is compared under the problem's comparison mode.
 */
export function judge({ result, testCase, mode, module }) {
  if (typeof testCase.check === 'function') {
    const verdict = testCase.check(result, testCase.args, module);
    if (verdict === true) return { passed: true };
    return { passed: false, detail: typeof verdict === 'string' ? verdict : 'custom check failed' };
  }

  const passed = deepEqual(canonicalize(result, mode), canonicalize(testCase.expect, mode));
  return { passed };
}
