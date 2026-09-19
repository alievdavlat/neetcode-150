import path from 'node:path';
import type { NextConfig } from 'next';

/** The parent workspace holds its own lockfile; pin the root so Turbopack stays inside the studio. */
const nextConfig: NextConfig = {
  turbopack: { root: path.resolve() },

  /**
   * The API reads the problem tree and spawns the runner out of the parent
   * workspace, none of it reachable by import. Tracing only follows imports,
   * so those files are named here or they never reach the deployment.
   */
  outputFileTracingRoot: path.resolve('..'),
  outputFileTracingIncludes: {
    '/api/**': [
      '../*-*/**',
      '../shared/**',
      '../tests/**',
      '../_gen/**',
      '../package.json',
      './bridge/**',
      './collections/**',
    ],
  },
};

export default nextConfig;
