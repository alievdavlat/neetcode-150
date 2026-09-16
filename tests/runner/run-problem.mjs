import { prepare } from './discover.mjs';
import { runCases } from './execute.mjs';
import { timeCall, measureHeap } from './measure.mjs';
import { probeComplexity, targetTimeComplexity } from './complexity.mjs';
import { adapterFor } from './shapes.mjs';

const RAW = adapterFor('');

const clone = (value) => (typeof value === 'object' && value !== null ? structuredClone(value) : value);

const decodeAll = (args, decoders) => args.map((arg, index) => (decoders[index] ?? RAW).decode(clone(arg)));

/**
 * Everything the report needs about one problem, as plain data. Kept free of
 * functions and terminal formatting so it can cross a worker boundary.
 */
export async function runProblem(problem, { showBigO = false, showMemory = false } = {}) {
  const prepared = await prepare(problem);

  const shell = {
    number: prepared.number,
    title: prepared.title,
    difficulty: prepared.difficulty,
    category: prepared.category,
    dir: prepared.dir,
    slug: prepared.slug,
  };

  if (prepared.status !== 'attempted') return { ...shell, status: prepared.status };
  if (prepared.cases.length === 0) return { ...shell, status: 'no-cases' };

  const target = targetTimeComplexity(prepared.complexity);
  const variants = [];

  for (const variant of prepared.variants) {
    const isFunction = variant.kind === 'function';
    const outcome = runCases(variant, prepared);

    const benchArgs =
      isFunction && prepared.gen
        ? decodeAll(prepared.gen(prepared.probe?.base ?? 1000), prepared.decoders)
        : isFunction
          ? decodeAll(prepared.cases[0].args, prepared.decoders)
          : null;

    const complexity =
      showBigO && isFunction && prepared.gen && outcome.failures.length === 0
        ? probeComplexity(variant.fn, (n) => decodeAll(prepared.gen(n), prepared.decoders), prepared.probe)
        : null;

    variants.push({
      name: variant.name,
      passed: outcome.passed,
      total: outcome.total,
      failures: outcome.failures,
      observed: outcome.observed,
      ms: benchArgs ? timeCall(variant.fn, benchArgs) : null,
      heap: showMemory && benchArgs ? measureHeap(variant.fn, benchArgs) : null,
      complexity,
      target,
    });
  }

  return {
    ...shell,
    status: 'attempted',
    variants,
    hasGenerator: Boolean(prepared.gen),
    isFunctionProblem: prepared.signature.kind === 'function',
    unparsedExamples: prepared.unparsedExamples,
  };
}
