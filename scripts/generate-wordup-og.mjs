import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { parseArgs } from 'node:util';
import piml from 'piml';
import {
  existingOgFile,
  getWordupOgTargets,
  publishWordupOg,
} from './lib/wordup-og.mjs';

const { values } = parseArgs({
  options: {
    force: { type: 'boolean', default: false },
    slug: { type: 'string' },
    'index-only': { type: 'boolean', default: false },
    help: { type: 'boolean', default: false },
  },
});
if (values.help) {
  console.log(
    'node scripts/generate-wordup-og.mjs [--force] [--slug <slug> | --index-only]\nExisting art is preserved. --force explicitly replaces selected Wordup cards.',
  );
  process.exit(0);
}

const source = await readFile('public/wordup/words.piml', 'utf8');
const targets = getWordupOgTargets(piml.parse(source).words || [], {
  slug: values.slug,
  indexOnly: values['index-only'],
});
const pending = [];
let preserved = 0;
for (const target of targets) {
  target.output = join('public', target.file);
  if (!values.force && (await existingOgFile(target.output))) {
    preserved += 1;
    continue;
  }
  // Keep any existing build artwork if source assets were not yet persisted.
  const built = join('dist/client', target.file);
  if (!values.force && (await existingOgFile(built))) {
    await publishWordupOg(target.output, await readFile(built));
    preserved += 1;
    continue;
  }
  pending.push(target);
}

if (!pending.length) {
  console.log(
    `wordup-og: ${preserved} existing card(s) preserved; no rendering needed.`,
  );
  process.exit(0);
}

const [{ createServer }, { default: puppeteer }, { default: sharp }] =
  await Promise.all([import('vite'), import('puppeteer'), import('sharp')]);
let server;
let browser;
try {
  server = await createServer({
    configFile: false,
    root: process.cwd(),
    publicDir: resolve('public'),
    cacheDir: 'node_modules/.cache/wordup-og-vite',
    logLevel: 'error',
    optimizeDeps: {
      entries: ['scripts/og/wordup-card.html'],
      include: ['three', 'piml'],
    },
    server: { host: '127.0.0.1', port: 0, strictPort: false },
  });
  await server.listen();
  const baseUrl = server.resolvedUrls.local[0];
  browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-unsafe-swiftshader',
    ],
  });
  for (const target of pending) {
    const page = await browser.newPage();
    try {
      await page.setViewport({
        width: 1200,
        height: 630,
        deviceScaleFactor: 2,
      });
      const url = new URL('scripts/og/wordup-card.html', baseUrl);
      if (target.slug) url.searchParams.set('slug', target.slug);
      await page.goto(url.href, { waitUntil: 'networkidle0', timeout: 60000 });
      await page.waitForFunction(
        () =>
          document.documentElement.dataset.ogReady === 'true' ||
          document.documentElement.dataset.ogError,
        { timeout: 30000 },
      );
      const status = await page.evaluate(() => ({
        ready: document.documentElement.dataset.ogReady,
        error: document.documentElement.dataset.ogError,
        seed: document.documentElement.dataset.ogSeed,
        family: document.documentElement.dataset.ogFamily,
      }));
      if (status.error || status.ready !== 'true')
        throw new Error(
          `${target.route}: ${status.error || '3D card did not render.'}`,
        );
      const png = await page.screenshot({ type: 'png' });
      const webp = await sharp(png)
        .resize(1200, 630)
        .webp({ quality: 90, effort: 5 })
        .toBuffer();
      const written = await publishWordupOg(target.output, webp, {
        force: values.force,
      });
      console.log(
        `wordup-og: ${written ? 'wrote' : 'preserved'} ${target.output} (${status.seed}, ${status.family})`,
      );
    } finally {
      await page.close();
    }
  }
} finally {
  await browser?.close();
  await server?.close();
}
console.log(`wordup-og: complete; ${preserved} existing card(s) preserved.`);
