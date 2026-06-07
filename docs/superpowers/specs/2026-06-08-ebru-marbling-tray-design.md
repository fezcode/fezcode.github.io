# Ebru — the Marbling Tray · Design Spec

- **Date:** 2026-06-08
- **Status:** Approved (ready for implementation plan)
- **Type:** New app for the fezcodex `/apps` collection
- **Category:** Whimsical Tools

## Summary

A hands-on Turkish paper-marbling (*ebru*) simulator. The user floats pigments
on a water surface, combs and swirls them with authentic tools, then "lays the
paper" to lift and save the print. Every plate is made **by hand** — there is no
randomize or auto-generate. It sits beside Fractal Flora as a generative-art
toy, but uses a completely different engine (fluid marbling, not recursive
trees) and a distinct **Ottoman illuminated-manuscript** aesthetic.

## Goals

- A faithful, tactile ebru *craft* experience: drop → comb → lay paper.
- Authentic results: the three core tools must be enough to hand-make the
  classic figures (battal, gel-git, taraklı, tulip/lale, bülbül yuvası).
- Crisp, high-resolution, exportable output.
- Self-contained, single-screen, matches existing app conventions.

## Non-Goals (out of scope for v1 — YAGNI)

- Randomize / one-click "generate a pattern."
- Save/load sessions or multi-page galleries.
- A custom palette editor.
- Ox-gall / surface-tension physical realism.
- Pressure-sensitive pens / dedicated mobile gestures beyond basic
  pointer drag.

## User Experience

Single screen, three zones:

1. **Header band** — illuminated title "Ebru", subtitle "THE MARBLING TRAY · SU
   EBRUSU", gold double-rule, small Ottoman flourishes.
2. **Left rail** — pigment palette (traditional ebru colors), tool selector
   (Dropper / Needle / Comb), and contextual sliders (drop size; comb tine
   count & spacing).
