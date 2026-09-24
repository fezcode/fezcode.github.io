# Project Showcases

Fezcodex supports different project detail page styles to best present each project. Currently, there are two distinct styles available: "Stylish" and "Techno".

## 1. Activation

To assign a style to a project, set the `(style)` field in `public/projects/projects.piml`:

```piml
> (project)
  (slug) my-cool-project
  (style) stylish  ; or 'techno'
  ...
```

If no style is specified, the default layout will be used.

---

## 2. Stylish Layout

This layout is designed for high-production, landing-page style showcases. It features a rich, component-driven design ideal for web apps and major projects.

### Directory Structure
Content resides in `public/projects/[slug]/` as `.txt` files (previously `.mdx`).

```text
public/projects/my-project/
├── hero.txt          # Hero section
├── partners.txt      # Tech stack/Partners
├── terminal.txt      # Interactive terminal tabs
├── integrations.txt  # Feature showcase grid
├── features.txt      # Icon cards grid
├── technical.txt     # Technical specs
├── details.txt       # Long-form content
└── cta.txt           # Call to action
```

### File Specifications
(Same block parsing rules as before apply, e.g., `:::feature`, `:::tech`)

---

## 3. Editorial Layout

The **Editorial** style (formerly Techno) is a raw, brutalist, developer-focused aesthetic. It uses monospaced fonts, high-contrast dark modes, and terminal-inspired elements. It is perfect for CLIs, system tools, and low-level libraries.

### Directory Structure
Content resides in `public/projects/[slug]/` as `.txt` files.

```text
public/projects/my-cli-tool/
├── hero.txt          # Hero title and description
├── features.txt      # (Not currently used in Editorial layout, but reserved)
├── terminal.txt      # Terminal session preview (supports colors)
├── install.txt       # Installation command(s)
├── social.txt        # Horizontal scrollable "social proof" or "explore" cards
├── description.txt   # Main project description (Overview, Features)
└── footer.txt        # (Reserved for footer links)
```

### File Specifications

#### `hero.txt`
*   **Lines starting with `#`**: Title lines (rendered in large serif font).
*   **image:** tag: (Ignored in Editorial layout as it uses a global background grid, but good to keep for metadata).
*   **Body**: Description text below the title.

```txt
# Engineered
# For The Shell

Dush is the custom terminal shell...
```

#### `terminal.txt`
Raw text that is rendered inside a terminal window component.
*   Supports standard Markdown code blocks.
*   Use `rehype-raw` compatible HTML spans for colors if needed (e.g., `<span class="text-yellow-500">warn</span>`).

```txt
  <span class="text-[#b8bb26]">➜</span> ~ dush
  dush> echo "hello"
```

#### `install.txt`
Contains the raw installation command string.

```txt
go install github.com/fezcode/dush@latest
```

#### `social.txt`
Defines the "Explore With Us" cards. Entries are separated by `---`.
*   **Line 1**: Title (optionally starts with `#`).
*   **Line 2**: Author / Subtitle.
*   **Line 3**: Stats string (e.g., `+10 -2 ~1`).
*   **link:**: URL for the card.
*   **image:**: (Optional) Background image URL.

```txt
# Why I built Dush
fezcode
+10 -2 ~1
link: https://github.com/fezcode/dush
---
# Architecture
...
```

#### `description.txt`
The main content area ("About the Project").
*   Standard Markdown.
*   Supports lists, bolding, and headers.
*   `## Headings` separate the content into different grid rows in the layout.

```txt
## Overview
Dush is a minimalist shell...

## Key Features
- Feature 1
- Feature 2
```

## 4. Hi-Fi Layout

The **Hi-Fi** style (`(style) hifi`) turns the project page into a working music
player. It was built for **Timp** but is fully data-driven and reusable for any
audio/media project. Warm near-black ink, cream type (Unbounded display, Hanken
Grotesk body, Spline Sans Mono labels), and — the signature — a transport that
"plays" a queue of color palettes: every record re-samples the whole page's
accent colors, exactly like Timp samples its accent from album art.

Sections mirror the app's own panels: **Now Playing** (hero player + record
rack), **The Queue** (features as tracks, keyed with real hotkeys), **Lyrics**
(manifesto with scroll-synced karaoke highlight), **Equalizer** (source modules
as faders, heights = real file sizes), **Screens**, and **Liner Notes** (stats,
build snippet, credits). A mini-player bar docks to the bottom once the hero
scrolls away.

### Directory Structure

All content lives in a single JSON config:

```text
public/projects/my-player/
└── hifi.txt          # One JSON config for the whole page
```

### `hifi.txt` keys

