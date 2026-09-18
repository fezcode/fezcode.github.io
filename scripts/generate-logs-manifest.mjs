import { readdirSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// The log categories are directories on disk, and a static site has no way to
// list a directory at runtime — which is why every consumer ended up with its
// own hardcoded copy of the list, silently wrong the moment a category is
// added. This writes the list out at build time so they can read it instead.
//
// Categories only, deliberately: counts stay live, read from the piml files
// themselves, so a manifest can never disagree with the logs it describes.

const PUBLIC = 'public';
const ROOT = join(PUBLIC, 'logs');
const OUT = join(ROOT, 'index.json');

// Not every directory under public/logs/ is a log category. `reading` lives
// there for historical reasons but is a reading list with its own shape — no
// (category), no (slug), a (status) instead of a (rating) — rendered by
// /reading, not /logs. Real log entries all carry a (category); that field is
// the test, so a directory joins the manifest by having the right shape rather
// than by being named in a list here.
const isLogCategory = (name) => {
  const file = join(ROOT, name, `${name}.piml`);
  if (!existsSync(file)) return false;
  return /^\s*\(category\)/m.test(readFileSync(file, 'utf8'));
};

const categories = readdirSync(ROOT, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter(isLogCategory)
  .sort();

const body = `${JSON.stringify({ categories }, null, 2)}\n`;

// No timestamp in the file: it should only change when the categories do,
// otherwise every build produces a diff nobody wants to read.
const unchanged = existsSync(OUT) && readFileSync(OUT, 'utf8') === body;
if (!unchanged) writeFileSync(OUT, body, 'utf8');

console.log(
  `generate-logs-manifest: ${categories.length} categories${unchanged ? ' (unchanged)' : ''} -> ${OUT}`,
);
