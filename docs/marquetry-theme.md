# Marquetry

Marquetry presents Fezcodex as a cabinetmaker's codex: dark walnut navigation,
pale maple reading panels, contrasting veneer inlays, precise joints, and small
brass details. Long text and controls stay native HTML; decorative inlays share
the same geometric and wood-grain vocabulary throughout the site.

Choose Marquetry on `/design`, in Settings, or with **Switch Visual Theme** in
the command palette. `/?fezTheme=marquetry` selects the theme;
`&fezBlogMode=marquetry` also selects its reader explicitly. The Default reader
follows the site theme, while a saved reader selection remains independent.

## Scheduled default

`public/feature-flag.piml` controls the temporary default theme using the same
PIML configuration pattern as `public/banner.piml`. The current campaign selects Knit:

```piml
(featureFlags)
  > (flag)
    (id) knit-default
    (type) default-theme
    (theme) knit
    (from) 2026-10-29T00:00:00+03:00
    (to) 2026-12-31T23:59:59.999+03:00
    (isActive) true
```

The window includes all of October 29 through December 31, 2026 in Istanbul
time. A valid explicit URL selection or saved theme takes precedence. The
campaign default is never written to localStorage as a user preference; after
the window ends, visitors without an explicit choice return to Brufez. Set
`isActive` to `false` to disable the campaign. Unknown themes, invalid dates,
and reversed ranges are ignored.

The bundled PIML copy supplies the initial render and offline fallback. A
request to `/feature-flag.piml` refreshes the configuration after mounting.
Open sessions re-evaluate at campaign boundaries and when the window regains
focus. A selection made while that request is pending takes precedence.

## Structure

- `src/components/marquetry/`: wood textures, text, inlays, cards, dialogs and
  shared material components.
- `src/styles/Marquetry.css`: `mqt-` classes and `--mqt-*` material tokens.
- `src/pages/marquetry-views/`: themed page views.
- `src/pages/blog-views/MarquetryBlog*`: writing index and article reader.
- `src/pages/about-views/MarquetryAboutView.jsx`: profile view.
- `src/components/Marquetry*.jsx`: navigation, search, command palette and
  overlays.
- `src/hooks/useSiteTheme.js` and `src/utils/featureFlags.js`: explicit theme
  preference and scheduled default resolution.

Content sources, navigation order, saved settings, keyboard commands and
immersive route exceptions are shared with the existing themes.

## Verification

The feature flag and preference tests cover inclusive timezone boundaries,
expiry in an open session, offline behavior, malformed configuration, saved
preferences, URL precedence and a slow-request selection race:

```text
node node_modules/vitest/vitest.mjs run src/utils/featureFlags.test.js src/hooks/useSiteTheme.test.jsx src/utils/categoryColors.test.js
```
