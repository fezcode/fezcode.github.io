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
const RETRY = process.env.PRERENDER_RETRY === '1' || process.argv.includes('--retry');

function routeToFile(route) {
  if (route === '/') return join(DIST, 'index.html');
  return join(DIST, route.replace(/^\//, ''), 'index.html');
}

function fmtMs(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function fmtSec(ms) {
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(2)}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${(s - m * 60).toFixed(1)}s`;
}

async function crawlOne(browser, baseUrl, route) {
  const t0 = Date.now();
  const target = baseUrl + route;
  const file = routeToFile(route);
  if (!existsSync(file)) return { route, skipped: 'no prerendered shell', ms: Date.now() - t0 };

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
      return { route, skipped: `no children rendered within ${SELECTOR_TIMEOUT}ms`, ms: Date.now() - t0 };
    }
    await new Promise((r) => setTimeout(r, RENDER_SETTLE_MS));

    const rendered = await page.evaluate(() => {
      const root = document.getElementById('react-root');
      return root ? root.innerHTML : '';
    });

    if (!rendered) return { route, skipped: 'empty root after render', ms: Date.now() - t0 };

    const shell = await readFile(file, 'utf8');
    const replaced = shell.replace(
      /<div id="react-root"><\/div>/,
      `<div id="react-root">${rendered}</div>`
    );
    if (replaced === shell) {
      return { route, skipped: 'root placeholder not found', ms: Date.now() - t0 };
    }
    await writeFile(file, replaced, 'utf8');
    return { route, bytes: rendered.length, errors: consoleErrors.length, ms: Date.now() - t0 };
  } catch (e) {
    return { route, error: e.message, ms: Date.now() - t0 };
  } finally {
    await page.close().catch(() => {});
  }
}

async function warmUp(baseUrl) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(baseUrl + '/');
      if (res.ok) return Date.now();
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('preview server did not respond within 10s');
}

function logRoute(r) {
  const t = fmtMs(r.ms ?? 0);
  if (r.error) {
    console.log(`  x ${r.route}: ${r.error} (${t})`);
  } else if (r.skipped) {
    console.log(`  - ${r.route}: ${r.skipped} (${t})`);
  } else {
    console.log(`  . ${r.route}  (${r.bytes} bytes, ${r.errors} console errors, ${t})`);
  }
}

async function main() {
  const tStart = Date.now();
  console.log(`prerender-crawl: ${allRoutes.length} routes, concurrency ${CONCURRENCY}`);

  const server = await preview({
    preview: { port: 4287, strictPort: true, host: '127.0.0.1' },
  });
  const url = server.resolvedUrls?.local?.[0]?.replace(/\/$/, '') || 'http://127.0.0.1:4287';
  console.log(`preview up at ${url}`);

  const warmStart = Date.now();
  await warmUp(url);
  console.log(`warm-up: preview responded in ${fmtMs(Date.now() - warmStart)}`);

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
      logRoute(r);
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
        logRoute({ ...r, route: `${route} [retry]` });
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

  const total = results.length;
  const ok = results.filter((r) => r.bytes).length;
  const errs = results.filter((r) => r.error).length;
  const skipped = results.filter((r) => r.skipped).length;
  const routeTimes = results.map((r) => r.ms || 0);
  const avgMs = routeTimes.length ? routeTimes.reduce((a, b) => a + b, 0) / routeTimes.length : 0;
  const maxMs = routeTimes.length ? Math.max(...routeTimes) : 0;
  const pct = total ? ((ok / total) * 100).toFixed(1) : '0.0';
  const elapsed = Date.now() - tStart;

  console.log(`\nprerender-crawl: ${ok}/${total} rendered (${pct}% success), ${skipped} skipped, ${errs} errored`);
  console.log(`prerender-crawl: per-route avg ${fmtMs(Math.round(avgMs))}, max ${fmtMs(maxMs)}`);
  console.log(`prerender-crawl: total elapsed ${fmtSec(elapsed)}`);

  try {
    const home = await readFile(join(DIST, 'index.html'), 'utf8');
    await writeFile(join(DIST, '404.html'), home, 'utf8');
  } catch {}

  if (errs > 0) process.exit(1);
}

await main();
