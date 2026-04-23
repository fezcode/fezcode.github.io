import { copyFile } from 'node:fs/promises';

const start = Date.now();
await copyFile('dist/client/index.html', 'dist/client/404.html');
const elapsed = Date.now() - start;
console.log(`post-build: copied dist/client/index.html -> dist/client/404.html (${elapsed}ms)`);
