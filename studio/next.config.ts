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

/** The parent workspace holds its own lockfile; pin the root so Turbopack stays inside the studio. */
const nextConfig: NextConfig = {
  turbopack: { root: path.resolve() },
  outputFileTracingRoot: path.resolve('..'),
  /** Every page reads the problem tree too, not only the API, so this is all of them. */
  outputFileTracingIncludes: {
    '/': WORKSPACE,
    '/**': WORKSPACE,
  },
};

export default nextConfig;
