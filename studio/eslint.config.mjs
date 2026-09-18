import next from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

/** Next's own flat config, plus the few rules this workspace cares about beyond tsc. */
export default [
  ...next,
  ...typescript,
  {
    ignores: ['.next/**', 'public/monaco/**', '.studio/**', 'courses/**', 'next-env.d.ts'],
  },
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
