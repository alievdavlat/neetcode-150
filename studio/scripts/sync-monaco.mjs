import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

/**
 * Copy the Monaco bundle into `public/` so the editor loads from this machine
 * instead of a CDN — the studio has to work on a plane too.
 */
const require = createRequire(import.meta.url);

const monacoRoot = (() => {
  try {
    return path.dirname(require.resolve('monaco-editor/package.json'));
  } catch {
    return path.resolve('node_modules/monaco-editor');
  }
})();

const { version } = JSON.parse(await readFile(path.join(monacoRoot, 'package.json'), 'utf8'));
const target = path.resolve('public/monaco');
const stamp = path.join(target, 'version.txt');

const installed = existsSync(stamp) ? (await readFile(stamp, 'utf8')).trim() : null;
if (installed === version) {
  console.log(`monaco ${version} already in public/monaco`);
  process.exit(0);
}

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(path.join(monacoRoot, 'min', 'vs'), path.join(target, 'vs'), { recursive: true });
await writeFile(stamp, version);

console.log(`copied monaco ${version} into public/monaco`);
