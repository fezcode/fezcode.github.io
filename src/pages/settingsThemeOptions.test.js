// Every theme ships its own Settings page with hand-written option lists.
// When a new theme lands, each page has to offer it; this catches the ones
// that were missed (Knit lacked Kilim after the Kilim release).
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SITE_THEMES } from '../utils/siteThemes';

const PAGES_DIR = join(process.cwd(), 'src', 'pages');

const settingsPages = readdirSync(PAGES_DIR, { withFileTypes: true })
  .filter((dir) => dir.isDirectory() && dir.name.endsWith('-views'))
  .flatMap((dir) =>
    readdirSync(join(PAGES_DIR, dir.name))
      .filter((file) => file.endsWith('SettingsPage.jsx'))
      .map((file) => join(dir.name, file)),
  );

const contextSource = readFileSync(
  join(process.cwd(), 'src', 'context', 'VisualSettingsContext.jsx'),
  'utf8',
);
const blogViewModes = [
  ...contextSource
    .match(/BLOG_POST_VIEW_MODES = \[([\s\S]*?)\]/)[1]
    .matchAll(/'([a-z-]+)'/g),
].map((m) => m[1]);

const offered = (source) =>
  new Set([...source.matchAll(/value:\s*'([a-z-]+)'/g)].map((m) => m[1]));

describe('theme settings pages', () => {
  it('finds the per-theme settings pages', () => {
    expect(settingsPages.length).toBeGreaterThanOrEqual(SITE_THEMES.length);
  });

  it.each(settingsPages)('%s offers every site theme', (page) => {
    const values = offered(readFileSync(join(PAGES_DIR, page), 'utf8'));
    const missing = SITE_THEMES.map((t) => t.id).filter((id) => !values.has(id));
    expect(missing).toEqual([]);
  });

  it.each(settingsPages)('%s offers every blog post view', (page) => {
    const values = offered(readFileSync(join(PAGES_DIR, page), 'utf8'));
    const missing = blogViewModes.filter((mode) => !values.has(mode));
    expect(missing).toEqual([]);
  });
});
