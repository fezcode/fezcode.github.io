import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DemystifyHubPage from './DemystifyHubPage';
import GenreCollectionPage from './GenreCollectionPage';
import { clearDemystifyCache } from './demystifyData';
import { spectrumBars } from './spectrumScale';
import Spectrum from './Spectrum';
import {
  previewQuery,
  isMatch,
  findPreview,
  clearPreviewCache,
} from './trackPreview';
// Aliased: the testing-library lint rule treats any `render*` call as a
// component render and objects to how its result is named.
import { renderInline as inline } from './RichText';

const COLLECTIONS = `===
id: genre
rank: 01
name: GENRE
tag: MUSIC
status: LIVE
route: /demystify/genre
blurb: Music genres taken apart.

===
id: movie
rank: 02
name: MOVIE
tag: FILM
status: PENDING
route: /demystify/movie
blurb: Cinema decoded.
`;

const GENRE_INDEX = `===
id: trip-hop
rank: 01
name: TRIP HOP & DOWNTEMPO
family: Electronic
years: 1991 → present
sub: Bristol-born slow-motion hip hop
spec: 80,88,82,64,52,54,60,66,70,68,64,66,72,76,74,68,60,52,44,38
audio: /demystify/genre/triphop.mp3
tracks:
 - Easier Said Than Done | Morcheeba

===
id: prog-rock
rank: 02
name: PROGRESSIVE ROCK
family: Rock & Metal
years: 1967 → present
sub: Long-form rock that borrowed structure from classical music
spec: 62,70,74,66,58,60,64,68,70,72,68,64,66,70,74,72,66,58,50,42
tracks:
 - Trains | Porcupine Tree

===
id: chiptune
rank: 03
name: CHIPTUNE
family: Electronic
years: 1980 → present
sub: Music written for the sound chips of 8-bit consoles
spec: 20,28,42,56,66,72,78,82,86,88,86,82,84,88,90,86,78,68,58,48
`;

const TRIP_HOP = `id: trip-hop
rank: 01
name: TRIP HOP & DOWNTEMPO
family: Electronic
years: 1991 → present
sub: Bristol-born slow-motion hip hop
spec: 80,88,82,64,52,54,60,66,70,68,64,66,72,76,74,68,60,52,44,38
origin: Bristol, UK
signature: Slow moody vinyl breakbeats
audio: /demystify/genre/triphop.mp3

ascii:
+---+
| X |
+---+

what:
 Trip hop was named by the music press in 1994.
 Portishead added film-noir strings.

trivia:
 Portishead recorded to *acetate* and sampled that back.

tracks:
 - Easier Said Than Done | Morcheeba
`;

const routeFile = (url) => {
  if (url === '/demystify/index.txt') return COLLECTIONS;
  if (url === '/demystify/genre/index.txt') return GENRE_INDEX;
  if (url === '/demystify/genre/trip-hop.txt') return TRIP_HOP;
  return null;
};

const mockFetch = () =>
  vi.fn((url) => {
    const body = routeFile(url);
    if (body === null) return Promise.resolve({ ok: false, status: 404 });
    return Promise.resolve({ ok: true, text: () => Promise.resolve(body) });
  });

const renderGenre = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/demystify/genre" element={<GenreCollectionPage />} />
        <Route
          path="/demystify/genre/:entryId"
          element={<GenreCollectionPage />}
        />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  clearDemystifyCache();
  global.fetch = mockFetch();
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  clearDemystifyCache();
});

describe('spectrumBars', () => {
  // These profiles sit in a narrow band, so an absolute 0–100 scale renders the
  // bottom two thirds as a featureless slab. Bars are scaled to the genre's own
  // range instead, which is the difference between a chart and a rectangle.
  it('scales to the range present, not to an absolute 0–100', () => {
    const bars = spectrumBars([44, 84, 60]);
    expect(bars[1]).toBe(1); // the loudest band fills the chart…
    expect(bars[0]).toBeGreaterThan(0); // …and the quietest still shows
    expect(bars[0]).toBeLessThan(0.2);
    expect(bars[2]).toBeGreaterThan(bars[0]);
    expect(bars[2]).toBeLessThan(bars[1]);
  });

  it('fills the chart even though no genre reaches 100', () => {
    const bars = spectrumBars([68, 74, 72, 62, 84]);
    expect(Math.max(...bars)).toBe(1);
  });

  it('renders a flat profile without dividing by zero', () => {
    const bars = spectrumBars([50, 50, 50]);
    expect(bars.every(Number.isFinite)).toBe(true);
    expect(new Set(bars).size).toBe(1);
  });

  it('clamps out-of-range values instead of overflowing the chart', () => {
    const bars = spectrumBars([500, -20]);
    expect(Math.max(...bars)).toBe(1);
    expect(Math.min(...bars)).toBeGreaterThan(0);
    expect(bars.every((b) => b <= 1)).toBe(true);
  });

  it('returns nothing when a genre has no spectrum data', () => {
    expect(spectrumBars([])).toEqual([]);
    expect(spectrumBars(undefined)).toEqual([]);
  });
});

