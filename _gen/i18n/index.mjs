import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** The prose. `examples`, `stub` and `complexity` are deliberately not here. */
export const TRANSLATED = ['title', 'statement', 'pattern', 'followUp', 'constraints'];

const cache = new Map();

async function forCategory(locale, dir) {
  const key = `${locale}/${dir}`;
  if (cache.has(key)) return cache.get(key);

  const loaded = readFile(path.join(HERE, locale, `${dir}.json`), 'utf8')
    .then((raw) => JSON.parse(raw))
    .catch(() => ({}));

  cache.set(key, loaded);
  return loaded;
}

/**
 * The same problems with whatever this language has for them. A field with no
 * translation keeps the English one, so a half-translated category reads as a
 * mix rather than as holes - and nothing here can change a test case, because
 * the fields the runner parses are not in {@link TRANSLATED}.
 */
export async function localize(problems, locale) {
  if (!locale || locale === 'en') return problems;

  const dirs = [...new Set(problems.map((problem) => problem.dir))];
  const byDir = new Map(await Promise.all(dirs.map(async (dir) => [dir, await forCategory(locale, dir)])));

  return problems.map((problem) => {
    const said = byDir.get(problem.dir)?.[problem.number];
    if (!said) return problem;

    const out = { ...problem };
    for (const field of TRANSLATED) {
      if (said[field] !== undefined && said[field] !== null) out[field] = said[field];
    }

    return out;
  });
}
