import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DemystifyHubPage from './DemystifyHubPage';
import GenreCollectionPage from './GenreCollectionPage';
import { clearDemystifyCache } from './demystifyData';

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
id: grunge
rank: 01
name: GRUNGE
years: 1989 → 1996
tag: ALT-ROCK

===
id: britpop
rank: 02
name: BRITPOP
years: 1993 → 1997
tag: UK GUITAR POP
`;

const GRUNGE = `===
id: grunge
rank: 01
name: GRUNGE
years: 1989 → 1996
tag: ALT-ROCK
origin: Seattle, WA
signature: Loud-quiet-loud dynamics
keyGear: Big Muff, Fender Jaguar
breakdown: Born in Seattle, sharpened by Sub Pop.
ascii:
+-----------+
| GRUNGE    |
+-----------+
examples:
- Nevermind (1991) | Butch Vig production
`;

const routeFile = (url) => {
  if (url === '/demystify/index.txt') return COLLECTIONS;
  if (url === '/demystify/genre/index.txt') return GENRE_INDEX;
  if (url === '/demystify/genre/grunge.txt') return GRUNGE;
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

describe('DemystifyHubPage', () => {
  it('links live collections and leaves pending ones inert', async () => {
    render(
      <MemoryRouter>
        <DemystifyHubPage />
      </MemoryRouter>,
    );

    const live = await screen.findByRole('link', { name: /GENRE/ });
    expect(live).toHaveAttribute('href', '/demystify/genre');

    // Scoped to the card list: the summary line above it also says "PENDING".
    const cards = within(screen.getByRole('list'));
    expect(cards.getByText('MOVIE')).toBeInTheDocument();
    expect(cards.getByText('PENDING')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /MOVIE/ })).toBeNull();
  });

  it('counts live collections from their own index rather than a stale field', async () => {
    render(
      <MemoryRouter>
        <DemystifyHubPage />
      </MemoryRouter>,
    );

    // GENRE_INDEX holds two entries; nothing declares a count anywhere.
    expect(await screen.findByText('2 ENTRIES')).toBeInTheDocument();
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

describe('GenreCollectionPage', () => {
  it('lists entries as deep links to their own page', async () => {
    renderGenre('/demystify/genre');

    const grunge = await screen.findByRole('link', { name: /GRUNGE/ });
    expect(grunge).toHaveAttribute('href', '/demystify/genre/grunge');
    expect(screen.getByRole('link', { name: /BRITPOP/ })).toHaveAttribute(
      'href',
      '/demystify/genre/britpop',
    );
  });

  it('gives every row its own audition control, outside the link', async () => {
    renderGenre('/demystify/genre');

    const row = await screen.findByRole('link', { name: /GRUNGE/ });
    // Nesting a button inside the row link would be invalid HTML and would
    // swallow the click; the control must be a sibling of the anchor.
    expect(within(row).queryByRole('button')).toBeNull();
    expect(
      screen.getByRole('button', { name: /Play a sample of GRUNGE/ }),
    ).toBeInTheDocument();
  });

  it('renders a single entry from its own route', async () => {
    renderGenre('/demystify/genre/grunge');

    expect(
      await screen.findByRole('heading', { name: /GRUNGE/ }),
    ).toBeInTheDocument();
    expect(screen.getByText('Loud-quiet-loud dynamics')).toBeInTheDocument();
    expect(
      screen.getByText('Born in Seattle, sharpened by Sub Pop.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Nevermind (1991)')).toBeInTheDocument();
  });

  it('offers the next entry from a detail page', async () => {
    renderGenre('/demystify/genre/grunge');

    const next = await screen.findByRole('link', { name: /BRITPOP/ });
    expect(next).toHaveAttribute('href', '/demystify/genre/britpop');
  });

  it('shows a not-found state for an unknown entry', async () => {
    renderGenre('/demystify/genre/nonexistent');

    expect(await screen.findByText(/NO ENTRY FILED UNDER/)).toBeInTheDocument();
  });
});
