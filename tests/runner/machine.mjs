import { exec } from 'node:child_process';
import os from 'node:os';

/**
 * What this machine can be asked to run.
 *
 * A lab that makes an 8 GB laptop swap is a lab that never gets used, so every
 * challenge and lab declares what it needs and this decides whether to offer
 * it. Measured rather than configured: a laptop and a desktop should behave
 * differently without anyone editing a setting.
 */

const MB = 1024 * 1024;

/** Docker is asked once and given a short leash; a missing daemon must not stall a page. */
const DOCKER_TIMEOUT_MS = 4000;

const ask = (command, timeoutMs) =>
  new Promise((resolve) => {
    exec(command, { timeout: timeoutMs, windowsHide: true }, (error, stdout) =>
      resolve(error ? null : stdout.trim()),
    );
  });

/**
 * Docker's own memory allowance, which on Windows and macOS is a virtual
 * machine's fixed slice and has nothing to do with the host's free memory. It
 * is the number that decides whether a stack fits.
 */
async function docker() {
  const answer = await ask('docker info --format "{{.MemTotal}}|{{.ServerVersion}}|{{.ContainersRunning}}"', DOCKER_TIMEOUT_MS);
  if (answer === null) return { available: false, memoryMb: 0, version: null, running: 0 };

  const [memory, version, running] = answer.split('|');

  return {
    available: true,
    memoryMb: Math.round(Number(memory) / MB) || 0,
    version: version ?? null,
    running: Number(running) || 0,
  };
}

/**
 * A profile is a snapshot, not a constant: free memory is the half that moves,
 * and it is the half that decides whether the next lab starts.
 */
export async function profile() {
  const total = Math.round(os.totalmem() / MB);
  const free = Math.round(os.freemem() / MB);

  return {
    at: new Date().toISOString(),
    platform: `${os.platform()} ${os.release()}`,
    cores: os.cpus().length,
    memoryMb: total,
    freeMb: free,
    docker: await docker(),
  };
}

/** Everything a piece of work can ask for. Absent means none of it. */
export const NO_NEEDS = { memoryMb: 0, containers: 0, docker: false };

/**
 * Whether this machine should offer a piece of work, and in what words.
 *
 * `ready` runs. `heavy` runs but takes most of what is free, which the learner
 * should know before their editor starts swapping. `unavailable` refuses, and
 * says with what arithmetic - a refusal without a number is a shrug.
 */
export function verdictFor(needs, machine) {
  const want = { ...NO_NEEDS, ...needs };

  if (want.docker && !machine.docker.available) {
    return { state: 'unavailable', reason: 'Docker is not running' };
  }

  const budget = want.docker ? machine.docker.memoryMb : machine.freeMb;
  const pool = want.docker ? 'Docker' : 'free memory';

  if (want.memoryMb > budget) {
    return { state: 'unavailable', reason: `needs ${want.memoryMb} MB, ${pool} has ${budget} MB` };
  }

  if (want.memoryMb > budget / 2) {
    return { state: 'heavy', reason: `needs ${want.memoryMb} MB of the ${budget} MB ${pool} left` };
  }

  return { state: 'ready', reason: null };
}
