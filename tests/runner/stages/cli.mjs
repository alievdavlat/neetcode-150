import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { paint } from '../report.mjs';
import { NO_NEEDS, profile, verdictFor } from '../machine.mjs';
import { challengesDir, loadChallenge, runChallenge } from './run.mjs';

/**
 * `npm run stage -- <challenge> [upTo] [--solution <file>]`
 *
 * With no challenge it lists what this machine can run, which is the whole
 * point of the profile: the laptop and the desktop should say different things
 * without anyone configuring either.
 */

const args = process.argv.slice(2);
const flag = (name) => {
  const at = args.indexOf(name);
  return at === -1 ? null : args[at + 1];
};

const positional = args.filter((value, index) => !value.startsWith('--') && !args[index - 1]?.startsWith('--'));

const STATE = {
  ready: paint.green('ready'),
  heavy: paint.yellow('heavy'),
  unavailable: paint.red('unavailable'),
};

const stageLine = (index, result) => {
  const mark = result.passed ? paint.green('  ok') : paint.red('   x');
  const name = `${String(index + 1).padStart(2)}  ${result.title ?? result.slug}`;

  return `${mark} ${name.padEnd(52)} ${paint.grey(`${result.ms} ms`)}`;
};

async function list() {
  const machine = await profile();
  const docker = machine.docker.available
    ? `docker ${machine.docker.version} with ${machine.docker.memoryMb} MB`
    : paint.grey('docker not running');

  console.log('');
  console.log(
    `  ${paint.bold('this machine')}  ${machine.cores} cores · ${machine.memoryMb} MB · ${machine.freeMb} MB free · ${docker}`,
  );
  console.log('');

  const dir = challengesDir();
  const slugs = (await readdir(dir, { withFileTypes: true }).catch(() => []))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  if (slugs.length === 0) {
    console.log(paint.grey(`  no challenges in ${path.relative(process.cwd(), dir)}`));
    return 0;
  }

  for (const slug of slugs) {
    const challenge = await loadChallenge(slug, dir);
    const { state, reason } = verdictFor(challenge.needs ?? NO_NEEDS, machine);
    const note = reason === null ? '' : paint.grey(` — ${reason}`);

    console.log(`  ${slug.padEnd(22)} ${String(challenge.stages.length).padStart(2)} stages   ${STATE[state]}${note}`);
    console.log(`  ${paint.grey(challenge.title)}`);
    console.log('');
  }

  console.log(paint.grey('  npm run stage -- <challenge> [upTo]'));
  console.log('');

  return 0;
}

async function main() {
  if (positional.length === 0) return list();

  const [slug, upTo] = positional;
  const machine = await profile();
  const challenge = await loadChallenge(slug);
  const { state, reason } = verdictFor(challenge.needs ?? NO_NEEDS, machine);

  if (state === 'unavailable') {
    console.log(`\n  ${paint.red('cannot run here')} — ${reason}\n`);
    return 1;
  }

  if (state === 'heavy') console.log(`\n  ${paint.yellow('heavy on this machine')} — ${reason}`);

  console.log(`\n${paint.bold(challenge.title)}  ${paint.grey(`${challenge.stages.length} stages`)}\n`);

  const report = await runChallenge(slug, {
    upTo: upTo === undefined ? Infinity : Number(upTo),
    entry: flag('--solution'),
  });

  report.results.forEach((result, index) => {
    console.log(stageLine(index, result));

    if (result.passed) return;

    for (const line of result.log) console.log(paint.grey(`       ${line}`));
    console.log(`       ${paint.red(result.message)}`);
    if (result.output) {
      /** The first lines, not the last: a crash says what went wrong at the top. */
      console.log(paint.grey('       what your program printed:'));
      for (const line of result.output.split('\n').slice(0, 8)) console.log(paint.grey(`         ${line}`));
    }
  });

  const passed = report.results.filter((result) => result.passed).length;
  console.log('');
  console.log(
    `  ${passed}/${report.total} stages  ${passed === report.total ? paint.green('complete') : paint.grey('keep going')}`,
  );
  console.log('');

  return report.passed ? 0 : 1;
}

process.exitCode = await main();
