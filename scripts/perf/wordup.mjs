import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, preview } from 'vite';
import react from '@vitejs/plugin-react';

// Isolated optimized bundle: no route generation or existing OG artwork changes.
const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);
const label = process.argv[2] || 'current';
if (!/^[a-z0-9-]+$/.test(label))
  throw new Error('Use a simple alphanumeric label.');
const port = Number(process.argv[3] || 5198);
const outDir = path.join(root, 'node_modules/.cache/wordup-perf', label);
const config = {
  root,
  configFile: false,
  plugins: [react()],
  publicDir: false,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: { input: path.join(root, 'scripts/perf/wordup.html') },
  },
};
await build(config);
const server = await preview({
  ...config,
  preview: { host: '127.0.0.1', port, strictPort: true },
});
server.printUrls();
console.log(`Profile at http://127.0.0.1:${port}/scripts/perf/wordup.html`);
