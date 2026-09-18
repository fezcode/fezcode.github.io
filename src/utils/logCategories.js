/**
 * Log categories are directories under `public/logs/`, and a static site cannot
 * list a directory at runtime. Every consumer therefore kept its own hardcoded
 * copy of the list — six themed logs pages, the dashboard and site search, all
 * of which would silently omit a new category until someone remembered to edit
 * eight files.
 *
 * `scripts/generate-logs-manifest.mjs` writes the real list to
 * `public/logs/index.json` at build time. This is the single reader for it.
 */

/**
 * Display order for the categories we already know about. Anything the manifest
 * reports that is not listed here is appended alphabetically, so a new category
 * shows up on its own without needing a code change.
 */
const PREFERRED_ORDER = [
  'Book',
  'Movie',
  'Video',
  'Game',
  'Article',
  'Music',
  'Series',
  'Food',
  'Websites',
  'Tools',
  'Event',
  'Quote',
];

/**
 * Used only when the manifest cannot be read (an old cached build, a dev server
 * started before `pregenerate` ran). Better a full page of logs from a stale
 * list than an empty one.
 */
export const FALLBACK_CATEGORIES = PREFERRED_ORDER;

const titleCase = (name) => name.charAt(0).toUpperCase() + name.slice(1);

/**
 * Fetches the build-time manifest and returns Title-Case category names in
 * display order. Callers lowercase them again for paths and colour lookups.
 *
 * @returns {Promise<string[]>}
 */
export const fetchLogCategories = async () => {
  try {
    const res = await fetch('/logs/index.json');
    if (!res.ok) return FALLBACK_CATEGORIES;
    const { categories } = await res.json();
    if (!Array.isArray(categories) || categories.length === 0) {
      return FALLBACK_CATEGORIES;
    }

    const named = categories.map(titleCase);
    const known = PREFERRED_ORDER.filter((c) => named.includes(c));
    const rest = named.filter((c) => !PREFERRED_ORDER.includes(c)).sort();
    return [...known, ...rest];
  } catch {
    return FALLBACK_CATEGORIES;
  }
};

/**
 * Fetches and parses every category's piml file.
 *
 * @param {string[]} categories Title-Case names from `fetchLogCategories`.
 * @param {(text: string) => object} parse The piml parser.
 * @returns {Promise<object[]>} Every log entry, unsorted.
 */
export const fetchLogsForCategories = async (categories, parse) => {
  const fetches = categories.map(async (category) => {
    const slug = category.toLowerCase();
    const res = await fetch(`/logs/${slug}/${slug}.piml`);
    if (!res.ok) return [];
    const data = parse(await res.text());
    return data.logs || data.items || [];
  });
  return (await Promise.all(fetches)).flat();
};