/* The assertions below are about SVG shape geometry, which has no accessible
   query — the chart exposes one role, `img`, and the bars inside it are not
   individually addressable. Querying the container is the only way to check
   that the rects actually line up. */
/* eslint-disable testing-library/no-container, testing-library/no-node-access */
describe('Spectrum', () => {
  // The block-character version could not tile exactly in a browser: a font's
  // FULL BLOCK glyph is not the height of a `line-height: 1` line box, so bars
  // showed seams and ragged edges. SVG rects have no such dependency.
  it('draws one rect per band plus the axis, with no gaps between rows', () => {
    const { container } = render(<Spectrum spec={[44, 84, 60]} />);
    const rects = container.querySelectorAll('.dm-spectrum-bars rect');
    expect(rects).toHaveLength(3);

    // Every bar sits on the same baseline: y + height is identical throughout.
    const baselines = [...rects].map(
      (r) => Number(r.getAttribute('y')) + Number(r.getAttribute('height')),
    );
    expect(new Set(baselines.map((b) => b.toFixed(3))).size).toBe(1);

    // The tallest band reaches the top of the plot.
    expect(Math.min(...[...rects].map((r) => Number(r.getAttribute('y'))))).toBe(
      0,
    );
    expect(container.querySelector('.dm-spectrum-axis')).toBeTruthy();
  });

  it('labels the axis and carries an accessible name', () => {
    const { container } = render(<Spectrum spec={new Array(20).fill(60)} />);
    const labels = [...container.querySelectorAll('.dm-spectrum-label')].map(
      (n) => n.textContent,
    );
    expect(labels).toEqual(['SUB', 'LOW', 'MID', 'UPPER', 'AIR']);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('frequency-energy'),
    );
  });

  it('renders nothing when a genre has no spectrum data', () => {
    const { container } = render(<Spectrum spec={[]} />);
    expect(container.querySelector('svg')).toBeNull();
  });
});
/* eslint-enable testing-library/no-container, testing-library/no-node-access */

describe('previewQuery', () => {
  // The catalogue does not know our display strings, so the search term has to
  // be looser than the text shown on screen.
  it.each([
    [
      { title: 'Trains — 2017 Remaster', artist: 'Porcupine Tree' },
      'Trains Porcupine Tree',
    ],
    [
      { title: 'Hemorrhage (In My Hands)', artist: 'Fuel' },
      'Hemorrhage Fuel',
    ],
    [
      { title: 'Mad About You — Live with Orchestra', artist: 'Hooverphonic' },
      'Mad About You Hooverphonic',
    ],
    // Multi-artist credits only match on the lead name.
    [{ title: 'Snake Eyes', artist: 'Feint, CoMa' }, 'Snake Eyes Feint'],
    [
      { title: 'Stylo', artist: 'Gorillaz, Bobby Womack, Mos Def' },
      'Stylo Gorillaz',
    ],
    [
      { title: "Peace of Akatosh (From 'Oblivion')", artist: 'Dreyma' },
      'Peace of Akatosh Dreyma',
    ],
  ])('cleans %o', (track, expected) => {
    expect(previewQuery(track)).toBe(expected);
  });

  it('is empty for a track with nothing to search on', () => {
    expect(previewQuery({})).toBe('');
    expect(previewQuery(undefined)).toBe('');
  });
});

