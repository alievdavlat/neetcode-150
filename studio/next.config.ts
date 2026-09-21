import path from 'node:path';
import type { NextConfig } from 'next';

/**
 * The page and the API both read the problem tree and spawn the runner out of
 * the parent workspace, none of it reachable by import. Tracing only follows
 * imports, so every one of these files is named here or it never reaches the
 * deployment - and a deployment without them boots with no workspace at all.
 */
const WORKSPACE = [
  '../*-*/**',
  '../shared/**',
  '../tests/**',
  '../_gen/**',
  '../package.json',
  '../tsconfig.json',
  './bridge/**',
  './collections/**',
  './courses/**',
  './data/**',
  // The typecheck endpoint loads the compiler itself, and reads the node types.
  './node_modules/typescript/lib/**',
  './node_modules/@types/node/**',
];

/**
 * The workspace, pinned explicitly: the parent holds its own lockfile, so left
 * to infer it Next picks one and warns. Tracing has to reach up there for the
 * files above, and Turbopack refuses to disagree with tracing about the root.
 */
const ROOT = path.resolve('..');

const nextConfig: NextConfig = {
  turbopack: { root: ROOT },
  outputFileTracingRoot: ROOT,
  /** Every page reads the problem tree too, not only the API, so this is all of them. */
  outputFileTracingIncludes: {
    '/': WORKSPACE,
    '/**': WORKSPACE,
  },
  /**
   * No `outputFileTracingExcludes` here on purpose: the Turbopack build ignores
   * it (measured on 16.3.5 - three glob spellings, monaco-editor stayed at its
   * 93 MB in the trace), so writing one would only look like it was doing
   * something. The deploy fits regardless.
   */
};

export default nextConfig;
