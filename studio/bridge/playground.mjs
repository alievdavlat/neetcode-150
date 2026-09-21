import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { challengesDir, loadChallenge } from '../../tests/runner/stages/run.mjs';
import { labsDir, loadLab } from '../../tests/runner/labs/run.mjs';
import { profile, verdictFor } from '../../tests/runner/machine.mjs';

/**
 * Every challenge and lab, with what this machine makes of it.
 *
 * The studio never imports the runners - same rule as the problems bridge -
 * so this prints JSON and the app reads it.
 */

const folders = async (dir) =>
  (await readdir(dir, { withFileTypes: true }).catch(() => []))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

const machine = await profile();

const challenges = [];
for (const slug of await folders(challengesDir())) {
  const challenge = await loadChallenge(slug, challengesDir());

  challenges.push({
    kind: 'challenge',
    slug,
    title: challenge.title,
    blurb: challenge.blurb ?? null,
    course: challenge.course ?? null,
    lessonAt: challenge.lessonAt ?? null,
    needs: challenge.needs ?? {},
    machine: verdictFor(challenge.needs ?? {}, machine),
    command: `npm run stage -- ${slug}`,
    steps: challenge.stages.map((stage) => ({
      slug: stage.slug,
      title: stage.tester.title,
      description: stage.description,
    })),
    /** The file the learner writes, relative to the workspace. */
    file: path.posix.join('challenges', slug, challenge.run.entry),
  });
}

const labs = [];
for (const slug of await folders(labsDir())) {
  const lab = await loadLab(slug, labsDir());

  labs.push({
    kind: 'lab',
    slug,
    title: lab.title,
    blurb: lab.blurb ?? null,
    course: lab.course ?? null,
    lessonAt: lab.lessonAt ?? null,
    needs: lab.needs ?? {},
    machine: verdictFor(lab.needs ?? {}, machine),
    command: `npm run lab -- ${slug}`,
    steps: lab.checks.map((check) => ({
      slug: check.slug,
      title: check.check.title,
      description: check.description,
    })),
    file: path.posix.join('labs', slug, 'stack', 'docker-compose.yml'),
  });
}

process.stdout.write(JSON.stringify({ machine, items: [...challenges, ...labs] }));
