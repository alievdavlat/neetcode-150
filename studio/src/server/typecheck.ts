import { spawn } from 'node:child_process';
import path from 'node:path';
import type { TypeMarker } from '@/lib/types';
import { WORKSPACE_ROOT } from './workspace';

const TSC = path.join(WORKSPACE_ROOT, 'node_modules', 'typescript', 'bin', 'tsc');
const LINE = /^(.+?)\((\d+),(\d+)\): error (TS\d+): (.*)$/;
const TIMEOUT_MS = 60000;

/** `tsc --noEmit` over the workspace; it exits non-zero when it finds something, which is not a failure here. */
function compile(): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [TSC, '--noEmit', '--pretty', 'false'], {
      cwd: WORKSPACE_ROOT,
      windowsHide: true,
    });

    let out = '';
    let err = '';
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`tsc did not answer within ${TIMEOUT_MS}ms`));
    }, TIMEOUT_MS);

    child.stdout.on('data', (chunk) => (out += chunk));
    child.stderr.on('data', (chunk) => (err += chunk));
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });

    child.on('close', () => {
      clearTimeout(timer);
      if (out.trim() === '' && err.trim() !== '') return reject(new Error(err.trim().slice(0, 200)));
      resolve(out);
    });
  });
}

/** Every diagnostic the compiler reports for one problem file. */
export async function typecheckFile(file: string): Promise<TypeMarker[]> {
  const output = await compile();

  return output
    .split('\n')
    .flatMap((line) => {
      const match = line.trim().match(LINE);
      if (!match) return [];

      const [, reported, row, column, code, message] = match;
      if (reported.replace(/\\/g, '/') !== file) return [];

      return [{ line: Number(row), column: Number(column), code, message }];
    })
    .slice(0, 50);
}
