# Kilim theme: design

Date: 2026-11-17
Status: draft, awaiting approval

## Intent

The owner loved the Knit theme and wanted more themes in its spirit. Two directions were demoed as standalone pages, Kilim and Stained Glass, and refined over several rounds of feedback. The owner approved both and asked to build **Kilim only, for now**. Stained Glass comes later through its own design.

Kilim renders the codex as a flat-woven Anatolian rug. As in Knit, the page is built from one material: woven surfaces, headings, motifs, bands and fringe are drawn pass by pass on canvas from a grid, so the type comes out of the weave instead of sitting on top of it.

## The approved demo is the visual reference

`docs/superpowers/specs/assets/2026-11-17-kilim-demo.html` is the approved demo (version 9 of the artifact the owner reviewed). Open it in a browser. Its engine, palette, fonts and treatments are the spec for the look; where this document and the demo disagree, ask.

What the owner explicitly asked for during review (keep all of these):

- Page ground is a **dark madder** (`--madder-deep: #570e13`, woven texture from `#5a1015`), darker than the first draft.
- Woven headings use **double gauge** (each font dot is 2×2 pips) with a **one-pip walnut drop shadow**, no full contour, displayed at 68% so long headings fit a column. Single-gauge headings with a heavy outline were rejected as unreadable.
- Ivory buttons and date tiles are **flat ivory with a dashed madder inner outline** (a stitched tag), never the woven ivory texture, which swamped the label.
- UI type is **Pixelify Sans** (links, titles, labels, buttons, nav, meta). Long text is **Bitter**. Commissioner and Space Mono were rejected as not fitting. Small pixel capitals need larger sizes and tight tracking (see the demo's "pixel capitals need room" rules), or C reads as O.
- Sidebar: indigo woven panel, a vertical sawtooth band woven down its right edge, active link as an ivory stitched tag.

## Goals

- A complete theme at the level of Knit and Bliss: every surface those themes cover gets a Kilim version.
- Kilim's own canvas engine in `src/components/kilim/`, ported from the demo, structured like `src/components/knit/` (engine, fonts, patterns, canvas component, small pieces).
- Every page view has its own layout idea that comes from the rug, not Knit's layout with a new skin.
- Ships as its own minor release.

## Non-goals

- Stained Glass (later, separate design).
- Changing Knit, Bliss or any other theme, beyond adding the Kilim branch to shared dispatch files.
- New site features. Kilim renders the same data and behaviour every other theme already does.

## Anti-goals (fails even if it technically works)

- **A Knit reskin.** Same layouts with red pips instead of V stitches. Each view needs a distinct structural concept (memory: theme views structurally unique).
- **Clip-art literalism.** No SVG carpets, looms, tassel icons or "rug" mascots. One crafted material, the weave, does the work.
- **Muted colour.** The palette stays saturated (madder, indigo, saffron, ivory at full strength). Desaturating it reads as no colour at all.
- **Art piece over function.** Functional pages (settings, logs, commands, tags) keep their working anatomy: filters, lists, controls stay recognisable and usable. The weave dresses them; it does not replace them.
- **Unreadable text.** Woven type only where it stays legible (headings, short labels, badges). Body text, descriptions and anything long stay in Bitter.
- **Theme flash.** Views import statically, as Knit's do; no lazy loading of theme views.

## Constraints

- Follow AGENTS.md: phosphor icon `Icon` suffix, brutalist variants for the shared custom components where they're used, `npm run lint` after changes, tags rules don't apply (no content added).
- SSR/prerender (Vike): canvases draw client-side only; the server HTML must carry the real text (headings as text with the canvas `aria-hidden`, or a text fallback) so prerendered pages and link previews stay readable. Knit's `KnitCanvas` already follows this pattern; copy it.
- Canvases draw lazily near the viewport (Knit uses an IntersectionObserver with a 600px margin) and re-weave on width change (ResizeObserver).
- `prefers-reduced-motion`: no weave-in animation; draw finished.
- Fonts load the way other themes do: `@import` at the top of the theme stylesheet (`src/styles/Kilim.css`), as `Orbit.css` does.
- Performance: long pages (logs, tags) can hold dozens of woven elements. Pip sprites are cached per colour/variant/abrash; grids are memoised; nothing re-weaves on scroll.

## How it is wired (as Knit is today)

The builder should mirror Knit's footprint file for file. Today Knit consists of:

- **Engine and pieces:** `src/components/knit/` (`engine.js`, `fonts.js`, `patterns.js` + test, `KnitCanvas.jsx`, `KnitText.jsx`, `KnitPieces.jsx`, `KnitDialog.jsx`, `KnitProjectCard.jsx`, `KnitAppCard.jsx`, `useKnitTextures.js`, `index.js`).
- **Chrome:** `src/components/Knit{Navbar,Sidebar,SidePanel,Footer,Modal,ImageModal,CodeModal,Search,CommandPalette}.jsx`.
- **Views:** `src/pages/knit-views/` (Home, Projects, Logs, LogDetail, Apps, PinnedApp, Series, Vocab, Commands, Achievements, Tags, Tag, Settings, `knit-tags.css`), plus `src/pages/blog-views/KnitBlog{,Post}Page.jsx` and `src/pages/about-views/KnitAboutView.jsx`.
- **Styles:** `src/styles/Knit.css`.
- **Registration and dispatch:** `src/utils/siteThemes.js`, `src/context/VisualSettingsContext.jsx` (theme id list), `src/components/ThemePicker.jsx`, `src/pages/DesignSelectionPage.jsx` (a theme card), `src/components/Layout.jsx` (sidebar, navbar, footer, content offset class, texture hook), and the per-page dispatchers that pick a view by `fezcodexTheme`: HomePage, ProjectsPage, LogsPage, LogDetailPage, AppPage, PinnedAppPage, SeriesPage, VocabPage, CommandsPage, AchievementsPage, BlogPage, BlogPostPage, AboutPage, SettingsPage, tags/TagsPage, tags/TagPage, NotFoundPage, plus shared components that branch per theme: Toast, Loading, Banner, ContactModal, GenericModal, ImageModal, CodeModal, Search, CommandPalette, SidePanel, SyntaxSprite, LogViewSwitch.css, categoryColors, useSearchableData, data/commands.js, and every other theme's Settings page (each lists the themes to switch to).

A repo-wide search for `'knit'` and `Knit` is the checklist: every place that branches for Knit gets a Kilim branch.

## The engine (ported from the demo)

`src/components/kilim/`:

- **Weave:** a cell is one weft pip, 5×4 CSS px, wider than tall. Rows alternate a half-pip brick offset. Each pip is a cached sprite (rounded capsule, top-light gradient, three ply strokes, 4 variants). Behind each pip, a gap colour (the yarn at −74%). A thin dark slit wherever the colour changes along a row. **Abrash:** bands of ~9 rows shift lightness slightly, seeded. Loom animation weaves bottom-up.
- **Type:** the demo's 5×7 bitmap font, capitals and basic punctuation, variable width. Headings at double gauge with drop shadow. Turkish capitals (Ç, Ğ, İ, Ö, Ş, Ü) should be added since post titles contain them; fold to ASCII only as a fallback.
- **Motifs:** hooked diamond medallion (göl) with rings, eye and ram's-horn hooks; eight-armed star; seeded per item so each project/app gets its own.
- **Bands:** diamond chain, interlocking sawtooth, plain-woven kilim end, a three-row stripe for list dividers, the vertical sidebar sawtooth.
- **Fringe:** warp threads knotted into tassels, drawn on canvas, at the top and bottom of the page.
- **Textures:** woven tiles for madder, indigo (and any other ground) as CSS background images, like Knit's `useKnitTextures`.
- **Palette:** `madder #a3262a`, `madderD #5a1015`, `indigo #1f2c5a`, `indigoL #3a5196`, `saffron #dca420`, `ivory #efe5cf`, `walnut #2e1910`, `pist #5b7a37`, `aub #5e2546`, `apricot #d8703a`, `teal #1d6a69`, `rose #c7556b`.

## Approaches considered

1. **Port the demo into a Kilim engine and build every view natively (chosen).** Mirrors how Knit, Bliss and Orbit were built; full control over each layout; the demo already proves the engine.
2. **Generalise Knit's engine to draw different "materials" and share it.** Less code, but couples two themes, and Knit's stitch geometry (V stitches, gauges) differs from the weave (brick pips, slits, abrash). Rejected: risks regressions in a theme the owner loves.
3. **CSS-only theme (textures as images, no canvas type).** Cheap, but loses the woven headings and seeded motifs that made the demo work. Rejected.

The owner approved approach 1 as part of the design proposal, with the scope narrowed to Kilim.

## Decided

- Theme id `kilim`, name "Kilim", description "Flat-woven madder, pass by pass" (builder may adjust the wording), swatch background `#570e13`, foreground `#efe5cf`, accent `#dca420`.
- Fonts: Pixelify Sans (UI), Bitter (text), woven bitmap (headings).
- Work on a feature branch; the owner tries the theme before release; release with a minor version bump following the release workflow.

## Settled after the builder check (Claude's calls, owner to confirm)

- **Icons are woven, not Phosphor.** Knit draws its own icons (`ICONS` and `knitIconFor` in `src/components/knit/patterns.js`, rendered by `KnitIcon`) across ~25 surfaces; Kilim does the same so the theme stays one material. To keep scope sane, Kilim reuses Knit's icon bitmaps and Phosphor-name mapping as data (import them, don't fork them) and renders them through the weave engine at single gauge. Only bitmaps that read badly with the brick offset get Kilim-specific redraws.
- **Two heading treatments.** Page-level hero titles (home hero, 404, any `*Hero` equivalent) keep the demo's full one-pip indigo contour at 2–3× scale; the owner saw that in every round and never objected. Section headings use double gauge with the walnut drop shadow at 68%. The rejected treatment was single-gauge section headings with a heavy walnut outline.
- **The sidebar follows the site's open/close state**, like every other theme: `Layout.jsx` gets a `klm-content-open` offset class (Kilim's CSS prefix is `klm-`, as Knit's is `knt-`) and the Kilim sidebar honours `isSidebarOpen`. The demo's always-on sidebar was a demo shortcut. Full-width canvases re-weave from their container's ResizeObserver (as `KnitCanvas` does), which covers the sidebar opening and closing. The navbar follows Knit's navbar for which links it carries.
- **Not the default theme.** Knit stays the default under the existing `default-theme` flag; no flag or test changes.
- Walnut is `#2e1910` everywhere (the demo's CSS `#2a160e` was a slip).

## Left to the builder

- The structural concept for each view (within the anti-goals). Starting points from the rug's world: the home page as one rug (fringe, medallion field, bands between sections, as in the demo); logs as a stack of narrow woven runners or a sampler grid; tags as a dye chart of swatches; settings as a loom tag/label sheet; a single post as a long runner with woven title and plain Bitter body.
- Exact component breakdown inside `src/components/kilim/`.
- How the theme switch appears on the Kilim home page (AGENTS.md: each theme's home offers a switch to another theme).
- Test coverage beyond engine unit tests (patterns, font measuring, medallion symmetry), following `patterns.test.js`.
