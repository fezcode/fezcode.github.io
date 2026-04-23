import { copyFile } from 'node:fs/promises';

await copyFile('dist/client/index.html', 'dist/client/404.html');
console.log('post-build: copied dist/client/index.html -> dist/client/404.html');
