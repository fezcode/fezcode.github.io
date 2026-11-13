# Feature flags

`public/feature-flag.piml` controls scheduled defaults using the same PIML
configuration pattern as `public/banner.piml`. The current campaign selects Knit:

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
time. An explicit valid URL selection or saved theme takes precedence. The
campaign default is never persisted as a user preference; after the window
ends, visitors without an explicit choice return to Brufez. Set `isActive` to
`false` to disable a campaign. Unknown themes, invalid dates, and reversed
ranges are ignored.

The bundled PIML copy supplies the initial render and offline fallback. A
request to `/feature-flag.piml` refreshes configuration after mounting. Open
sessions re-evaluate at campaign boundaries and when the window regains focus.
A selection made while that request is pending takes precedence.

Theme IDs are registered in `src/utils/siteThemes.js`. Unavailable saved theme
IDs fall back to the current default. Unavailable saved reader modes reset to
`standard`, which follows the site theme.

The boundary, preference, and offline behavior are covered by:

```text
node node_modules/vitest/vitest.mjs run src/utils/featureFlags.test.js src/hooks/useSiteTheme.test.jsx src/context/VisualSettingsContext.test.jsx
```
