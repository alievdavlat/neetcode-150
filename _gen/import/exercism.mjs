import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Turn Exercism's problem specifications into this workspace's problem shape.
 *
 * The repository is MIT licensed and already language agnostic: each exercise
 * carries prose and a canonical-data.json whose cases name their arguments. A
 * case is only taken when its inputs and expected value are plain JSON and the
 * types agree across the whole exercise; error cases and shape disagreements
 * are skipped rather than guessed at.
 */

const FIRST_NUMBER = 3000;

const titleCase = (slug) =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const camel = (name) =>
  name
    .replace(/[^A-Za-z0-9]+(.)?/g, (_, next) => (next ? next.toUpperCase() : ''))
    .replace(/^(.)/, (first) => first.toLowerCase());

/** Walk the nested `cases` groups down to the ones that actually assert something. */
function flatten(cases, out = []) {
  for (const entry of cases ?? []) {
    if (Array.isArray(entry.cases)) flatten(entry.cases, out);
    else if (entry.property && entry.input && 'expected' in entry) out.push(entry);
  }
  return out;
}

function kindOf(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? 'number' : null;
  if (typeof value === 'string') return 'string';
  if (typeof value === 'boolean') return 'boolean';
  if (Array.isArray(value)) return 'array';
  return 'object';
}

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

const readable = (markdown) =>
  markdown
    .replace(/^#.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

async function statementFor(dir) {
  for (const name of ['instructions.md', 'introduction.md']) {
    const text = await readFile(join(dir, name), 'utf8').catch(() => null);
    if (text) {
      const clean = readable(text);
      if (clean.length > 40) return clean.slice(0, 1400);
    }
  }

  const meta = await readFile(join(dir, 'metadata.toml'), 'utf8').catch(() => '');
  return /blurb\s*=\s*"([^"]*)"/.exec(meta)?.[1] ?? null;
}

export async function importExercism(root) {
  const slugs = (await readdir(root, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const problems = [];
  const skipped = new Map();
  const skip = (why) => skipped.set(why, (skipped.get(why) ?? 0) + 1);
  let next = FIRST_NUMBER;

  for (const slug of slugs) {
    const dir = join(root, slug);
    const raw = await readFile(join(dir, 'canonical-data.json'), 'utf8').catch(() => null);
    if (!raw) {
      skip('no canonical data');
      continue;
    }

    const all = flatten(JSON.parse(raw).cases);
    const property = all[0]?.property;

    /** `expected: { error: ... }` is a thrown-error case, which has no example form here. */
    const cases = all.filter(
      (entry) => entry.property === property && entry.expected !== null && kindOf(entry.expected) !== 'object',
    );

    if (cases.length < 2) {
      skip('fewer than two usable cases');
      continue;
    }

    const keys = Object.keys(cases[0].input);
    if (keys.length === 0 || cases.some((entry) => Object.keys(entry.input).join() !== keys.join())) {
      skip('cases disagree on their arguments');
      continue;
    }

    const params = keys.map((key) => typeOf(cases.map((entry) => entry.input[key])));
    const returns = typeOf(cases.map((entry) => entry.expected));
    if (params.some((type) => !type) || !returns) {
      skip('types do not agree across the cases');
      continue;
    }

    const statement = await statementFor(dir);
    if (!statement) {
      skip('no prose to show');
      continue;
    }

    const names = keys.map((key) => camel(key) || 'value');
    const signature = names.map((label, index) => `${label}: ${params[index]}`).join(', ');

    problems.push({
      n: (next += 1),
      title: titleCase(slug),
      slug,
      difficulty: 'Easy',
      source: 'Exercism problem specifications · MIT',
      pattern: 'Read the rule carefully, then write it out',
      complexity: 'Not stated for this set',
      statement: `\n${statement}\n`,
      examples: cases
        .slice(0, 6)
        .map(
          (entry) =>
            `Input:  ${names.map((label, index) => `${label} = ${JSON.stringify(entry.input[keys[index]])}`).join(', ')}\nOutput: ${JSON.stringify(entry.expected)}`,
        ),
      constraints: [],
      stub: `\nexport function ${camel(property)}(${signature}): ${returns} {\n  throw new Error('Not implemented');\n}\n`,
    });
  }

  return { problems, skipped: [...skipped].sort((a, b) => b[1] - a[1]) };
}

export { FIRST_NUMBER };
