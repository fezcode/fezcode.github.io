import puppeteer from 'puppeteer';

const url = process.argv[2] || 'http://127.0.0.1:4173/';

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
const pageErrors = [];
const consoleErrors = [];
const failed = [];

page.on('pageerror', (e) => pageErrors.push(e.message));
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});
page.on('response', (r) => {
  if (r.status() >= 400) failed.push(`[${r.status()}] ${r.url()}`);
});

try {
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 3000));

  const rootHtml = await page.evaluate(
    () => document.getElementById('react-root')?.innerHTML?.slice(0, 400) || ''
  );
  const title = await page.title();
  console.log('URL:', url);
  console.log('TITLE:', title);
  console.log('ROOT HTML LEN:', rootHtml.length);
  console.log('ROOT HTML HEAD:\n', rootHtml);
  console.log('\nPAGE ERRORS (' + pageErrors.length + '):');
  pageErrors.slice(0, 20).forEach((e) => console.log('  - ' + e));
  console.log('\nCONSOLE ERRORS (' + consoleErrors.length + '):');
  consoleErrors.slice(0, 20).forEach((e) => console.log('  - ' + e));
  console.log('\nFAILED REQS (' + failed.length + '):');
  failed.slice(0, 20).forEach((e) => console.log('  - ' + e));
} catch (e) {
  console.log('NAV ERR:', e.message);
} finally {
  await browser.close();
}
