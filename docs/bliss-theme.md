# Bliss

Bliss turns Fezcodex into an early-2000s desktop: a drawn blue sky with fractal-noise cumulus clouds over a rolling green hill, and every block of content in a window — a glossy blue title bar over a cream body. The sidebar is an Explorer task pane, the navbar an Explorer toolbar with an address field, and a taskbar with a green launcher is pinned to the bottom of the screen. Nothing uses real operating-system artwork, logos or wordmarks; everything is drawn.

## Activation

- Choose **Bliss** in Settings, on `/design`, or through **Switch Visual Theme** in the command palette.
- `/?fezTheme=bliss` selects the site theme; `&fezBlogMode=bliss` also selects its reader.

## Structure

| Where | What |
| --- | --- |
| `src/styles/Bliss.css` | `bl-` classes and `--bl-*` tokens |
| `src/components/bliss/` | `BlissWallpaper`, `BlissWindow`, `BlissIcon`, pieces, cards, `BlissDialog` |
| `src/components/Bliss*.jsx` | Chrome: sidebar (task pane), navbar (toolbar), taskbar, footer, search, palette, side panel, modals |
| `src/pages/bliss-views/` | Pages; `blog-views/BlissBlog*` the writing views; `about-views/BlissAboutView` |

Content loading is shared with Orbit (`useBlissIndex`, `blissPosts`, `blissApps`, `blissDate`, `blissPostLink` re-export Orbit's helpers).

## Components (`import { … } from '../../components/bliss'`)

- `<BlissWindow title icon tone headingLevel as actions onClose status inactive flush titleId className bodyClassName>` — the one container. `title` is rendered as the heading (`h2` by default; `headingLevel={1}` for the page's main window, `null` for none). `icon` is an appIcons/Phosphor name (`"CubeIcon"`) or component. `actions` go in the title bar (use `<BlissTitleLink to>` for "All logs →"). `status` renders a bottom status bar (`<><span>4 objects</span><span>…</span></>`). `flush` drops body padding (for list views). `inactive` washes the title bar out (secondary windows). Minimise/maximise are decorative; the close button is real only when `onClose` is given.
- `<BlissIcon icon tone seed size label>` — a glossy rounded tile with a white Phosphor glyph. `tone`: `blue green orange yellow pink purple teal red graphite`; or omit it and pass `seed` (slug/title) for a stable tone. Decorative unless `label`.
- `<BlissNotice error>` — loading / error text (yellow balloon / red).
- `<BlissStars value max>` — ★★★★☆ with an aria label.
- `<BlissProgress value label>` — green block progress bar.
- `<BlissCover item icon>` — 16:9 image with an icon-tile fallback.
- `<BlissDesktopIcon to icon tone label>` — a shortcut sitting directly on the wallpaper (white shadowed caption).
- `<BlissProjectCard project>`, `<BlissAppCard app eyebrow meta as>` — white cards.
- `<BlissDialog isOpen onClose title label icon actions footer width height flush>` — overlay window with focus trap and Escape (Orbit's `useOrbitDialog`).

## CSS vocabulary (`Bliss.css`)

- Frame: `bl-root` (page wrapper), `bl-page` (max 1240px, padded, column with gap — stack windows directly inside it).
- Windows: `bl-window`, `bl-titlebar`, `bl-titlebar-title`, `bl-window-body`, `bl-window-body-flush`, `bl-statusbar`, `bl-tbtn` (+ `bl-tbtn-close`).
- Type: `bl-display` (page title, Trebuchet blue), `bl-h2`, `bl-h3`, `bl-eyebrow` (small green caps), `bl-label`, `bl-meta` (13px muted), `bl-muted`, `bl-link`, `bl-kbd`, `bl-title-font`.
- Controls: `bl-btn` (+ `bl-btn-primary` green, `bl-btn-blue`, `bl-btn-icon`, `bl-btn-sm`, `aria-pressed` / `bl-btn-active`), `bl-input`, `bl-select`, `bl-textarea`, `bl-check` (checkbox/radio accent), `bl-switch` (`role="switch" aria-checked`), `bl-tag` (pill; `aria-pressed` selects), `bl-tabs` + `bl-tab` (`role="tab" aria-selected`), `bl-progress`.
- Content: `bl-grid` (auto-fill cards, min 260px), `bl-split` (two columns that stack), `bl-card` (white card; link cards highlight on hover), `bl-card-title`, `bl-row` + `bl-row-body` + `bl-row-title` (a list row that turns selection-blue on hover — use inside a window body), `bl-listview` (white table container: `<div className="bl-listview"><table>…`), `bl-paper` (white document area), `bl-groupbox` + `bl-groupbox-label` (fieldset look), `bl-stars`, `bl-cover`, `bl-notice`, `bl-balloon`, `bl-desktop-icons` + `bl-desktop-icon`.
- Reading: `bl-prose` (inside a `bl-paper` or a window body) styles Markdown: headings, lists, quotes, code, tables, images.
- Chrome and overlays: `bl-sidebar`, `bl-pane*`, `bl-navbar`, `bl-taskbar`, `bl-launcher`, `bl-task`, `bl-tray`, `bl-overlay`, `bl-modal`, `bl-modal-body`, `bl-toast`, `bl-palette-item` (`aria-selected` highlights).

## Coverage

Every themed surface has a Bliss form: home, projects, apps, pinned apps, writing, the reader (`fezBlogMode=bliss`), series, logs and log detail, vocabulary, commands, achievements, settings, `/about/bliss`, plus the sidebar, navbar, taskbar, footer, search, command palette, side panel, modals (generic, image, code, contact), toasts, the announcement banner, the `/design` card, and Syntax. Immersive routes and dedicated project presentations keep the layout exceptions the other themes use.

## Design rules

- Everything is a window on the wallpaper. A page is a `bl-page` column of windows; the first window carries the page title (`headingLevel={1}`), the rest `h2`. Desktop icons may sit directly on the wallpaper above the windows.
- Keep each page's anatomy (lists, filters, readouts, navigation) — the novelty is the material. Filters become tags/tabs/fields inside a window; long lists become `bl-row`s or a `bl-listview` table; card collections a `bl-grid` of `bl-card`s.
- Text on the wallpaper must sit on a window or carry the desktop-icon text shadow; never put body text directly on the sky.
- Saturated colour: glossy icon tones, green primary buttons, blue selection. Category labels use `getCategoryColor('bliss', category)` from `src/utils/categoryColors`.
- Interactive elements stay real `<a>` / `<button>` elements with accessible names. Touch targets ≥ 32px in chrome, ≥ 40px for primary controls.

## Verification

- `node node_modules/eslint/bin/eslint.js --ext .js,.jsx src/components/bliss src/components/Bliss*.jsx src/pages/bliss-views src/pages/blog-views/Bliss*.jsx src/pages/about-views/BlissAboutView.jsx`
- `node node_modules/vitest/vitest.mjs run src/utils/categoryColors.test.js` (on Node 25+, set `NODE_OPTIONS=--no-experimental-webstorage`)
