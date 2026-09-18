import { readFile, writeFile } from 'node:fs/promises';
import { NotALiteral, parsePythonLiteral, splitPythonArgs } from './python-literal.mjs';

/**
 * Turn the MBPP dataset into this workspace's problem shape.
 *
 * MBPP is Apache 2.0 (google-research/google-research/mbpp) and gives a task
 * sentence plus assertions. The assertions are the ground truth, so a record is
 * only imported when every one of them reads cleanly as a literal call and the
 * argument types agree across them. Everything else is skipped and counted.
 */

const FIRST_NUMBER = 1000;

const CALL = /^assert\s+(?:\(\s*)?([A-Za-z_][A-Za-z0-9_]*)\s*\(([\s\S]*)$/;

const camel = (name) =>
  name
    .replace(/[^A-Za-z0-9]+(.)?/g, (_, next) => (next ? next.toUpperCase() : ''))
    .replace(/^(.)/, (first) => first.toLowerCase());

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .split('-')
    .slice(0, 8)
    .join('-');

/** `a, b, c` tells a reader nothing; the type does. */
const LABEL = {
  'number[]': 'nums',
  'string[]': 'words',
  'boolean[]': 'flags',
  'number[][]': 'rows',
  'string[][]': 'grid',
  number: 'n',
  string: 'text',
  boolean: 'flag',
};

function labelsFor(types) {
  const used = new Map();
  return types.map((type) => {
    const base = LABEL[type] ?? 'value';
    const seen = (used.get(base) ?? 0) + 1;
    used.set(base, seen);
    return seen === 1 ? base : `${base}${seen}`;
  });
}

/** `fn(a, b) == expected` - find the paren that closes the call. */
function splitCall(rest) {
  let depth = 1;
  let quote = '';

  for (let at = 0; at < rest.length; at += 1) {
    const char = rest[at];
    if (quote) {
      if (char === '\\') at += 1;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if ('([{'.includes(char)) depth += 1;
    else if (')]}'.includes(char)) {
      depth -= 1;
      if (depth === 0) return { args: rest.slice(0, at), tail: rest.slice(at + 1).trim() };
    }
  }

  throw new NotALiteral('unbalanced call');
}

function parseAssertion(line) {
  const match = CALL.exec(line.trim());
  if (!match) throw new NotALiteral('not a plain call assertion');

  const [, name, rest] = match;
  const { args, tail } = splitCall(rest);

  const comparison = tail.replace(/^\)/, '').trim();
  let expected;
  if (comparison === '') expected = true;
  else if (comparison.startsWith('==')) expected = parsePythonLiteral(comparison.slice(2).trim());
  else if (comparison.startsWith('is not None')) throw new NotALiteral('identity assertion');
  else if (/^is\s+True$/.test(comparison)) expected = true;
  else if (/^is\s+False$/.test(comparison)) expected = false;
  else throw new NotALiteral(`unsupported comparison: ${comparison}`);

  const values = splitPythonArgs(args).map((part) => {
    if (/^[A-Za-z_][A-Za-z0-9_]*\s*=/.test(part)) throw new NotALiteral('keyword argument');
    return parsePythonLiteral(part);
  });

  if (values.length === 0) throw new NotALiteral('no arguments');
  return { name, values, expected };
}

/** The TypeScript type a set of sample values all agree on, or null when they do not. */
function typeOf(values) {
  const kinds = new Set(values.map(kindOf));
  if (kinds.size !== 1) return null;

  const [kind] = kinds;
  if (kind !== 'array') return kind;

  const inner = values.flat();
  if (inner.length === 0) return 'number[]';
  const element = typeOf(inner);
  return element && element !== 'object' ? `${element}[]` : null;
}

function kindOf(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? 'number' : null;
  if (typeof value === 'string') return 'string';
  if (typeof value === 'boolean') return 'boolean';
  if (Array.isArray(value)) return 'array';
  return 'object';
}

const show = (value) => JSON.stringify(value);

const statementOf = (text) =>
  text
    .replace(/^Write a python function/i, 'Write a function')
    .replace(/^Write a function in python/i, 'Write a function')
    .replace(/\bpython\b/gi, 'TypeScript')
    .trim();

export async function importMbpp(source) {
  const lines = (await readFile(source, 'utf8')).trim().split('\n');
  const problems = [];
  const skipped = new Map();

  const skip = (why) => skipped.set(why, (skipped.get(why) ?? 0) + 1);

  for (const line of lines) {
    const record = JSON.parse(line);
    const assertions = [...record.test_list, ...(record.challenge_test_list ?? [])];

    let parsed;
    try {
      parsed = assertions.map(parseAssertion);
    } catch (error) {
      skip(error instanceof NotALiteral ? error.message.slice(0, 40) : 'parse error');
      continue;
    }

    if (new Set(parsed.map((entry) => entry.name)).size !== 1) {
      skip('assertions call different functions');
      continue;
    }
    if (new Set(parsed.map((entry) => entry.values.length)).size !== 1) {
      skip('assertions disagree on arity');
      continue;
    }

    const arity = parsed[0].values.length;
    const params = [];
    let usable = true;

    for (let index = 0; index < arity; index += 1) {
      const type = typeOf(parsed.map((entry) => entry.values[index]));
      if (!type) {
        usable = false;
        break;
      }
      params.push(type);
    }

    const returns = typeOf(parsed.map((entry) => entry.expected));
    if (!usable || !returns) {
      skip('types do not agree across the assertions');
      continue;
    }

    const name = camel(parsed[0].name);
    const names = labelsFor(params);
    const signature = names.map((label, index) => `${label}: ${params[index]}`).join(', ');
    const title = titleOf(record.text);

    problems.push({
      n: FIRST_NUMBER + record.task_id,
      title,
      slug: `${slugify(title)}-${record.task_id}`,
      difficulty: 'Easy',
      source: 'MBPP · Google Research · Apache 2.0',
      pattern: 'One idea, written out directly',
      complexity: 'Not stated for this set - aim for the obvious single pass',
      statement: `\n${statementOf(record.text)}\n`,
      examples: parsed.map(
        (entry) =>
          `Input:  ${names.map((label, index) => `${label} = ${show(entry.values[index])}`).join(', ')}\nOutput: ${show(entry.expected)}`,
      ),
      constraints: [],
      stub: `\nexport function ${name}(${signature}): ${returns} {\n  throw new Error('Not implemented');\n}\n`,
    });
  }

  return { problems, skipped: [...skipped].sort((a, b) => b[1] - a[1]) };
}

function titleOf(text) {
  const cleaned = statementOf(text)
    .replace(/^Write a function (to|that|which)\s+/i, '')
    .replace(/^Write a TypeScript function (to|that|which)\s+/i, '')
    .replace(/^Write a program (to|that|which)\s+/i, '')
    .replace(/[.?!]$/, '')
    .trim();

  const words = cleaned.split(/\s+/).slice(0, 8).join(' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export { FIRST_NUMBER };
