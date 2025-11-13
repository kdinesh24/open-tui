#!/usr/bin/env node
import { build } from 'bun';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Building tyxt...');

await build({
  entrypoints: [join(__dirname, 'src/index.ts')],
  outdir: join(__dirname, 'dist'),
  target: 'node',
  format: 'esm',
  minify: false,
  sourcemap: 'none',
  external: ['@opentui/core'],
  naming: {
    entry: 'index.js',
  },
});

console.log('Build complete!');
