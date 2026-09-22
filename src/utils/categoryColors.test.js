import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  BLOG_CATEGORIES,
  CATEGORY_PALETTES,
  normalizeCategory,
  getCategoryColor,
} from './categoryColors';

// Every theme / blogpost view mode that renders a category label. Keep in step
// with SITE_THEMES (siteThemes.js) and the view modes BlogPostPage.jsx accepts.
const PALETTE_NAMES = [
  'brutalist',
  'luxe',
  'terracotta',
  'galley',
  'mist',
  'ledger',
  'orbit',
  'dossier',
  'dokument',
  'editorial',
  'editorial-invert',
];

// Registers (sub-palettes) swapped onto <html> at runtime. A themed category
// colour has to be declared for each one or it inherits the wrong register.
const REGISTERED = {
  ledger: {
    css: 'Ledger.css',
    prefix: '--ldg-cat-',
    selectors: [
      "html[data-ledger-register='1']",
      "html[data-ledger-register='2']",
      "html[data-ledger-register='3']",
      "html[data-ledger-register='4']",
      "html[data-ledger-register='5']",
    ],
  },
  orbit: {
    css: 'Orbit.css',
    prefix: '--orb-cat-',
    selectors: [
      "html[data-orbit-register='day']",
      "html[data-orbit-register='night']",
    ],
  },
};

// 'd&d' is not a legal custom-property name, so the CSS vars use the alias.
const cssSuffix = (category) => (category === 'd&d' ? 'dnd' : category);

const readStyle = (file) =>
  fs.readFileSync(path.join(__dirname, '..', 'styles', file), 'utf8');

/** The declaration block that follows a selector, up to its closing brace. */
const blockFor = (css, selector) => {
  const at = css.indexOf(selector);
  if (at === -1) return null;
  const open = css.indexOf('{', at);
  const close = css.indexOf('}', open);
  return open === -1 || close === -1 ? null : css.slice(open, close);
};

describe('normalizeCategory', () => {
  it('lowercases so frontmatter casing cannot miss a colour', () => {
    expect(normalizeCategory('DEV')).toBe('dev');
    expect(normalizeCategory('Rant')).toBe('rant');
  });

  it('resolves the dnd alias to the d&d category', () => {
    expect(normalizeCategory('dnd')).toBe('d&d');
    expect(normalizeCategory('DnD')).toBe('d&d');
  });

  it('falls back to default for empty input', () => {
    expect(normalizeCategory(undefined)).toBe('default');
    expect(normalizeCategory(null)).toBe('default');
    expect(normalizeCategory('')).toBe('default');
  });

  it('passes unknown categories through untouched', () => {
    expect(normalizeCategory('newthing')).toBe('newthing');
  });
});

describe('CATEGORY_PALETTES', () => {
  it('covers every theme and blogpost view mode that shows a category', () => {
    expect(Object.keys(CATEGORY_PALETTES).sort()).toEqual(
      [...PALETTE_NAMES].sort(),
    );
  });

  // The original bug: Terracotta had no 'essay' entry, so essay posts silently
  // rendered in the default ink like an uncategorised post.
  it.each(PALETTE_NAMES)('%s declares a colour for every category', (name) => {
    const palette = CATEGORY_PALETTES[name];
    const missing = BLOG_CATEGORIES.filter((category) => !palette[category]);
    expect(missing).toEqual([]);
  });

  it.each(PALETTE_NAMES)('%s declares a default colour', (name) => {
    expect(CATEGORY_PALETTES[name].default).toBeTruthy();
  });

  it.each(PALETTE_NAMES)('%s has no accidental alias key', (name) => {
    // 'dnd' must be normalised away, never stored, or the two spellings drift.
    expect(CATEGORY_PALETTES[name].dnd).toBeUndefined();
  });
});

describe('register-aware palettes', () => {
  it.each(Object.keys(REGISTERED))(
    '%s resolves through CSS variables so it tracks the active register',
    (name) => {
      const palette = CATEGORY_PALETTES[name];
      for (const category of [...BLOG_CATEGORIES, 'default']) {
        expect(palette[category]).toMatch(/^var\(--/);
      }
    },
  );

  it.each(Object.keys(REGISTERED))(
    '%s defines its category variables in every register',
    (name) => {
      const { css, prefix, selectors } = REGISTERED[name];
      const stylesheet = readStyle(css);
      const missing = [];

      for (const selector of selectors) {
        const block = blockFor(stylesheet, selector);
        if (!block) {
          missing.push(`${css} has no block for ${selector}`);
          continue;
        }
        for (const category of [...BLOG_CATEGORIES, 'default']) {
          const variable = `${prefix}${cssSuffix(category)}`;
          if (!block.includes(`${variable}:`)) {
            missing.push(`${selector} is missing ${variable}`);
          }
        }
      }

      expect(missing).toEqual([]);
    },
  );
});

describe('getCategoryColor', () => {
  it('returns the palette colour for a known category', () => {
    expect(getCategoryColor('terracotta', 'dev')).toBe(
      CATEGORY_PALETTES.terracotta.dev,
    );
  });

  it('is case and alias insensitive', () => {
    expect(getCategoryColor('mist', 'DEV')).toBe(CATEGORY_PALETTES.mist.dev);
    expect(getCategoryColor('mist', 'dnd')).toBe(CATEGORY_PALETTES.mist['d&d']);
  });

  it('falls back to the palette default for an unknown category', () => {
    expect(getCategoryColor('luxe', 'nope')).toBe(
      CATEGORY_PALETTES.luxe.default,
    );
  });

  it('falls back to the palette default when no category is given', () => {
    expect(getCategoryColor('luxe', undefined)).toBe(
      CATEGORY_PALETTES.luxe.default,
    );
  });

  it('falls back to brutalist for an unknown palette', () => {
    expect(getCategoryColor('nosuchtheme', 'dev')).toBe(
      CATEGORY_PALETTES.brutalist.dev,
    );
  });

  it('keeps every category visually distinct within a palette', () => {
    // Themes may repeat a hue deliberately, but a palette collapsing every
    // category onto one colour means the wiring is broken.
    const flat = PALETTE_NAMES.filter((name) => {
      const palette = CATEGORY_PALETTES[name];
      return new Set(BLOG_CATEGORIES.map((c) => palette[c])).size <= 1;
    });
    expect(flat).toEqual([]);
  });
});
