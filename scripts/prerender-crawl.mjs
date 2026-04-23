import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { preview } from 'vite';
import puppeteer from 'puppeteer';
import { discoverAllRoutes } from '../pages/discoverRoutes.js';

const allRoutes = discoverAllRoutes();

const DIST = 'dist/client';
const CONCURRENCY = Number(process.env.PRERENDER_CONCURRENCY) || 6;
const PAGE_TIMEOUT = 30000;
const RENDER_SETTLE_MS = 300;
const SELECTOR_TIMEOUT = 8000;
const RETRY = process.env.PRERENDER_RETRY === '1';

function routeToFile(route) {
  if (route === '/') return join(DIST, 'index.html');
  return join(DIST, route.replace(/^\//, ''), 'index.html');
}

async function crawlOne(browser, baseUrl, route) {
  const target = baseUrl + route;
  const file = routeToFile(route);
  if (!existsSync(file)) return { route, skipped: 'no prerendered shell' };

  const page = await browser.newPage();
  try {
    const consoleErrors = [];
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text());
    });
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const t = req.resourceType();
      if (t === 'image' || t === 'font' || t === 'media') return req.abort();
      req.continue();
    });
    await page.goto(target, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT });
    try {
      await page.waitForSelector('#react-root > *', { timeout: SELECTOR_TIMEOUT });
    } catch {
      return { route, skipped: `no children rendered within ${SELECTOR_TIMEOUT}ms` };
    }
    await new Promise((r) => setTimeout(r, RENDER_SETTLE_MS));

    const rendered = await page.evaluate(() => {
      const root = document.getElementById('react-root');
      return root ? root.innerHTML : '';
    });

    if (!rendered) return { route, skipped: 'empty root after render' };

    const shell = await readFile(file, 'utf8');
    const replaced = shell.replace(
      /<div id="react-root"><\/div>/,
      `<div id="react-root">${rendered}</div>`
    );
    if (replaced === shell) {
      return { route, skipped: 'root placeholder not found' };
    }
    await writeFile(file, replaced, 'utf8');
    return { route, bytes: rendered.length, errors: consoleErrors.length };
  } catch (e) {
    return { route, error: e.message };
  } finally {
    await page.close().catch(() => {});
  }
}

async function main() {
  console.log(`prerender-crawl: ${allRoutes.length} routes, concurrency ${CONCURRENCY}`);

  const server = await preview({
    preview: { port: 4287, strictPort: true, host: '127.0.0.1' },
  });
  const url = server.resolvedUrls?.local?.[0]?.replace(/\/$/, '') || 'http://127.0.0.1:4287';
  console.log(`preview up at ${url}`);

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const results = [];
  const queue = [...allRoutes];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const route = queue.shift();
      const r = await crawlOne(browser, url, route);
      results.push(r);
      if (r.error) {
        console.log(`  x ${route}: ${r.error}`);
      } else if (r.skipped) {
        console.log(`  - ${route}: ${r.skipped}`);
      } else {
        console.log(`  . ${route}  (${r.bytes} bytes, ${r.errors} console errors)`);
      }
    }
  });
  await Promise.all(workers);

  if (RETRY) {
    const flaky = results
      .filter((r) => r.skipped && /within \d+ms|empty root/.test(r.skipped))
      .map((r) => r.route);
    if (flaky.length) {
      console.log(`\nprerender-crawl: retrying ${flaky.length} flaky route(s) sequentially...`);
      const retryResults = new Map();
      for (const route of flaky) {
        const r = await crawlOne(browser, url, route);
        retryResults.set(route, r);
        if (r.bytes) console.log(`  . ${route}  (retry: ${r.bytes} bytes, ${r.errors} console errors)`);
        else if (r.skipped) console.log(`  - ${route}: retry ${r.skipped}`);
        else if (r.error) console.log(`  x ${route}: retry ${r.error}`);
      }
      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        if (retryResults.has(r.route)) {
          const next = retryResults.get(r.route);
          if (next.bytes || next.error) results[i] = next;
        }
      }
    }
  }

  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));

  const ok = results.filter((r) => r.bytes).length;
  const errs = results.filter((r) => r.error).length;
  const skipped = results.filter((r) => r.skipped).length;
  console.log(`\nprerender-crawl: ${ok} rendered, ${skipped} skipped, ${errs} errored`);

  try {
    const home = await readFile(join(DIST, 'index.html'), 'utf8');
    await writeFile(join(DIST, '404.html'), home, 'utf8');
  } catch {}

  // Skipped routes keep their empty-shell HTML + SPA fallback — not a build failure.
  if (errs > 0) process.exit(1);
}

await main();
