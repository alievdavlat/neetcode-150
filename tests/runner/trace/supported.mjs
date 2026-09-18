/**
 * Which problems the tracer can handle, read from the signature the stub
 * already declares. There is no hand-kept list of problem numbers: a problem
 * becomes traceable the moment its types are ones the stage can draw.
 */
const VALUE_TYPES = new Set([
  'number',
  'string',
  'boolean',
  'void',
  'number[]',
  'string[]',
  'boolean[]',
  'number[][]',
  'string[][]',
  '[number, number]',
  'ListNode',
  'TreeNode',
]);

/** `number[] | null` and `number | undefined` are the array type with a nullable tail. */
const core = (type) =>
  type
    .split('|')
    .map((part) => part.trim())
    .filter((part) => part !== 'null' && part !== 'undefined')
    .join(' | ');

export function traceSupport(signature) {
  if (signature.kind !== 'function') {
    return { ok: false, reason: 'class problems are not traceable yet - only plain functions are' };
  }

  for (const param of signature.params ?? []) {
    const type = core(param.type);
    if (!VALUE_TYPES.has(type)) {
      return { ok: false, reason: `a ${type} argument is not traceable yet` };
    }
  }

  const returns = core(signature.returns ?? '');
  if (!VALUE_TYPES.has(returns)) {
    return { ok: false, reason: `a ${returns} result is not traceable yet` };
  }

  return { ok: true, reason: null };
}
