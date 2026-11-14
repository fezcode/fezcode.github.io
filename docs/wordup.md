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

Additional flat metadata can describe a word without changing its content-file format. Omit unavailable values instead of inventing them.

Write the longer explanation in the `.txt` file using ordinary Markdown. Use distinct `##` headings for sections such as meaning, usage, examples and formation; these headings provide the entry's jump navigation. Avoid repeating the header's example. A cross-link has the form `[another word](/wordup/another-word)`; this is only a syntax example, not an existing destination.

## Sculptures and publishing

Each sculpture is deterministic: its seed comes from the normalized display word, preserving actual accented characters. Changing the slug, entry number or list order does not change that word's sculpture. No sculpture asset files are needed.

Search and language filters cover the collection and stay selected when switching views. The sculpture view shows six words at a time; hovering or focusing a word updates its preview. The A–Z index at `/wordup?view=index` lists every matching word, grouped by initial letter, with jump links and short meanings. Turkish and mixed collections use Turkish alphabetical order, keeping letters such as Ç, I, İ, Ö, Ş and Ü distinct; the English filter uses English order. Selecting a word in either view opens the same full entry. Rebuild after adding a word so its route appears in the static output.
