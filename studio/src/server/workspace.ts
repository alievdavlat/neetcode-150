import { spawn } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { SourceMode } from '@/lib/types';

/** The read-only copy of the workspace that ships inside a deployment. */
const BUNDLE_ROOT = path.resolve(process.cwd(), '..');

/** Resolved, because the path guard compares this against a resolved path. */
const SERVERLESS_ROOT = path.resolve('/tmp/neetcode-workspace');

/** Everything a request may read or write, beside the numbered problem folders. */
const MIRRORED = [
  'shared',
  'tests',
  '_gen',
  'package.json',
  'tsconfig.json',
  'studio/bridge',
  'studio/collections',
  'studio/courses',
  'studio/data',
];

/**
 * A serverless filesystem is read-only outside /tmp, so saving a solution,
 * writing a note or promoting a scratch file would all fail where they work
 * locally. The tree is barely a megabyte, so a cold start mirrors it into /tmp
 * once and every path then resolves against a writable copy. The root
 * package.json travels with it: without its `type: module` the runner would
 * read the problem files as CommonJS. The mirror lives as long as the
 * container does - a session, not a lifetime.
 */
function mirrorIntoTmp(): string {
  const marker = path.join(SERVERLESS_ROOT, '.mirrored');
  if (existsSync(marker)) return SERVERLESS_ROOT;

  const problems = readdirSync(BUNDLE_ROOT).filter((name) => /^\d{2}-/.test(name));
  for (const entry of [...problems, ...MIRRORED]) {
    const from = path.join(BUNDLE_ROOT, entry);
    if (existsSync(from)) cpSync(from, path.join(SERVERLESS_ROOT, entry), { recursive: true });
  }

  mkdirSync(path.join(SERVERLESS_ROOT, 'studio', '.studio'), { recursive: true });

  /**
   * The workspace tsconfig asks for the node types, and the compiler looks for
   * them in a node_modules beside the config it reads - which is this copy,
   * not the one the studio was installed with.
   */
  const nodeTypes = path.join(process.cwd(), 'node_modules', '@types', 'node');
  if (existsSync(nodeTypes)) {
    cpSync(nodeTypes, path.join(SERVERLESS_ROOT, 'node_modules', '@types', 'node'), { recursive: true });
  }

  writeFileSync(marker, '');
  return SERVERLESS_ROOT;
}

/** The mirror is a deployment concern; a failed copy should not take the app down. */
function serverlessRoot(): string {
  try {
    return mirrorIntoTmp();
  } catch {
    return BUNDLE_ROOT;
  }
}

export const WORKSPACE_ROOT = process.env.NEETCODE_ROOT
  ? path.resolve(process.env.NEETCODE_ROOT)
  : process.env.VERCEL
    ? serverlessRoot()
    : BUNDLE_ROOT;

export const STUDIO_ROOT = path.join(WORKSPACE_ROOT, 'studio');

/** Practice copies live here, one mirror of the problem tree, gitignored. */
export const SCRATCH_PREFIX = 'studio/.studio/scratch';

const BRIDGE_DIR = path.join(STUDIO_ROOT, 'bridge');
const NODE_FLAGS = ['--experimental-strip-types', '--disable-warning=ExperimentalWarning'];
const PROBLEM_FILE = /^\d{2}-[a-z0-9-]+\/\d{3,4}-[a-z0-9-]+\.ts$/;

/** The path the runner reads, relative to the workspace root. */
export function problemPath(file: string, mode: SourceMode): string {
  if (!PROBLEM_FILE.test(file)) throw new Error(`not a problem file: ${file}`);

  return mode === 'scratch' ? `${SCRATCH_PREFIX}/${file}` : file;
}

/** Only the generated problem files and their practice copies are reachable. */
export function resolveProblemFile(file: string, mode: SourceMode = 'file'): string {
  const absolute = path.resolve(WORKSPACE_ROOT, problemPath(file, mode));
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
