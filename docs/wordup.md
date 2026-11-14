# Writing a Wordup entry

Wordup lives at `/wordup`. Its index is `public/wordup/words.piml`; each word has a Markdown body at `public/wordup/<slug>.txt` and a page at `/wordup/<slug>`.

## Add a word

Add an item to the existing `(words)` collection. The current word, with its author's meaning, can be registered like this:

```text
(words)
  > (word)
    (slug) poskurmek
    (word) pöskürmek
    (language) tr
    (contentLanguage) tr
    (definition) To feel so mentally and emotionally depleted that you want only sleep, with no desire to work or move, despite not being physically tired.
    (translation) Bedeni yorulmadığı hâlde, zihinsel tükenme ve ruhsal çöküntü yüzünden çalışmaya ya da hareket etmeye istek duyamayıp yalnızca uyumak istemek.
    (date) 2026-11-14
    (status) defined
    (number) 01
```

Keep two spaces before `>` and four before each field. Use `tr` or `en` for `language`, and `YYYY-MM-DD` for `date`. The display word keeps its original spelling and accents; its unique URL slug uses lowercase ASCII letters, digits and single hyphens. Here the body file is `public/wordup/poskurmek.txt`.

Use `defined` once the author has supplied the meaning. For a future word whose meaning is still awaited, use `pending` and leave its meaning and body empty until supplied. Do not fill gaps with a guessed definition, pronunciation, origin or example. The manifest order controls the sculpture view and entry numbering; keep `number` consistent with it. The A–Z view sorts words independently.

## Add meaning and context

All metadata fields are flat, one-line values. Add only information supplied or approved by the author:

- `definition`: the short English meaning shown in previews and on English entry pages.
- `contentLanguage`: `tr` or `en` for the Markdown body and entry interface; defaults to `en`. This is separate from `language`, which describes the invented word. The body for pöskürmek is Turkish.
- `partOfSpeech`, `pronunciation`, `roots`: grammatical or word-formation details when known.
- `translation`: an authored Turkish rendering of the English definition. Turkish entries show this first, followed by the labelled English meaning. English entries show it as the labelled Turkish meaning.
- `register`, `forms`: intended tone and suggested forms; identify proposed constructions as proposed usage.
- `example`: one short usage example for the entry header.
- `related`: comma-separated slugs of other entries that actually exist.
- `ogImage` (or `image`): optional authored sharing artwork; this takes precedence over the generated word card and is never replaced by the generator.

Additional flat metadata can describe a word without changing its content-file format. Omit unavailable values instead of inventing them.

Write the longer explanation in the `.txt` file using ordinary Markdown. Use distinct `##` headings for sections such as meaning, usage, examples and formation; these headings provide the entry's jump navigation. Avoid repeating the header's example. A cross-link has the form `[another word](/wordup/another-word)`; this is only a syntax example, not an existing destination.

## Sculptures and publishing

Each sculpture is deterministic: its seed comes from the normalized display word, preserving actual accented characters. Changing the slug, entry number or list order does not change that word's sculpture. No sculpture asset files are needed.

The live sculpture initializes WebGL only when it first becomes visible. It renders at up to 30 fps while visible, and cancels its animation frame when offscreen, in a hidden tab, or behind the sharing dialog. Returning resumes its active animation time without jumping ahead. Reduced-motion preferences use a static pose, redrawn only when its word or size changes. Geometry, materials and the environment are reused until the word changes or the component unmounts; pausing retains these resources so resuming is inexpensive. The shared studio leaves rendering to the live scheduler, avoiding duplicate draws on resize and word changes. Static sharing cards keep their original rendering behavior.

Search and language filters cover the collection and stay selected when switching views. The sculpture view shows six words at a time; hovering or focusing a word updates its preview. The A–Z index at `/wordup?view=index` lists every matching word, grouped by initial letter, with jump links and short meanings. Turkish and mixed collections use Turkish alphabetical order, keeping letters such as Ç, I, İ, Ö, Ş and Ü distinct; the English filter uses English order. Selecting a word in either view opens the same full entry. Rebuild after adding a word so its route appears in the static output.

## Sharing artwork

Wordup's 1200×630 WebP card lives at `public/images/og/wordup.webp`. Each entry has a card at `public/images/og/wordup/<slug>.webp` showing the display word, short meaning and its actual 3D sculpture. Both the page and the card use `sculptureScene.js`; cards capture the deterministic `render(0)` pose with the same geometry, materials and lighting. Instrument Sans is bundled with its SIL license so rendering needs no font service.

These are persisted source assets. **An existing image is preserved unless regeneration is explicitly requested**, even when a definition or renderer changes. Normal startup and all build variants create missing cards only. Authored `ogImage`/`image` overrides are always respected.

```powershell
# Generate missing cards; preserve all existing artwork.
node scripts/generate-wordup-og.mjs

# Explicitly replace only the collection card.
node scripts/generate-wordup-og.mjs --force --index-only

# Explicitly replace only a registered word's card.
node scripts/generate-wordup-og.mjs --force --slug cancil
```

While Vite is running, preview exported cards at `/images/og/wordup.webp` or `/images/og/wordup/cancil.webp`. The HTML renderer is served by the generator's isolated temporary Vite server, outside application routing and sitemap discovery. The exported WebP files are served in both development and production, and the same URLs are used by React metadata and the static metadata injector.

The Share button on the collection and each loaded entry opens a card preview. Link copying uses the canonical `https://fezcode.com/wordup[/slug]` address, including during local development. Image copying converts the existing sharing image to PNG for the clipboard; it never renders a new sculpture or changes the stored artwork. Unsupported or denied image copying offers the original card as a download instead. The dialog follows the entry's interface language and supports Escape, keyboard focus containment and focus return.

## Measure live rendering

Run `node scripts/perf/wordup.mjs current 5198`, then open `http://127.0.0.1:5198/scripts/perf/wordup.html`. This builds an isolated production bundle without generating routes or touching OG artwork. Choose a word, let shaders warm up, then sample five seconds with the sculpture visible, offscreen, or paused. Use the same viewport and device pixel ratio when comparing builds. Labels create separate cached builds, so `before` and `after` can run on different ports for direct comparison. Stop the server with Ctrl+C.

The profiler counts actual scene renders and measures CPU submission time around `renderer.render`; it does not measure GPU execution, battery use or power consumption. Three's transmissive material uses multiple passes, so reported rendered triangles exceed the unique geometry triangle count.

An optimized-build comparison on 2026-11-14 used the same 750×700 drawing buffer at DPR 1 in the desktop in-app browser (approximately 120 Hz), after warmup:

| Scene                 | Before: renders / sample | After: renders / sample |
| --------------------- | ------------------------ | ----------------------- |
| püfre, visible        | 601 / 5.006 s            | 150 / 5.002 s           |
| cancıl, visible       | 601 / 5.008 s            | 151 / 5.005 s           |
| püfre, offscreen      | 601 / 5.001 s            | 0 / 5.015 s             |
| püfre, activity pause | —                        | 0 / 5.001 s             |

Visible frame counts fell by approximately 75% on this 120 Hz display, with identical draw calls and rendered triangle counts per frame. Background-tab cancellation is covered by visibility-change tests; this in-app browser kept documents marked visible when switching its tabs, so it did not provide a real hidden-tab measurement. Browser tests also confirmed the live entry pauses behind the share dialog and resumes on close.
