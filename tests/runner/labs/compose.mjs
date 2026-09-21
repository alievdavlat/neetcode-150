import { execFile } from 'node:child_process';
import path from 'node:path';

/**
 * Docker Compose, as the few verbs a lab needs.
 *
 * Every lab runs under its own project name, so a lab that crashes leaves
 * containers that can be found and removed rather than anonymous ones mixed in
 * with whatever else the machine is running.
 */

const DEFAULT_TIMEOUT_MS = 60000;

/** The first `up` on a machine downloads images, which is minutes, not seconds. */
const UP_TIMEOUT_MS = 600000;

/** Pull progress is most of what compose prints and none of what went wrong. */
const NOISE = /Pulling|Downloading|Extracting|Waiting|Verifying|Download complete|Pull complete|fs layer|Already exists/;

const why = (stderr, stdout, fallback) => {
  const lines = `${stderr || stdout || fallback}`
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '' && !NOISE.test(line));

  return lines.slice(-6).join('; ').slice(-400) || fallback;
};

const run = (args, { cwd, timeoutMs = DEFAULT_TIMEOUT_MS }) =>
  new Promise((resolve, reject) => {
    execFile('docker', args, { cwd, timeout: timeoutMs, windowsHide: true, maxBuffer: 16 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        const what = args.slice(4).join(' ') || args.join(' ');
        const timedOut = error.killed === true;

        reject(
          new Error(
            timedOut
              ? `docker ${what} was still going after ${Math.round(timeoutMs / 1000)}s and was stopped`
              : `docker ${what} failed: ${why(stderr, stdout, error.message)}`,
          ),
        );
        return;
      }

      resolve(stdout.trim());
    });
  });

export function composeFor({ dir, file = 'docker-compose.yml', project }) {
  const base = ['compose', '-f', path.join(dir, file), '-p', project];
  const compose = (args, options = {}) => run([...base, ...args], { cwd: dir, ...options });

  return {
    project,

    /**
     * Idempotent, and cheap once the stack is up. `--build` because the lab's
     * services are built from the folder you are editing: without it a run
     * would judge the last edit but one.
     */
    up: () => compose(['up', '-d', '--build', '--remove-orphans'], { timeoutMs: UP_TIMEOUT_MS }),

    /** `kill` rather than `stop`: a crash is the interesting case, not a polite shutdown. */
    kill: (service) => compose(['kill', service]),

    start: (service) => compose(['start', service]),
    restart: (service) => compose(['restart', service]),
    stop: (service) => compose(['stop', service]),

    /**
     * A restart keeps the container, and with it everything written inside it.
     * Only a replacement throws that away, which is the difference a volume
     * exists to cover - so persistence is checked with this, never `restart`.
     */
    recreate: (service) => compose(['up', '-d', '--force-recreate', service], { timeoutMs: UP_TIMEOUT_MS }),

    /** Whatever happened, nothing is left behind - including the volumes. */
    down: () => compose(['down', '-v', '--remove-orphans'], { timeoutMs: 60000 }),

    ps: async () => {
      const raw = await compose(['ps', '--format', 'json']);
      return raw
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => JSON.parse(line));
    },

    logs: (service, lines = 40) => compose(['logs', '--no-color', '--tail', String(lines), service]),
  };
}

/** The compose file a lab ships is the learner's to edit, so it is read, never written. */
export const labFile = (dir, name) => path.join(dir, name);
