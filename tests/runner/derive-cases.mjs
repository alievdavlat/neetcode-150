import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readSignature } from './signature.mjs';

const DATA_DIR = new URL('../../_gen/data/', import.meta.url);

/**
 * Drop `// ...` trailing notes from every line of an example fragment. A `//`
 * inside a string is part of the value - a URL is the usual case - so quotes
 * are tracked rather than pattern-matched.
 */
function dropNote(line) {
  let quote = '';

  for (let at = 0; at < line.length; at += 1) {
    const char = line[at];

    if (quote) {
      if (char === '\\') at += 1;
      else if (char === quote) quote = '';
      continue;
    }

    if (char === '"' || char === "'" || char === '`') quote = char;
    else if (char === '/' && line[at + 1] === '/') return line.slice(0, at).trimEnd();
  }

  return line;
}

const stripComments = (text) => text.split('\n').map(dropNote).join('\n').trim();

/**
 * Evaluate a JS literal out of the authored examples. The data files are local
 * and self-authored, so a Function literal is safe here and handles nested
 * arrays, Infinity and quote styles that JSON.parse rejects.
 */
const parseLiteral = (raw) => {
  const text = stripComments(raw);
  if (text === '') throw new Error('empty value');
  if (text.includes('->')) return parseChain(text);
  return new Function('INF', 'NULL', `return (${text});`)(Infinity, null);
};

/** The linked-list problems write their examples as `1 -> 2 -> 3`. */
const parseChain = (text) => {
  const values = text.split('->').map((part) => part.trim());
  if (values.length === 1 && values[0] === 'null') return [];
  return values.filter((part) => part !== '' && part !== 'null').map(Number);
};

/** Split `a = 1, b = [2, 3]` on the commas that sit outside brackets and strings. */
const splitArguments = (source) => {
  const parts = [];
  let current = '';
  let depth = 0;
  let quote = '';

  for (const char of source) {
    if (quote) {
      if (char === quote) quote = '';
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if ('[{('.includes(char)) {
      depth += 1;
    } else if (']})'.includes(char)) {
      depth -= 1;
    } else if (char === ',' && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }
    current += char;
  }

  parts.push(current);
  return parts.filter((part) => part.trim() !== '');
};

/** Turn one authored `Input:/Output:` example into `{ args, expect }`. */
const parseExample = (example) => {
  const match = example.match(/Input:\s*([\s\S]*?)\n\s*Output:\s*([\s\S]*)$/);
  if (!match) throw new Error('no Input/Output pair');

  const args = splitArguments(stripComments(match[1])).map((part) => {
    const equals = part.indexOf('=');
    if (equals === -1) throw new Error('argument is not `name = value`');
    return parseLiteral(part.slice(equals + 1));
  });

  if (args.length === 0) throw new Error('no arguments');
  return { args, expect: parseLiteral(match[2]), source: 'example' };
};

/** Read every `_gen/data/*.mjs` and flatten it into one problem list. */
export async function loadProblems() {
  const dir = fileURLToPath(DATA_DIR);
  const files = (await readdir(dir)).filter((name) => name.endsWith('.mjs')).sort();
  const problems = [];

  for (const file of files) {
    const module = (await import(pathToFileURL(join(dir, file)).href)).default;
    for (const problem of module.problems) {
      const number = String(problem.n).padStart(3, '0');
      problems.push({
        ...problem,
        number,
        category: module.category,
        dir: module.dir,
        file: `${module.dir}/${number}-${problem.slug}.ts`,
        signature: readSignature(problem.stub),
        cases: deriveCases(problem),
      });
    }
  }

  return problems;
}

/** Best-effort test cases from the authored examples; unparseable ones are reported. */
export function deriveCases(problem) {
  const cases = [];
  const skipped = [];

  for (const [index, example] of (problem.examples ?? []).entries()) {
    try {
      cases.push({ ...parseExample(example), label: `example ${index + 1}` });
    } catch (error) {
      skipped.push({ index: index + 1, reason: error.message });
    }
  }

  return { cases, skipped };
}
