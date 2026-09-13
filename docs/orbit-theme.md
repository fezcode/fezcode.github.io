# Orbit

Orbit is a personal observatory for Fezcodex: warm paper, cobalt accents, orbital navigation, compact software collections, and a serif article reader. Night appearance uses graphite surfaces and pale blue accents.

## Activation

- Choose **Orbit** in Settings, on `/design`, or through **Switch Visual Theme** in the command palette.
- `/?fezTheme=orbit` selects the site theme.
- `/?fezTheme=orbit&fezBlogMode=orbit` also selects its article reader.
- The default site theme remains Brutalist. Reader preferences remain independent: the **Default** reader follows the site theme; an explicit reader selection is preserved.

## Structure

Orbit follows the existing theme switchers in `src/pages` and `src/components`. Its pages live in `src/pages/orbit-views`, its writing views in `src/pages/blog-views`, and its reusable pieces in `src/components/orbit`. Orbit chrome uses the `Orbit` component prefix. Each theme retains its own sidebar component and visual design.

`src/styles/Orbit.css` owns the `orb-` classes and `--orb-*` tokens. `useOrbitPalette` stores `day` or `night` in the `orbit-palette` preference and exposes the selection through `data-orbit-register` on the document. Navbar, sidebar, and settings share a synchronized store. Other themes' palette preferences are independent.

`src/utils/siteThemes.js` registers the six site themes and supplies the shared command palette picker and URL validation.

The homepage, project archive, apps, writing, series, logs, and vocabulary read the existing content sources. Project and app artwork is deterministic CSS/markup or the existing project image. Dedicated project presentations, applications, and immersive routes retain the same layout exceptions used by the other themes.

The reader supports the shared Markdown pipeline, tables, math, Mermaid diagrams, vocabulary links, image expansion, code copying and expansion, and previous/next series chapters. Existing search, commands, settings, notifications, achievements, and companion actions are preserved.

## Sidebar configuration

All six themes share the item arrangement in `public/sidebar.piml`: the same section order, link order, labels, and destinations. Each renders that content using its own sidebar width, typography, colors, link styling, branding, and footer controls. Orbit retains its compact daylight/night sidebar; Ledger retains its numbered rows, dotted leaders, and register control.

`public/sidebar.piml` is the common navigation source. Sections and items render in file order, using their shared labels, icons, and destinations. There are no theme overrides. The first section, The Codex, contains the seven top links and sets `collapsible` to `false` so it stays open. Other sections are collapsible by default.

```piml
> (section)
  (id) isCodexOpen
  (label) The Codex
  (collapsible) false
  (content)
    > (item)
      (label) Writing
      (to) /blog
      (icon) ArticleIcon
```

Each link appears once. Existing section IDs retain saved collapse preferences across theme changes. Themes that display icons use the shared `appIcons` registry; Ledger keeps its text treatment. Edits to the PIML file apply to every theme after reload. `src/utils/sidebarNavigation.js` normalizes sections and external links for Orbit without theme-specific data overrides.

## About and project covers

`/about` selects `/about/orbit` while Orbit is active. `/about/orbit` is also available directly and in the About view switcher. It shares the existing `aboutData.js` profile, experience, skills, education, and interests. The Orbit site sidebar remains visible for this view; other About presentations retain their immersive layout.

Every project now has a local image in `projects.piml`. The covers in `public/images/projects/covers` are editable SVG graphics tailored to each utility. Regenerate them with `node scripts/generate-project-covers.mjs`; the generator uses the original Dush and Atelier vector logos copied from their repositories. Runir and Climb the Tall Building use their repository banners; Swat Tactics uses its existing game screenshot. Original Pidi and Atelier images remain available in their project image directories.

Orbit project cards display the configured project image before any decorative app artwork and preserve its full aspect ratio. If an image fails to load, the card shows a project monogram instead of a blank area. App illustrations retain their own treatment.

## Verification

- `node node_modules/eslint/bin/eslint.js` on the Orbit files and modified integrations.
- `node node_modules/vitest/vitest.mjs run src/components/orbit/useOrbitPalette.test.jsx src/utils/sidebarNavigation.test.js src/pages/OrbitReader.test.jsx src/components/Toast.test.js`
- `node node_modules/vite/bin/vite.js build` compiles and prerenders without running content-generation scripts.

On Node 25, set `NODE_OPTIONS=--no-experimental-webstorage` when running Vitest so jsdom supplies the browser storage API in worker processes.

Browser checks cover appearance persistence, theme switching, search and filters, reader and series navigation, dialogs, and layouts from 320px to desktop widths.
