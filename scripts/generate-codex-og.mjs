// Renders the Fezcodex share cards (brand default, blog posts, discovery logs)
// into public/images/og with headless Chrome. Existing cards are preserved, so
// only new posts and logs are rendered; commit the results.
import { resolve, join } from 'node:path';
import { parseArgs } from 'node:util';
import { getCodexOgTargets } from './lib/codex-og.mjs';
import { existingOgFile, publishWordupOg as publishOg } from './lib/wordup-og.mjs';

const { values } = parseArgs({
  options: {
    force: { type: 'boolean', default: false },
    kind: { type: 'string' },
    route: { type: 'string' },
    help: { type: 'boolean', default: false },
  },
});
if (values.help) {
  console.log(
    'node scripts/generate-codex-og.mjs [--force] [--kind default|blog|log] [--route /blog/slug]\n' +
      'Existing cards are kept. --force re-renders the selected cards.',
  );
  process.exit(0);
}

const targets = getCodexOgTargets().filter(
  (t) => (!values.kind || t.data.kind === values.kind) && (!values.route || t.route === values.route),
);
if (values.route && !targets.length) {
  console.error(`codex-og: no card for route ${values.route}`);
  process.exit(1);
}

const pending = [];
let preserved = 0;
for (const target of targets) {
  target.output = join('public', target.file);
  if (!values.force && (await existingOgFile(target.output))) {
    preserved += 1;
    continue;
  }
  pending.push(target);
}

if (!pending.length) {
  console.log(`codex-og: ${preserved} existing card(s) preserved; no rendering needed.`);
  process.exit(0);
}

const [{ createServer }, { default: puppeteer }, { default: sharp }] = await Promise.all([
  import('vite'),
  import('puppeteer'),
  import('sharp'),
]);
const encode = (data) => Buffer.from(JSON.stringify(data)).toString('base64url');

let server;
let browser;
try {
  server = await createServer({
    configFile: false,
    root: process.cwd(),
    publicDir: resolve('public'),
    cacheDir: 'node_modules/.cache/codex-og-vite',
    logLevel: 'error',
    optimizeDeps: { entries: ['scripts/og/codex-card.html'], include: ['three'] },
    server: { host: '127.0.0.1', port: 0, strictPort: false },
  });
  await server.listen();
  const baseUrl = server.resolvedUrls.local[0];
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-unsafe-swiftshader'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
  let written = 0;
  for (const target of pending) {
    const url = new URL('scripts/og/codex-card.html', baseUrl);
    url.searchParams.set('data', encode(target.data));
    await page.goto(url.href, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.waitForFunction(
      () => document.documentElement.dataset.ogReady === 'true' || document.documentElement.dataset.ogError,
      { timeout: 30000 },
    );
    const error = await page.evaluate(() => document.documentElement.dataset.ogError);
    if (error) throw new Error(`${target.route}: ${error}`);
    const png = await page.screenshot({ type: 'png' });
    const image = sharp(png).resize(1200, 630);
    const bytes = target.file.endsWith('.png')
      ? await image.png({ compressionLevel: 9 }).toBuffer()
      : await image.webp({ quality: 88, effort: 5 }).toBuffer();
    if (await publishOg(target.output, bytes, { force: values.force })) written += 1;
    console.log(`codex-og: ${target.data.kind.padEnd(7)} ${target.output}`);
  }
  console.log(`codex-og: wrote ${written} card(s), ${preserved} existing card(s) preserved.`);
} finally {
  await browser?.close();
  await server?.close();
}
