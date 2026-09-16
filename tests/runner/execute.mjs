import { judge, deepEqual } from './compare.mjs';
import { adapterFor } from './shapes.mjs';

const RAW = adapterFor('');

const clone = (value) => (typeof value === 'object' && value !== null ? structuredClone(value) : value);

const show = (args) => args.map((arg) => JSON.stringify(arg) ?? String(arg)).join(', ');

/**
 * Run every case against one plain function. Arguments are decoded into the
 * node classes the signature asks for, and the result is encoded back into the
 * array form the examples are written in.
 */
export function runFunctionCases(variant, prepared) {
  const failures = [];
  const observed = [];
  let passed = 0;

  for (const testCase of prepared.cases) {
    const label = testCase.label ?? 'case';
    const args = testCase.args.map((arg, index) => (prepared.decoders[index] ?? RAW).decode(clone(arg)));

    let produced;
    try {
      produced = variant.fn(...args);
    } catch (error) {
      failures.push({ label, args: testCase.args, thrown: error.message });
      observed.push({ label, args: testCase.args, thrown: error.message, passed: false });
      continue;
    }

    const encoder = prepared.encoder ?? RAW;
    const mutatesInPlace = prepared.signature?.returns === 'void';
    const result = mutatesInPlace
      ? (prepared.decoders[0] ?? RAW).encode(args[0])
      : encoder.encode(produced);
    const emptyShape = mutatesInPlace ? (prepared.decoders[0] ?? RAW).empty : encoder.empty;
    const expected = testCase.expect === null && emptyShape !== undefined ? emptyShape : testCase.expect;
    const verdict = judge({ result, testCase: { ...testCase, expect: expected }, mode: prepared.mode, module: prepared.module });
    observed.push({ label, args: testCase.args, result, passed: verdict.passed });
    if (verdict.passed) {
      passed += 1;
      continue;
    }
    failures.push({ label, args: testCase.args, expect: expected, result, detail: verdict.detail });
  }

  return { passed, total: prepared.cases.length, failures, observed };
}

/**
 * Design problems are a class plus a sequence of calls. Each op is
 * `[method, args]`, and a third element asserts what that call returns. The
 * calls leading up to a failure travel with it, so the state that caused it
 * is visible in the report.
 */
export function runClassCases(variant, prepared) {
  const failures = [];
  const observed = [];
  let passed = 0;

  for (const testCase of prepared.cases) {
    const label = testCase.label ?? 'case';
    const construct = testCase.construct ?? [];

    let instance;
    try {
      instance = new variant.Ctor(...construct.map(clone));
    } catch (error) {
      failures.push({ label: `${label} - constructor`, args: construct, thrown: error.message });
      continue;
    }

    const trace = [];
    let failure = null;

    for (const op of testCase.ops ?? []) {
      const [method, args = []] = op;

      if (typeof instance[method] !== 'function') {
        failure = { label: `${label} - ${method}`, args, thrown: `no method named ${method}` };
        break;
      }

      let produced;
      try {
        produced = instance[method](...args.map(clone));
      } catch (error) {
        failure = { label: `${label} - ${method}(${show(args)})`, args, thrown: error.message, detail: trace.slice(-4).join(' ') };
        break;
      }

      trace.push(op.length < 3 ? `${method}(${show(args)})` : `${method}(${show(args)}) -> ${show([produced])}`);
      if (op.length < 3) continue;
      if (deepEqual(produced, op[2])) continue;

      failure = {
        label: `${label} - ${method}(${show(args)})`,
        args,
        expect: op[2],
        result: produced,
        detail: `after ${trace.slice(-4).join(' ')}`,
      };
      break;
    }

    observed.push({ label, trace, passed: !failure });
    if (failure) failures.push(failure);
    else passed += 1;
  }

  return { passed, total: prepared.cases.length, failures, observed };
}

export const runCases = (variant, prepared) =>
  variant.kind === 'class' ? runClassCases(variant, prepared) : runFunctionCases(variant, prepared);