*   `wordmark`, `tagline`, `artist`, `version`, `repo`, `download`, `formats`
*   `trackSeconds`: how long each palette "track" plays (default 24)
*   `queue[]`: `{ title, desc, keys[], palette: { name, a, b } }` — one entry
    per feature; `a`/`b` are the two gradient stops sampled into `--acc`/`--acc2`
*   `lyrics`: `{ caption, lines[] }`
*   `eq`: `{ heading, note, bands[]: { file, kb, level (0..1), role } }`
*   `screens[]`: `{ src, caption }`
*   `stats[]`: `{ value, label }`
*   `build`: `{ caption, lines[] }` (rendered with a copy button)
*   `liner[]`: paragraphs, `credits[]`: `{ name, role, href }`, `license`

## 5. Bentos Layout

The **Bentos** style (`(style) bentos`) is a long-form product launch page that
alternates light and dark bands, after the umbrelOS landing page. It was built
for **Airlift** and is fully data-driven. Manrope display/body, Style Script for
the one hand-lettered hero word, Instrument Serif for the tilted "craft" cards.
The sticky header switches between light and dark to match the band beneath it
(sections carry `data-tone`).

Bands, top to bottom: pastel **hero** (headline + script word, icon orbit, CTAs,
a device frame with a working theme switch and blurred side peeks), dark
**bento grid** of mixed tiles plus a story carousel, a **companion** card
(terminal + status panel), a light **catalog** (category tabs over a sliding card
track), dark **feature slides**, light **screenshot rails**, **ways to run**
comparison cards with dot ratings, tilted **craft** cards, a **trust** bento with
an animated dot matrix, a **changelog** masonry wall, a closing CTA and a coloured
footer. Every block is optional: omit a key to drop its band.

### Directory Structure

```text
public/projects/my-app/
└── app.txt           # One JSON config (shared app-shell schema, extended)
```

### `app.txt` keys

*   Shell: `name`, `logo`, `version`, `tagline`, `subtitle`, `download`,
    `downloadLabel`, `repo`, `repoLabel`, `stack[]`, `announcement { badge, text, href }`,
    `nav[] { label, href }`
*   `hero { lines[2], script, subtitle, primary, secondary, caption }`
*   `showcase { address, themes[] { id, label, swatch, image }, left, right }`
*   `whatsNew { eyebrow, title, tiles[], stories[] { image, title, body } }` —
    each tile has `type`, `col` (of 12) and `row` (166px units). Types: `shot`
    (`title, image, icon, focus`), `photo` (`image, title, highlight, tint, ink,
    highlightColor`), `toggle` (`word, label`), `metal` (`word, label`), `icons`
    (`image, title, icons[]`), `big` (`image, word, number`), `chat` (`ask, reply,
    label`), `keys` (`keys[], title`), `note` (`title, body`), `frame` (`title, body`)
*   `pocket { badge, eyebrow, title, body, buttons[], note, commands[] { cmd, note },
    panel { title, subtitle, status, detail, rows[] { label, value }, footTitle, foot } }`
*   `catalog { eyebrow, title[], subtitle, groups[] { label, icon, heading, body,
    apps[] { name, line, icon, href } }, cta }`
*   `features { eyebrow, title, subtitle, slides[] { eyebrow, title?, highlight, after, image } }`
*   `rails[] { id, eyebrow, title, cards[] { image, title, body } }`
*   `ways { eyebrow, title, options[] { name, art (installer|folder|terminal), file,
    badge?, cta, ratings[] { label, value 0..5 | text }, bestFor, youGet } }`
*   `craft { eyebrow, title, body, cards[] { before, highlight, image, tone } }`
*   `trust { eyebrow, title, body, big { title, body, cta }, small[] { icon (home|shield), title, body, chip } }`
*   `changelog { eyebrow, title, body, entries[] { version, date, body, image? } }` —
    each card links to `<repo>/releases/tag/v<version>`
*   `closing { title, body, primary, secondary, links[] { title, body, href }, tagline }`
*   `footer { title, body, columns[] { title, links[] { label, href } } }`

## 6. Assets

*   **Images**: Place images in `public/images/projects/` or `public/images/bg/`.
*   **Icons**: Use Phosphor icons where applicable in code, or SVG assets.

## 7. Adding a New Project Checklist

1.  Create the folder `public/projects/[your-slug]`.
2.  Choose your style: `stylish`, `editorial`, `hifi`, etc.
3.  Create the corresponding `.txt` files based on the chosen style's structure.
4.  Add the project to `public/projects/projects.piml` with the correct `(style)` field.
5.  Run `npm run lint` to ensure code quality.