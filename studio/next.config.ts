import path from 'node:path';
import type { NextConfig } from 'next';

/** The parent workspace holds its own lockfile; pin the root so Turbopack stays inside the studio. */
const nextConfig: NextConfig = {
  turbopack: { root: path.resolve() },
};

export default nextConfig;
