import { readdir, readFile, mkdir, rm } from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { connect, parseResponse, request, startProgram } from './context.mjs';

/**
 * Run a challenge's stages against the learner's program.
 *
 * A challenge is data - a folder of stages, each a description and a tester -
 * and this is the only code that knows how to walk one. Adding "build your own
 * Git" adds a folder, not a runner.
 */

const ROOT = new URL('../../../', import.meta.url);

const PORT_FREE_MS = 3000;
const STAGE_TIMEOUT_MS = 20000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const challengesDir = () => path.join(fileURLToPath(ROOT), 'challenges');

const busy = (port) =>
  new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' });
    const done = (answer) => {
      socket.destroy();
      resolve(answer);
    };
    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
  });

/** A stage starts from nothing, so the port has to be nothing first. */
async function waitForFreePort(port) {
  const deadline = Date.now() + PORT_FREE_MS;
  while (Date.now() < deadline) {
    if (!(await busy(port))) return true;
    await wait(50);
  }

  return false;
}

export async function loadChallenge(slug, dir = challengesDir()) {
  const home = path.join(dir, slug);
  const raw = await readFile(path.join(home, 'challenge.json'), 'utf8').catch(() => null);
  if (raw === null) throw new Error(`no challenge called ${slug} in ${dir}`);

  const challenge = JSON.parse(raw);
  const stageDir = path.join(home, 'stages');
  const folders = (await readdir(stageDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const stages = [];
  for (const folder of folders) {
    const module = await import(pathToFileURL(path.join(stageDir, folder, 'tester.mjs')).href);
    const description = await readFile(path.join(stageDir, folder, 'description.md'), 'utf8').catch(() => '');

    stages.push({ slug: folder, description, tester: module.default });
  }

  return { ...challenge, home, stages };
}

/** Where a stage may write; emptied first, so a stage never sees the last run's files. */
async function freshTmp(home, slug) {
  const dir = path.join(home, '.tmp', slug);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  return dir;
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
 * One stage: a clean program, the tester, and the program stopped again
 * whatever happened. A tester fails by throwing; the message it throws is what
 * the learner reads, so testers say what they wanted rather than that an
 * assertion failed.
 */
async function runStage(challenge, stage, entry) {
  const log = [];
  const started = Date.now();
  const tmp = await freshTmp(challenge.home, stage.slug);
  const context = { challenge, tmp, log: (line) => log.push(line), connect, request, parseResponse };

  let program = null;

  try {
    const prepared = (await stage.tester.prepare?.(context)) ?? {};

    if (!(await waitForFreePort(challenge.port))) {
      throw new Error(`port ${challenge.port} is already in use by something else`);
    }

    program = await startProgram({
      dir: challenge.home,
      run: {
        command: challenge.run.command,
        args: [...(challenge.run.flags ?? []), entry, ...(prepared.args ?? [])],
      },
      port: challenge.port,
    });

    await timed(STAGE_TIMEOUT_MS, stage.tester.run({ ...context, port: challenge.port, program }), 'the stage');

    return { slug: stage.slug, title: stage.tester.title, passed: true, message: null, log, ms: Date.now() - started };
  } catch (error) {
    return {
      slug: stage.slug,
      title: stage.tester.title,
      passed: false,
      message: error instanceof Error ? error.message : String(error),
      log,
      output: program?.output() || error.output || '',
      ms: Date.now() - started,
    };
  } finally {
    program?.stop();
    await waitForFreePort(challenge.port);
  }
}

/**
 * Stages one to `upTo`, stopping at the first failure.
 *
 * Earlier stages run again every time on purpose: a change that passes stage
 * five by breaking stage two is the lesson, not an inconvenience.
 */
export async function runChallenge(slug, { upTo = Infinity, entry = null, dir = challengesDir() } = {}) {
  const challenge = await loadChallenge(slug, dir);
  const wanted = challenge.stages.slice(0, Math.min(upTo, challenge.stages.length));
  const target = entry ?? challenge.run.entry;

  const results = [];
  for (const stage of wanted) {
    const result = await runStage(challenge, stage, target);
    results.push(result);
    if (!result.passed) break;
  }

  return {
    slug: challenge.slug,
    title: challenge.title,
    total: challenge.stages.length,
    entry: target,
    results,
    passed: results.length === wanted.length && results.every((result) => result.passed),
  };
}
