import { spawn } from 'node:child_process';
import path from 'node:path';

export const WORKSPACE_ROOT = process.env.NEETCODE_ROOT
  ? path.resolve(process.env.NEETCODE_ROOT)
  : path.resolve(process.cwd(), '..');

export const STUDIO_ROOT = path.join(WORKSPACE_ROOT, 'studio');

const BRIDGE_DIR = path.join(STUDIO_ROOT, 'bridge');
const NODE_FLAGS = ['--experimental-strip-types', '--disable-warning=ExperimentalWarning'];
const PROBLEM_FILE = /^\d{2}-[a-z0-9-]+\/\d{3}-[a-z0-9-]+\.ts$/;

/** Only the generated problem files are reachable — nothing else in the workspace. */
export function resolveProblemFile(file: string): string {
  if (!PROBLEM_FILE.test(file)) throw new Error(`not a problem file: ${file}`);

  const absolute = path.resolve(WORKSPACE_ROOT, file);
  if (!absolute.startsWith(WORKSPACE_ROOT + path.sep)) throw new Error(`path escapes the workspace: ${file}`);

  return absolute;
}

interface BridgeOptions {
  script: string;
  args?: string[];
  timeoutMs?: number;
}

/**
 * Run one bridge script in its own process and parse the JSON it prints. A
 * child keeps an endless loop in a solution out of the dev server, and the kill
 * below is the backstop for a runner that never reports.
 */
export function runBridge<T>({ script, args = [], timeoutMs = 60000 }: BridgeOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [...NODE_FLAGS, path.join(BRIDGE_DIR, script), ...args], {
      cwd: WORKSPACE_ROOT,
      windowsHide: true,
    });

    let out = '';
    let err = '';
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`${script} did not answer within ${timeoutMs}ms`));
    }, timeoutMs);

    child.stdout.on('data', (chunk) => (out += chunk));
    child.stderr.on('data', (chunk) => (err += chunk));
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });

    child.on('close', () => {
      clearTimeout(timer);
      if (out.trim() === '') return reject(new Error(err.trim() || `${script} printed nothing`));

      try {
        resolve(JSON.parse(out) as T);
      } catch {
        reject(new Error(`${script} printed unreadable output: ${out.slice(0, 200)}`));
      }
    });
  });
}
