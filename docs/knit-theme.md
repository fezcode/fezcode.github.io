# Knit

Knit turns Fezcodex into a hand-knitted sweater: realistic stockinette (every stitch a twisted V), Fair Isle colourwork bands, and titles, labels and pictograms knitted into the fabric. Long text sits on cream felt patches stitched onto the knit with a red running stitch, so reading stays comfortable.

## Activation

- Choose **Knit** in Settings, on `/design`, or through **Switch Visual Theme** in the command palette.
- `/?fezTheme=knit` selects the site theme; `&fezBlogMode=knit` also selects its reader.

## Structure

| Where | What |
| --- | --- |
| `src/components/knit/engine.js` | Stitch renderer, yarns (`YARN`), gauges (`GAUGE` 5×4.2 px, `FINE` 4×3.4 px), grid helpers, seamless CSS textures |
| `src/components/knit/fonts.js` | Stitch fonts: `big` (5×7) and `small` (3×5); capitals only; accents are stripped |
| `src/components/knit/patterns.js` | Text charting, `ICONS`, `MOTIFS`, `BANDS`, `COLOURWAYS`, `badgeGrid` |
| `src/components/knit/*.jsx` | React components (below) |
| `src/styles/Knit.css` | `knt-` classes and `--knt-*` tokens |
| `src/pages/knit-views/` | Pages; `blog-views/KnitBlog*` the writing views; `about-views/KnitAboutView` |
| `src/components/Knit*.jsx` | Chrome: sidebar, navbar, footer, search, palette, modals |

Content loading is shared with Orbit (`useKnitIndex`, `knitPosts`, `knitApps`, `knitDate`, `knitPostLink` re-export Orbit's helpers).

## Components (`import { … } from '../components/knit'`)

- `<KnitText text as size scale fg bg align fit maxLines padX padY />` — knitted text. The real text stays in the DOM (`sr-only`) for screen readers, SEO and find-in-page. Block by default: fills its container and wraps by words. `fit` hugs the text (inline). `size="small"` uses the 3×5 font on the FINE gauge — use it for labels, dates, tags, buttons and nav. `bg` null means stitches are worked over whatever wool is behind (duplicate stitch).
- `<KnitIcon name fg />` — 7×7 pictogram; `name` is an `ICONS` key or a Phosphor icon name (`HouseIcon` → `home`, unknown → `heart`).
- `<KnitBand pattern colors />` — full-width colourwork. `pattern` is a `BANDS` key (`peerie`, `diamonds`, `hens`, `flowers`, `snow`, `stars`, `trees`, `hearts`, `zigzag`, `checks`, `ribbing`, `lice`) or an array stacking several (`['peerie', ['stars', { bg: YARN.moss }], 'peerie']`).
- `<KnitBadge seed size />` — a square swatch with a motif, stable per seed (slug).
- `<KnitCover item />` — a project image mounted on felt (badge fallback).
- `<KnitProjectCard project />`, `swatchFor(seed)` → `{ way, className }` for a knitted card in the seed's colourway.
- `<KnitNotice error>` — loading / error text.
- `<KnitCanvas build={(cols) => grid} deps={[…]} cols? gauge? />` — the primitive: chart anything with the grid helpers.

## CSS vocabulary (`Knit.css`)

- Surfaces: `knt-root`, `knt-page` (max 1240px), `knt-wool-<yarn>` (walnut, bark, peat, moss, rust, gold, poppy, cream, oat, teal, ink, denim, plum) — plain stockinette backgrounds. `knt-swatch` adds a knitted-piece shadow.
- Felt: `knt-patch` (cream felt, ink text, Literata serif, dashed red stitching), `knt-patch-dark`, `knt-patch-tight`. Inside a patch `knt-label`, `knt-muted`, `knt-link` switch to ink colours.
- Reading: `knt-prose` (inside a `knt-patch`) styles Markdown: headings, lists with ♥ bullets, quotes, code, tables, images.
- Controls: `knt-btn` (+ `knt-btn-primary`, `knt-btn-gold`, `knt-btn-icon`, `aria-pressed` / `knt-btn-active`), `knt-input`, `knt-select`, `knt-textarea` (felt fields), `knt-tag` (felt chip; `aria-pressed` selects), `knt-kbd`, `knt-link`, `knt-label`, `knt-muted`.
- Layout: `knt-section`, `knt-section-head`, `knt-grid` (cards), `knt-split` (two columns), `knt-row` + `knt-row-body` (a linked swatch strip), `knt-card`, `knt-bleed`.
- Chrome and overlays: `knt-sidebar`, `knt-navbar`, `knt-footer`, `knt-overlay`, `knt-modal`, `knt-modal-body`, `knt-toast`.

## Coverage

Every themed surface has a Knit form: home, projects, apps, pinned apps, writing, the reader (`fezBlogMode=knit`), series, logs and log detail, vocabulary, commands, achievements, settings, `/about/knit`, plus the sidebar, navbar, footer, search, command palette, side panel, modals (generic, image, code, contact), toasts, the announcement banner (knitted, and the sidebar sits below it via `--knt-banner-offset`), the `/design` card, and Syntax, who is a knitted hen. Immersive routes and dedicated project presentations keep the layout exceptions the other themes use.

## Verification

- `node node_modules/eslint/bin/eslint.js --ext .js,.jsx src/components/knit src/components/Knit*.jsx src/pages/knit-views`
- `node node_modules/vitest/vitest.mjs run src/components/knit src/utils/categoryColors.test.js` (on Node 25+, set `NODE_OPTIONS=--no-experimental-webstorage`)

## Design rules

- Knit the display layer: page titles, section heads, list titles, labels, dates, tags, button captions, pictograms and decoration. Keep paragraphs, descriptions, Markdown bodies, form values and anything users type as real text on felt.
- Keep each page's anatomy (lists, filters, readouts, navigation) — the novelty is the material.
- Separate sections with bands; vary colourways per section the way a yoke changes bands. Yarn colours on wool should contrast (cream / gold / wheat on dark wool; peat / ink on gold or cream).
- Big titles: `KnitText` (big) with `maxLines` where space is tight. Long lists: knitted titles are fine — canvases draw lazily when near the viewport.
- Interactive elements stay real `<a>` / `<button>` elements with accessible names; knitted captions inside them carry the visible text.
