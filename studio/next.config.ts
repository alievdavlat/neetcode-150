import path from 'node:path';
import type { NextConfig } from 'next';

/**
 * The page and the API both read the problem tree and spawn the runner out of
 * the parent workspace, none of it reachable by import. Tracing only follows
 * imports, so every one of these files is named here or it never reaches the
 * deployment - and a route left off this list boots without a workspace.
 */
const WORKSPACE = [
  '../*-*/**',
  '../shared/**',
  '../tests/**',
  '../_gen/**',
  '../package.json',
  './bridge/**',
  './collections/**',
];

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve() },
  outputFileTracingRoot: path.resolve('..'),
  outputFileTracingIncludes: {
    '/': WORKSPACE,
    '/api/**': WORKSPACE,
  },
};

export default nextConfig;
