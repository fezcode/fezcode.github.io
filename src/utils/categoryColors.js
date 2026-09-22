/**
 * Single source of truth for per-category colours.
 *
 * Every theme and blogpost view mode used to keep its own local map — or none
 * at all — so a category label either went uncoloured (Luxe, Ledger, Orbit,
 * Dossier, Editorial), wore one flat theme accent for all eight categories
 * (Brutalist, Dokument, Galley), or quietly missed an entry and fell back to
 * the default ink (Terracotta had no 'essay'). One table fixes all three.
 *
 * A palette is background-specific: dark-ground palettes carry bright hues,
 * paper palettes carry inks. Ledger and Orbit swap sub-palettes ("registers")
 * onto <html> at runtime, so those two resolve through CSS custom properties
 * declared per register in Ledger.css / Orbit.css instead of baked hex.
 */

// Categories present in /posts/posts.json, plus the synthetic 'series' the
// index pages show for a series container (which carries no category itself).
export const BLOG_CATEGORIES = [
  'dev',
  'rant',
  'ai',
  'feat',
  'gist',
  'essay',
  'series',
  'd&d',
];

// Frontmatter and route params have used both spellings.
const CATEGORY_ALIASES = { dnd: 'd&d' };

// 'd&d' is not a legal custom-property name; the CSS vars use the alias.
const cssName = (category) => (category === 'd&d' ? 'dnd' : category);

const registerVars = (prefix) =>
  [...BLOG_CATEGORIES, 'default'].reduce(
    (out, category) => ({
      ...out,
      [category]: `var(${prefix}${cssName(category)})`,
    }),
    {},
  );

export const CATEGORY_PALETTES = {
  // Systemic brutalism, near-black ground. Reuses the global --title-hover-*
  // tokens: the bright-on-dark counterparts of the --color-*-badge inks that
  // BrutalistPostItem already uses, so a category reads the same in the index
  // rail and in the reader.
  brutalist: {
    dev: 'var(--title-hover-dev)',
    rant: 'var(--title-hover-rant)',
    ai: 'var(--title-hover-ai)',
    feat: 'var(--title-hover-feat)',
    gist: 'var(--title-hover-gist)',
    essay: 'var(--title-hover-essay)',
    series: 'var(--title-hover-series)',
    'd&d': 'var(--title-hover-dnd)',
    default: '#10b981',
  },

  // Architectural elegance on white.
  luxe: {
    dev: '#1D4ED8',
    rant: '#C2410C',
    ai: '#047857',
    feat: '#7E22CE',
    gist: '#B45309',
    essay: '#4338CA',
    series: '#BE185D',
    'd&d': '#BE123C',
    default: '#57534E',
  },

  // Bone paper and terra ink: earth-leaning hues, but at full strength so a
  // 12px label still reads as coloured.
  terracotta: {
    dev: '#4D7C0F',
    rant: '#C2410C',
    ai: '#A16207',
    feat: '#0F766E',
    gist: '#EA580C',
    essay: '#4338CA',
    series: '#9F1239',
    'd&d': '#7C2D12',
    default: '#2E2620',
  },

  // Galley proof shares Terracotta's paper stock, so it shares its inks.
  galley: {
    dev: '#4D7C0F',
    rant: '#C2410C',
    ai: '#A16207',
    feat: '#0F766E',
    gist: '#EA580C',
    essay: '#4338CA',
    series: '#9F1239',
    'd&d': '#7C2D12',
    default: '#2E2620',
  },

  // Eucalyptus veils: cool-leaning, kept saturated enough to survive the fog.
  mist: {
    dev: '#0F766E',
    rant: '#B45309',
    ai: '#1D4ED8',
    feat: '#6D28D9',
    gist: '#047857',
    essay: '#4338CA',
    series: '#0E7490',
    'd&d': '#BE123C',
    default: '#475569',
  },

  // Five registers, two of them phosphor CRTs — must follow the active one.
  ledger: registerVars('--ldg-cat-'),

  // Day / night observatory.
  orbit: registerVars('--orb-cat-'),

  // Declassified dossier on #f3f3f3 — typewriter inks and stamp reds.
  dossier: {
    dev: '#1D4ED8',
    rant: '#B91C1C',
    ai: '#047857',
    feat: '#7E22CE',
    gist: '#B45309',
    essay: '#4338CA',
    series: '#BE185D',
    'd&d': '#BE123C',
    default: '#111111',
  },

  // Stamped document, hard shadows.
  dokument: {
    dev: '#1D4ED8',
    rant: '#B91C1C',
    ai: '#059669',
    feat: '#7E22CE',
    gist: '#B45309',
    essay: '#4338CA',
    series: '#BE185D',
    'd&d': '#9F1239',
    default: '#059669',
  },

  // Editorial reads light or inverted, toggled per reader — one palette each.
  editorial: {
    dev: '#1D4ED8',
    rant: '#C2410C',
    ai: '#047857',
    feat: '#7E22CE',
    gist: '#B45309',
    essay: '#4338CA',
    series: '#BE185D',
    'd&d': '#BE123C',
    default: '#1A1A1A',
  },
  'editorial-invert': {
    dev: '#60A5FA',
    rant: '#FB923C',
    ai: '#34D399',
    feat: '#C084FC',
    gist: '#FBBF24',
    essay: '#818CF8',
    series: '#F472B6',
    'd&d': '#FB7185',
    default: '#FFFFFF',
  },
};

const FALLBACK_PALETTE = 'brutalist';

/**
 * Lowercases, resolves the dnd alias, and turns a missing category into
 * 'default'. Unknown categories pass through so the caller can still display
 * the raw label while the colour falls back.
 */
export const normalizeCategory = (category) => {
  if (!category) return 'default';
  const key = String(category).trim().toLowerCase();
  if (!key) return 'default';
  return CATEGORY_ALIASES[key] || key;
};

/**
 * Resolve a category to a CSS colour value for a theme or blogpost view mode.
 * Returns hex for fixed palettes and a var(--…) reference for Ledger/Orbit, so
 * callers can drop the result straight into an inline style either way.
 */
export const getCategoryColor = (palette, category) => {
  const table =
    CATEGORY_PALETTES[palette] || CATEGORY_PALETTES[FALLBACK_PALETTE];
  return table[normalizeCategory(category)] || table.default;
};

export default getCategoryColor;
