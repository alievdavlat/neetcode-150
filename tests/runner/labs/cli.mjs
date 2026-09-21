import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { paint } from '../report.mjs';
import { NO_NEEDS, profile, verdictFor } from '../machine.mjs';
import { labsDir, loadLab, runLab } from './run.mjs';

/**
 * `npm run lab -- <slug> [--keep]`
 *
 * With no lab it lists what this machine can bring up. `--keep` leaves the
 * stack running afterwards, which is what you want while you are still
 * editing the compose file.
 */

const args = process.argv.slice(2);
const positional = args.filter((value) => !value.startsWith('--'));

const STATE = {
  ready: paint.green('ready'),
  heavy: paint.yellow('heavy'),
  unavailable: paint.red('unavailable'),
};

const line = (index, result) => {
  const mark = result.passed ? paint.green('  ok') : paint.red('   x');
  const name = `${String(index + 1).padStart(2)}  ${result.title ?? result.slug}`;

  return `${mark} ${name.padEnd(54)} ${paint.grey(`${(result.ms / 1000).toFixed(1)} s`)}`;
};

async function list(machine) {
  const docker = machine.docker.available
    ? `docker ${machine.docker.version} with ${machine.docker.memoryMb} MB`
    : paint.red('docker not running');

  console.log('');
  console.log(`  ${paint.bold('this machine')}  ${machine.cores} cores · ${machine.freeMb} MB free · ${docker}`);
  console.log('');

  const dir = labsDir();
  const slugs = (await readdir(dir, { withFileTypes: true }).catch(() => []))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const slug of slugs) {
    const lab = await loadLab(slug, dir);
    const { state, reason } = verdictFor(lab.needs ?? NO_NEEDS, machine);
    const note = reason === null ? '' : paint.grey(` — ${reason}`);

    console.log(`  ${slug.padEnd(18)} ${String(lab.checks.length).padStart(2)} checks   ${STATE[state]}${note}`);
    console.log(`  ${paint.grey(lab.title)}`);
    console.log('');
  }

  console.log(paint.grey('  npm run lab -- <lab> [--keep]'));
  console.log('');

  return 0;
}

async function main() {
  const machine = await profile();
  if (positional.length === 0) return list(machine);

  const [slug] = positional;
  const lab = await loadLab(slug);
  const { state, reason } = verdictFor(lab.needs ?? NO_NEEDS, machine);

  if (state === 'unavailable') {
    console.log(`\n  ${paint.red('cannot run here')} — ${reason}`);
    console.log(paint.grey('  the stack, the task and the checks are still readable; run it where there is room\n'));
    return 1;
  }

  if (state === 'heavy') console.log(`\n  ${paint.yellow('heavy on this machine')} — ${reason}`);

  console.log(`\n${paint.bold(lab.title)}  ${paint.grey(`${lab.checks.length} checks`)}`);
  console.log(paint.grey('  bringing the stack up — the first run downloads images, which takes a few minutes\n'));

  const report = await runLab(slug, { machine, keep: args.includes('--keep') });

  report.results.forEach((result, index) => {
    console.log(line(index, result));

    /** What a check measured is worth reading when it passed, not only when it did not. */
    for (const entry of result.log) console.log(paint.grey(`       ${entry}`));
    if (!result.passed) console.log(`       ${paint.red(result.message)}`);
  });

  const passed = report.results.filter((result) => result.passed).length;
  console.log('');
  console.log(`  ${passed}/${report.total} checks  ${passed === report.total ? paint.green('the stack holds') : paint.grey('keep going')}`);
  console.log('');

  return report.passed ? 0 : 1;
}

/** A stack that would not come up is a message, not a stack trace. */
process.exitCode = await main().catch((error) => {
  console.log(`\n  ${paint.red('the stack did not come up')}`);
  console.log(`  ${error instanceof Error ? error.message : String(error)}\n`);

  return 1;
});