describe('findPreview overrides', () => {
  afterEach(() => clearPreviewCache());

  it('plays a pinned URL as-is, without contacting the catalogue', async () => {
    global.fetch = vi.fn();
    const url = 'https://audio-ssl.itunes.apple.com/clip.m4a';
    await expect(
      findPreview({ title: 'KITCHEN LIGHTS', artist: 'Westside Gunn', preview: url }),
    ).resolves.toEqual({
      url,
      title: 'KITCHEN LIGHTS',
      artist: 'Westside Gunn',
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('does not search for a track marked as absent from the catalogue', async () => {
    global.fetch = vi.fn();
    await expect(
      findPreview({ title: 'Ghost', artist: 'Dizzee Rascal', preview: 'none' }),
    ).resolves.toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('isMatch', () => {
  // Apple's search always returns something. These are the actual wrong
  // results it gave for tracks it has no entry for — each must be rejected.
  it.each([
    [
      { title: 'Wyclef Jean', artist: 'Young Thug' },
      { trackName: 'I Swear (feat. Young Thug)', artistName: 'Wyclef Jean' },
    ],
    [
      { title: 'Ghost', artist: 'Dizzee Rascal' },
      {
        trackName: 'Here 2 China (feat. Dizzee Rascal & Dillon Francis)',
        artistName: 'Calvin Harris',
      },
    ],
    [
      { title: "Wat's Wrong", artist: 'Isaiah Rashad, Zacari, Kendrick Lamar' },
      { trackName: 'Warm Winds (feat. Isaiah Rashad)', artistName: 'SZA' },
    ],
    [
      // Right title, wrong artist entirely.
      { title: 'KITCHEN LIGHTS', artist: 'Westside Gunn, Stove God Cooks' },
      { trackName: 'Kitchen Lights (Instrumental)', artistName: 'Outcrowd.' },
    ],
  ])('rejects %o', (track, result) => {
    expect(isMatch(track, result)).toBe(false);
  });

  // …while still accepting the legitimate variations the catalogue returns.
  it.each([
    [
      { title: 'Snake Eyes', artist: 'Feint, CoMa' },
      { trackName: 'Snake Eyes (feat. CoMa)', artistName: 'Feint' },
    ],
    [
      { title: 'Trains — 2017 Remaster', artist: 'Porcupine Tree' },
      { trackName: 'Trains', artistName: 'Porcupine Tree' },
    ],
    [
      { title: 'Rococco - Original Mix - Remastered', artist: 'Kansai' },
      { trackName: 'Rococco (- Remastered)', artistName: 'Kansai' },
    ],
    [
      // Match on a credited artist other than the lead.
      { title: 'Masking', artist: 'ASM, MF DOOM' },
      { trackName: 'Masking', artistName: 'A State of Mind & MF DOOM' },
    ],
    [
      { title: 'Bir Derdim Var', artist: 'mor ve ötesi' },
      { trackName: 'Bir Derdim Var', artistName: 'mor ve ötesi' },
    ],
  ])('accepts %o', (track, result) => {
    expect(isMatch(track, result)).toBe(true);
  });
});

describe('renderInline', () => {
  it('turns *bold* and _italic_ into elements and leaves the rest as text', () => {
    const parts = inline('a *bee* and _cee_');
    expect(parts.filter((p) => typeof p !== 'string')).toHaveLength(2);
    expect(parts.filter((p) => typeof p === 'string').join('')).toBe('a  and ');
  });

  it('leaves a lone asterisk alone', () => {
    expect(inline('2 * 3').every((p) => typeof p === 'string')).toBe(true);
  });
});

describe('DemystifyHubPage', () => {
  it('links live collections and leaves pending ones inert', async () => {
    render(
      <MemoryRouter>
        <DemystifyHubPage />
      </MemoryRouter>,
    );

    const live = await screen.findByRole('link', { name: /GENRE/ });
    expect(live).toHaveAttribute('href', '/demystify/genre');

    const cards = within(screen.getByRole('list'));
    expect(cards.getByText('MOVIE')).toBeInTheDocument();
    expect(cards.getByText('PENDING')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /MOVIE/ })).toBeNull();
  });

  it('counts live collections from their own index', async () => {
    render(
      <MemoryRouter>
        <DemystifyHubPage />
      </MemoryRouter>,
    );
    expect(await screen.findByText('3 ENTRIES')).toBeInTheDocument();
  });

  it('reports a missing registry instead of rendering an empty page', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 404 }));
    render(
      <MemoryRouter>
        <DemystifyHubPage />
      </MemoryRouter>,
    );
    expect(await screen.findByText(/COULD NOT READ/)).toBeInTheDocument();
  });
});

describe('GenreCollectionPage — index', () => {
  // The genre list and the track-index table both link to a genre, so row
  // lookups are scoped to the list.
  const list = () => within(screen.getByRole('list'));
  const settle = () => screen.findByRole('list');

  it('lists entries as deep links and summarises the collection', async () => {
    renderGenre('/demystify/genre');
    await settle();

    expect(list().getByRole('link', { name: /TRIP HOP/ })).toHaveAttribute(
      'href',
      '/demystify/genre/trip-hop',
    );

    // 3 genres, 2 tracks, 2 families, span derived from the years fields.
    expect(screen.getByText('GENRES')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('TRACKS')).toBeInTheDocument();
    expect(screen.getByText('FAMILIES')).toBeInTheDocument();
    expect(screen.getByText('1967–1991')).toBeInTheDocument();
  });

  it('filters by family when a chip is pressed', async () => {
    renderGenre('/demystify/genre');
    await settle();

    await userEvent.click(screen.getByRole('button', { name: 'Rock & Metal' }));

    expect(
      list().getByRole('link', { name: /PROGRESSIVE ROCK/ }),
    ).toBeInTheDocument();
    expect(list().queryByRole('link', { name: /TRIP HOP/ })).toBeNull();
    expect(screen.getByText('SHOWING 1 OF 3 GENRES')).toBeInTheDocument();
  });

  it('searches across track and artist names, not just genre names', async () => {
    renderGenre('/demystify/genre');
    await settle();

    // "Morcheeba" appears only in trip-hop's track list.
    await userEvent.type(screen.getByRole('searchbox'), 'morcheeba');

    expect(list().getByRole('link', { name: /TRIP HOP/ })).toBeInTheDocument();
    expect(list().queryByRole('link', { name: /PROGRESSIVE ROCK/ })).toBeNull();
  });

  it('says so when nothing matches instead of showing an empty list', async () => {
    renderGenre('/demystify/genre');
    await settle();

    await userEvent.type(screen.getByRole('searchbox'), 'zzzznothing');
    expect(screen.getByText(/NOTHING MATCHES THAT FILTER/)).toBeInTheDocument();
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('builds a full track index ordered by playlist position', async () => {
    renderGenre('/demystify/genre');
    await settle();

    const rows = within(screen.getByRole('table')).getAllByRole('row');
    // header + 2 tracks, grouped by the genre's rank rather than playlist order
    expect(rows).toHaveLength(3);
    expect(rows[1]).toHaveTextContent('Easier Said Than Done');
    expect(rows[2]).toHaveTextContent('Trains');
  });

  it('publishes no playlist positions', async () => {
    renderGenre('/demystify/genre');
    await settle();

    const table = within(screen.getByRole('table'));
    expect(table.queryByText(/^P[12]·/)).toBeNull();
    expect(table.queryByRole('columnheader', { name: 'POS' })).toBeNull();
  });

  it('gives every row its own audition control, outside the link', async () => {
    renderGenre('/demystify/genre');
    await settle();

    const row = list().getByRole('link', { name: /TRIP HOP/ });
    expect(within(row).queryByRole('button')).toBeNull();
    expect(
      list().getByRole('button', { name: /ten-second excerpt.*TRIP HOP/ }),
    ).toBeInTheDocument();
  });

  it('keeps the full track index collapsed rather than listing all of it', async () => {
    renderGenre('/demystify/genre');
    await settle();

    const disclosure = screen.getByText(/FULL TRACK INDEX/);
    expect(disclosure.tagName).toBe('SUMMARY');
    expect(screen.getByText('2 TRACKS')).toBeInTheDocument();
    // The rows exist in the DOM but the disclosure ships closed.
    expect(screen.getByRole('group')).not.toHaveAttribute('open');
  });
});

describe('GenreCollectionPage — detail', () => {
  it('renders the atlas prose sections with their emphasis intact', async () => {
    renderGenre('/demystify/genre/trip-hop');

    expect(
      await screen.findByRole('heading', { name: /TRIP HOP/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Trip hop was named by the music press in 1994/),
    ).toBeInTheDocument();
    // Second paragraph stayed a separate paragraph.
    expect(
      screen.getByText('Portishead added film-noir strings.'),
    ).toBeInTheDocument();
    // *acetate* became real emphasis rather than literal asterisks.
    expect(screen.getByText('acetate').tagName).toBe('STRONG');
  });

  it('shows the family badge and the tracks, without provenance', async () => {
    renderGenre('/demystify/genre/trip-hop');
    await screen.findByRole('heading', { name: /TRIP HOP/ });

    expect(screen.getByText('Electronic')).toBeInTheDocument();
    expect(screen.getByText('Easier Said Than Done')).toBeInTheDocument();
    expect(screen.getByText('Morcheeba')).toBeInTheDocument();
    // Nothing on the page frames these as a personal rotation.
    expect(screen.queryByText(/ON REPEAT/i)).toBeNull();
    expect(screen.queryByText(/^P[12]·/)).toBeNull();
  });

  it('gives each track its own ten-second excerpt control', async () => {
    renderGenre('/demystify/genre/trip-hop');
    await screen.findByRole('heading', { name: /TRIP HOP/ });

    expect(
      screen.getByRole('button', {
        name: /ten-second excerpt.*Easier Said Than Done by Morcheeba/,
      }),
    ).toBeInTheDocument();
  });

  it('offers the next entry from a detail page', async () => {
    renderGenre('/demystify/genre/trip-hop');
    const next = await screen.findByRole('link', { name: /PROGRESSIVE ROCK/ });
    expect(next).toHaveAttribute('href', '/demystify/genre/prog-rock');
  });

  it('shows a not-found state for an unknown entry', async () => {
    renderGenre('/demystify/genre/nonexistent');
    expect(await screen.findByText(/NO ENTRY FILED UNDER/)).toBeInTheDocument();
  });
});
