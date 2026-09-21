import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { composeFor } from './compose.mjs';
import { load, waitFor, workersFor } from './load.mjs';

/**
 * Run a lab's checks against the stack the learner wrote.
 *
 * The services under test are theirs - the compose file, the nginx config, the
 * app. The load generator and the checks are not, which is what stops a lab
 * from being graded by the thing it is grading.
 */

const ROOT = new URL('../../../', import.meta.url);

const CHECK_TIMEOUT_MS = 90000;

export const labsDir = () => path.join(fileURLToPath(ROOT), 'labs');

export async function loadLab(slug, dir = labsDir()) {
  const home = path.join(dir, slug);
  const raw = await readFile(path.join(home, 'lab.json'), 'utf8').catch(() => null);
  if (raw === null) throw new Error(`no lab called ${slug} in ${dir}`);

  const lab = JSON.parse(raw);
  const checkDir = path.join(home, 'checks');
  const folders = (await readdir(checkDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const checks = [];
  for (const folder of folders) {
    const module = await import(pathToFileURL(path.join(checkDir, folder, 'check.mjs')).href);
    const description = await readFile(path.join(checkDir, folder, 'description.md'), 'utf8').catch(() => '');

    checks.push({ slug: folder, description, check: module.default });
  }

  return { ...lab, home, checks };
}

const timed = async (ms, work, what) => {
  let timer;
  const alarm = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${what} did not finish within ${ms}ms`)), ms);
  });

  try {
    return await Promise.race([work, alarm]);
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Every check, against one stack.
 *
 * The stack comes up once and is torn down in a `finally` - including its
 * volumes. A lab that leaves containers running is a lab that eats the next
 * machine it is opened on.
 */
export async function runLab(slug, { machine, dir = labsDir(), keep = false } = {}) {
  const lab = await loadLab(slug, dir);
  const compose = composeFor({
    dir: path.join(lab.home, 'stack'),
    project: `lab-${lab.slug}`,
  });

  const results = [];
  const workers = workersFor(machine);

  try {
    await compose.up();
    await waitFor({ port: lab.port, path: lab.ready ?? '/', timeoutMs: lab.readyMs ?? 60000 });

    for (const entry of lab.checks) {
      const log = [];
      const started = Date.now();
      const context = {
        lab,
        compose,
        port: lab.port,
        workers,
        load: (options) => load({ port: lab.port, workers, ...options }),
        waitFor: (options) => waitFor({ port: lab.port, ...options }),
        log: (line) => log.push(line),
      };

      try {
        /** Each check starts from a whole stack, whatever the last one did to it. */
        await compose.up();
        await waitFor({ port: lab.port, path: lab.ready ?? '/', timeoutMs: 30000 });

        await timed(CHECK_TIMEOUT_MS, entry.check.run(context), 'the check');
        results.push({ slug: entry.slug, title: entry.check.title, passed: true, message: null, log, ms: Date.now() - started });
      } catch (error) {
        results.push({
          slug: entry.slug,
          title: entry.check.title,
          passed: false,
          message: error instanceof Error ? error.message : String(error),
          log,
          ms: Date.now() - started,
        });
      }
    }
  } finally {
    if (!keep) await compose.down().catch(() => null);
  }

  return {
    slug: lab.slug,
    title: lab.title,
    total: lab.checks.length,
    results,
    passed: results.length === lab.checks.length && results.every((result) => result.passed),
  };
}
