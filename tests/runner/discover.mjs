import { access } from 'node:fs/promises';
import { adapterFor } from './shapes.mjs';
import { defaultGenerator } from './generators.mjs';
import { compareModeFor } from './compare-modes.mjs';

const ROOT = new URL('../../', import.meta.url);

const resolve = (relative) => new URL(relative, ROOT);

const exists = (url) =>
  access(url)
    .then(() => true)
    .catch(() => false);

/** Solution files log scratch calls at import time; swallow that so reports stay readable. */
async function importQuietly(url) {
  const captured = [];
  const realWrite = process.stdout.write.bind(process.stdout);
  const realLog = console.log;

  process.stdout.write = (chunk) => {
    captured.push(String(chunk));
    return true;
  };
  console.log = (...args) => captured.push(args.map(String).join(' '));

  const module = await import(url.href).finally(() => {
    process.stdout.write = realWrite;
    console.log = realLog;
  });

  return { module, scratch: captured.join('').trim() };
}

export const STUB_PATTERN = /not implemented/i;

const isClass = (value) => /^class[\s{]/.test(Function.prototype.toString.call(value));

const clone = (value) => (typeof value === 'object' && value !== null ? structuredClone(value) : value);

function runCatching(run) {
  try {
    run();
    return null;
  } catch (error) {
    return error;
  }
}

const throwsStub = (error) => error !== null && STUB_PATTERN.test(error.message ?? '');

/** Optional per-problem overrides: extra cases, comparison mode, size generator. */
async function loadOverrides(problem) {
  const url = resolve(`tests/cases/${problem.dir}/${problem.number}-${problem.slug}.cases.mjs`);
  if (!(await exists(url))) return null;
  return (await import(url.href)).default;
}

/** Argument and result converters taken from the stub's declared types. */
function shapeFor(signature) {
  if (signature.kind !== 'function') return { decoders: [], encoder: adapterFor('') };
  return {
    decoders: signature.params.map((param) => adapterFor(param.type)),
    encoder: adapterFor(signature.returns),
  };
}

function functionVariants(module, cases, only) {
  const probeArgs = cases[0]?.args ?? [];
  return Object.entries(module)
    .filter(([, value]) => typeof value === 'function' && !isClass(value))
    .filter(([name]) => !only || only.includes(name))
    .map(([name, fn]) => ({
      kind: 'function',
      name,
      fn,
      stub: probeArgs.length > 0 && throwsStub(runCatching(() => fn(...probeArgs.map(clone)))),
    }));
}

function classVariants(module, signature, cases) {
  const construct = cases[0]?.construct ?? [];
  return Object.entries(module)
    .filter(([name, value]) => isClass(value) && (!signature.name || name === signature.name))
    .map(([name, Ctor]) => ({
      kind: 'class',
      name,
      Ctor,
      stub: throwsStub(
        runCatching(() => {
          const instance = new Ctor(...construct.map(clone));
          const first = signature.methods?.[0];
          if (first) instance[first.name](...first.params.map(() => 0));
        }),
      ),
    }));
}

/**
 * Attach the runnable surface to a problem: its attempted variants, the cases
 * they should satisfy, the shape adapters their signature implies, and anything
 * the override file adds.
 */
export async function prepare(problem) {
  const fileUrl = resolve(problem.file);
  if (!(await exists(fileUrl))) {
    return { ...problem, status: 'missing', variants: [] };
  }

  const overrides = await loadOverrides(problem);
  const derived = overrides?.useExamples === false ? [] : problem.cases.cases;
  const cases = [...derived, ...(overrides?.cases ?? [])];
  const shape = shapeFor(problem.signature);
  const base = {
    ...problem,
    cases,
    mode: overrides?.compare ?? compareModeFor(problem.number),
    gen: overrides?.gen ?? defaultGenerator(problem.signature),
    genericGen: !overrides?.gen,
    probe: overrides?.probe ?? undefined,
    decoders: overrides?.rawArgs ? [] : shape.decoders,
    encoder: overrides?.rawResult ? adapterFor('') : shape.encoder,
    unparsedExamples: overrides?.cases?.length ? [] : problem.cases.skipped,
    hasOverrides: Boolean(overrides),
  };

  let loaded;
  try {
    loaded = await importQuietly(fileUrl);
  } catch (error) {
    return { ...base, status: 'load-error', error, variants: [] };
  }

  const found =
    problem.signature.kind === 'class'
      ? classVariants(loaded.module, problem.signature, cases)
      : functionVariants(loaded.module, cases, overrides?.only ?? null);

  const attempted = found.filter((variant) => !variant.stub);

  return {
    ...base,
    status: attempted.length > 0 ? 'attempted' : 'not-started',
    variants: attempted,
    stubCount: found.length - attempted.length,
    scratch: loaded.scratch,
    module: loaded.module,
  };
}