3. **The tray** — the dominant central canvas (the water surface), framed like a
   manuscript plate, with an editable caption ("LEVHA I · BATTAL EBRUSU ·
   MMXXVI").
4. **Action bar** — Undo, New Tray, and "Lay Paper & Save".

Interaction loop: pick a pigment → choose a tool → act on the tray (tap to drop,
drag to comb/swirl) → repeat → Lay Paper to export.

## Engine — Geometric Mathematical Marbling

The approved model is **geometric** (Jaffer/Lu "mathematical marbling"), not a
raster fluid sim. Ink is represented as **colored polygons**; tools apply
closed-form, area-preserving transforms to every existing vertex. This yields
crisp, authentic ebru, runs fast, is deterministic, and is vector-exportable.

### Geometry & data model

- A **tray** is an ordered list of **ink polygons** (back-to-front z-order).
  Each polygon = `{ color, points: [{x,y}, …] }` in normalized tray space.
- The authoritative state is an **operation log**: an ordered list of ops
  - `{ type: 'drop', c:{x,y}, r, color }`
  - `{ type: 'comb', path:[…], tines, spacing, sharpness, magnitude, axis }`
  - `{ type: 'needle', path:[…], magnitude }`
- Geometry is derived by **replaying** the op log from an empty tray. This makes
  state deterministic, undo trivial, and SVG export possible.

### Transforms

**Ink drop** — a new circular drop, center `c`, radius `r`. Every existing
vertex `p` is pushed radially outward:

```
p' = c + (p − c) · sqrt(1 + r² / |p − c|²)
```

This is area-preserving and is the defining ebru operation. Invariant:
`|p' − c| = sqrt(|p − c|² + r²)`. The new drop is then appended as a fresh
circular polygon (color = current pigment) on top.

**Tine line (comb tooth / needle)** — drags fluid along a direction. For a tine
line with unit direction `u`, displacement magnitude `M`, sharpness `z ∈ (0,1)`,
and decay length `c`: each vertex `p` at perpendicular distance `d` from the tine
line is translated along `u`:

```
p' = p + (M · z^(|d| / c)) · u
```

- A **comb** is an array of parallel tines (count = `tines`, gap = `spacing`);
  dragging it applies the tine transform incrementally along the drag path.
- A **needle (biz)** is effectively a single sharp tine with a small decay
  length, used for swirls, tulips, and hearts.
- Constants (`z`, `c`, default `M`) are tunable; defaults chosen to match
  reference ebru visuals.

### Edge subdivision

After each transform, polygon edges stretch. To keep circles round and combed
lines smooth, **adaptively resample**: split any edge longer than a max-edge
threshold by inserting midpoints. Cap total vertices (target < ~50k) by merging
where density is excessive, to protect frame rate.

### Live preview vs. committed state

- Keep a **materialized polygon list** for the committed state (replayed log).
- During an in-progress drag, apply incremental transforms to a working copy for
  60fps live preview.
- On pointer-up, push **one** op to the log and re-commit.
- **Undo** pops the last op and replays the committed ops (cost acceptable on the
  undo action only).

### Rendering

- HTML5 **Canvas 2D**. Fill each polygon path with its color, back to front,
  over the water/base color. Rely on canvas antialiasing.
- **Export**: re-rasterize the op log to an offscreen canvas at high resolution
  (e.g. 2000px on the long edge) for PNG; optionally serialize polygons to
  **SVG** for vector export.

## Tools & Controls

| Tool | Turkish | Action | Controls |
| --- | --- | --- | --- |
| Dropper | Damlalık | Tap to drop pigment | drop size |
| Needle | Biz | Drag to swirl a single point | (fixed sharp decay) |
| Comb | Tarak | Drag a multi-tine rake across | tine count, spacing |

Plus: pigment palette (select current color), Undo, New Tray.

## Aesthetic — Ottoman Illuminated Manuscript

Deliberately distinct from Fractal Flora's "pressed-fern herbarium." Design
tokens:

```
paper      #ECE3CD   paperDeep  #D8CBA6
gold       #B08D3E   goldDeep   #9A7A32
indigo     #1C3A5E   ink        #2B2417
```

Traditional ebru pigments (default palette):

```
indigo   #1F4E6B   madder   #B23A2A   ochre    #D3A13A   sap green #3F7A4E
lampblk  #14202A   turkuaz  #1F8F9A   mor      #6B3F8F   havva     #ECE3CD
```

- Double gold rule border around the whole app; illuminated header band with
  ۞ / ﷽ flourishes.
- Elegant serif display with letter-spaced small-caps Turkish labels
  (BOYALAR · PIGMENTS, ALETLER · TOOLS). Avoid Fractal Flora's exact
  Playfair + Space Mono pairing.
- Tray framed in indigo with an offset gold outline; caption in italic small
  caps with Roman-numeral plate number and year.

## File Structure (matches existing conventions)

- `src/pages/apps/EbruPage.jsx` — single-file app page: design tokens, UI,
  tool/pigment state, pointer handling, SEO (`Seo`), toast (`useToast`).
- `src/pages/apps/ebru/marblingEngine.js` (or co-located module) — the engine as
  its own unit: polygon model, `applyDrop`, `applyTine`, `subdivide`, `replay`,
  `render(ctx)`, `exportPNG`, `exportSVG`. Pure functions, no React — so it is
  unit-testable in isolation.
- Register route consistent with other apps (lazy-loaded, e.g. alongside
  `FractalFloraPage`).
- Add entry to `public/apps/apps.json` under **Whimsical Tools**
  (`slug: "ebru"`, `to: "/apps/ebru"`, `title: "Ebru"`, Phosphor icon
  `DropIcon`, `created_at` = build date).
- Regenerate `public/rss.xml` and `public/sitemap.xml` via
  `npm run generate-rss` / `npm run generate-sitemap`.

## Output

"Lay Paper" plays a brief reveal animation (paper descends onto the tray and
lifts with the pattern), then downloads a high-res PNG. Optional SVG export
since the model is vector. Filename includes the plate caption/slug.

## Testing Strategy

Project uses **vitest**. Engine is pure → unit-testable.

- **Ink drop:** a vertex at distance `d` from center maps to distance
  `sqrt(d² + r²)` (the core invariant). Verify for several `d`, `r`.
- **Drop displacement direction:** points move radially outward from `c`.
- **Tine line:** points on the line translate by `M`; far points ≈ 0;
  displacement decays monotonically with distance.
- **Subdivision:** after transforms, max edge length stays under threshold;
  vertex count stays under the cap.
- **Replay determinism:** identical op logs produce identical geometry.
- **Component smoke test:** page renders; switching tools updates state; Undo
  pops the last op; New Tray clears.
- **Manual visual check:** battal and gel-git sequences look authentic; export
  PNG is crisp at target resolution.

## Resolved Decisions

- Engine: **geometric / vector mathematical marbling** (not raster fluid sim).
- Category: **Whimsical Tools** (tactile experience, like *Paper & Ink*).
- Aesthetic: **manuscript plate**, rendered as an **Ottoman illuminated**
  treatment to stay distinct from Fractal Flora.
