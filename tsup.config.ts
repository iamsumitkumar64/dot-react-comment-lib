import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/lib/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: false,
  minify: true,
  treeshake: true,
  splitting: false,
  tsconfig: 'tsconfig.build.json',
  banner: {
    js: "'use client';",
  },
  external: [
    'react',
    'react-dom',
    '@mui/material',
    '@mui/icons-material',
    '@emotion/react',
    '@emotion/styled',
    'emoji-picker-react',
    'react-hook-form',
    '@hookform/resolvers',
    'zod',
  ],
});
