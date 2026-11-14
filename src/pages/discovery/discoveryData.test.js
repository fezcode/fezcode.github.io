import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  entryPath,
  fetchDiscoveryEntries,
  filterDiscoveryEntries,
  getCategoryTheme,
  getEntryCover,
  loadDiscoveryBody,
} from './discoveryData';

const response = (value, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => value,
  json: async () => value,
});
const item = (slug, date, extra = '') =>
  `(logs)\n  > (item)\n    (category) Game\n    (title) ${slug}\n    (slug) ${slug}\n    (date) ${date}\n    (rating) 4\n${extra}`;

afterEach(() => vi.unstubAllGlobals());

describe('discovery indexes', () => {
  it('keeps healthy categories when one fails and loads no detail notes', async () => {
    const fetchMock = vi.fn(async (url) => {
      if (url.startsWith('/images/discovery/')) return response({}, 404);
      if (url === '/logs/index.json')
        return response({ categories: ['game', 'book'] });
      if (url === '/logs/book/book.piml') throw new Error('offline');
      if (url === '/logs/game/game.piml')
        return response(item('real-game', '2026-11-14'));
      throw new Error(`Unexpected detail request: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    const result = await fetchDiscoveryEntries();
    expect(result.failedCategories).toEqual(['book']);
    expect(result.entries).toMatchObject([
      {
        id: 'game/real-game',
        category: 'game',
        categoryLabel: 'Game',
        slug: 'real-game',
        rating: 4,
      },
    ]);
    expect(result.entries[0].fallbackCover).toBe(
      '/images/discovery/covers/game/real-game.svg',
    );
    expect(fetchMock.mock.calls.some(([url]) => url.endsWith('.txt'))).toBe(
      false,
    );
  });

  it('deduplicates stable identities, rejects unsafe slugs and sorts bad dates last', async () => {
    const entries = `${item('newest', '2026-11-14')}\n  > (item)\n    (title) oldest\n    (slug) oldest\n    (date) 2025-01-01\n  > (item)\n    (title) no-date\n    (slug) no-date\n    (date) invalid\n  > (item)\n    (title) duplicate\n    (slug) newest\n  > (item)\n    (title) unsafe\n    (slug) ../outside`;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url) =>
        url === '/logs/index.json'
          ? response({ categories: ['game'] })
          : url.endsWith('.json')
            ? response({}, 404)
            : response(entries),
      ),
    );
    const { entries: loaded } = await fetchDiscoveryEntries();
    expect(loaded.map((entry) => entry.slug)).toEqual([
      'newest',
      'oldest',
      'no-date',
    ]);
    expect(loaded[0].id).toBe('game/newest');
  });

  it('combines downloaded game and media artwork without replacing authored covers or spine crops', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url) => {
        if (url === '/logs/index.json')
          return response({ categories: ['game', 'music'] });
        if (url === '/images/discovery/game-art.json')
          return response({ 'steam-game': '/images/discovery/art/game.jpg' });
        if (url === '/images/discovery/media-art.json')
          return response({
            'music/album': '/images/discovery/art/album.jpg',
            'music/authored': '/images/discovery/art/other.jpg',
          });
        if (url === '/logs/game/game.piml')
          return response(
            item(
              'steam-game',
              '2026-11-14',
              '    (image) /images/defaults/stock.jpg\n',
            ),
          );
        if (url === '/logs/music/music.piml')
          return response(
            `${item('album', '2026-11-14', '    (image) https://i.ytimg.com/vi/bWPOLL_Rr8U/maxresdefault.jpg\n    (link) https://www.youtube.com/watch?v=bWPOLL_Rr8U\n')}\n  > (item)\n    (title) Authored\n    (slug) authored\n    (date) 2026-11-13\n    (coverArt) /images/custom/poster.jpg\n    (spineImage) /images/custom/spine.jpg\n    (imagePosition) 50% 20%`,
          );
        throw new Error(`Unexpected request ${url}`);
      }),
    );
    const { entries: loaded, failedCategories } = await fetchDiscoveryEntries();
    expect(failedCategories).toEqual([]);
    expect(loaded.find((entry) => entry.id === 'game/steam-game').cover).toBe(
      '/images/discovery/art/game.jpg',
    );
    expect(loaded.find((entry) => entry.id === 'music/album').cover).toBe(
      '/images/discovery/art/album.jpg',
    );
    expect(loaded.find((entry) => entry.id === 'music/authored')).toMatchObject(
      {
        cover: '/images/custom/poster.jpg',
        spineImage: '/images/custom/spine.jpg',
        imagePosition: '50% 20%',
      },
    );
  });

  it('keeps discoveries when optional artwork manifests are missing or malformed', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url) => {
        if (url === '/logs/index.json')
          return response({ categories: ['game'] });
        if (url === '/images/discovery/game-art.json') return response({}, 404);
        if (url === '/images/discovery/media-art.json')
          return {
            ok: true,
            json: async () => {
              throw new Error('HTML fallback');
            },
          };
        return response(item('real-game', '2026-11-14'));
      }),
    );
    const { entries: loaded, failedCategories } = await fetchDiscoveryEntries();
    expect(failedCategories).toEqual([]);
    expect(loaded).toHaveLength(1);
    expect(loaded[0].cover).toBe('/images/discovery/covers/game/real-game.svg');
  });

  it('does not turn a cancelled load into a partial empty result', async () => {
    const controller = new AbortController();
    controller.abort();
    vi.stubGlobal('fetch', vi.fn());
    await expect(
      fetchDiscoveryEntries({ signal: controller.signal }),
    ).rejects.toMatchObject({ name: 'AbortError' });
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe('gallery search and ordering', () => {
  const entries = [
    {
      id: 'game/one',
      category: 'game',
      categoryLabel: 'Game',
      title: 'Moon Walker',
      credit: 'Studio A',
      description: 'A quiet mystery',
      tags: ['stealth'],
      date: '2026-01-01',
      rating: 3,
    },
    {
      id: 'music/two',
      category: 'music',
      categoryLabel: 'Music',
      title: 'Night Drive',
      credit: 'The Artist',
      description: 'An electronic album',
      tags: ['synth'],
      date: '2026-02-01',
      rating: 5,
    },
  ];
  it('combines category and every search term across credits, titles and tags', () => {
    expect(
      filterDiscoveryEntries(entries, {
        category: 'Game',
        query: 'STUDIO stealth',
      }).map((entry) => entry.id),
    ).toEqual(['game/one']);
    expect(
      filterDiscoveryEntries(entries, { category: 'game', query: 'synth' }),
    ).toEqual([]);
    expect(
      filterDiscoveryEntries(entries, { query: 'artist electronic' }).map(
        (entry) => entry.id,
      ),
    ).toEqual(['music/two']);
  });
  it('orders a copy so browsing does not mutate the source collection', () => {
    expect(filterDiscoveryEntries(entries, { sort: 'rating' })[0].id).toBe(
      'music/two',
    );
    expect(filterDiscoveryEntries(entries, { sort: 'oldest' })[0].id).toBe(
      'game/one',
    );
    expect(entries[0].id).toBe('game/one');
  });
});

describe('individual cover selection', () => {
  const entry = {
    category: 'music',
    slug: 'example',
    link: 'https://www.youtube.com/watch?v=bWPOLL_Rr8U',
  };
  it('prefers real artwork, replaces shared stock placeholders, and supports exact YouTube hosts', () => {
    expect(
      getEntryCover({ ...entry, image: '/images/logs/music/real.png' }),
    ).toBe('/images/logs/music/real.png');
    expect(
      getEntryCover({ ...entry, image: '/images/defaults/stock.jpg' }),
    ).toBe('https://i.ytimg.com/vi/bWPOLL_Rr8U/hqdefault.jpg');
    expect(
      getEntryCover({ ...entry, link: 'https://youtu.be/bWPOLL_Rr8U?t=10' }),
    ).toContain('/bWPOLL_Rr8U/');
    expect(
      getEntryCover({
        ...entry,
        link: 'https://youtube.com.example.org/watch?v=bWPOLL_Rr8U',
      }),
    ).toBe('/images/discovery/covers/music/example.svg');
    expect(
      getEntryCover({
        ...entry,
        // Deliberate hostile URI verifies rejection rather than rendering.
        // eslint-disable-next-line no-script-url
        image: 'javascript:alert(1)',
        link: 'https://youtube.com/watch?v=bad',
      }),
    ).toBe('/images/discovery/covers/music/example.svg');
  });
  it('has a usable independent theme for a newly introduced category', () => {
    expect(getCategoryTheme('Newthing')).toMatchObject({
      label: 'Newthing',
      accent: '#C4CED6',
      motif: 'archive',
    });
    expect(getCategoryTheme('GAME').accent).toBe('#C5F0C9');
  });
});

describe('on-demand notes', () => {
  const entry = { category: 'quote', slug: 'example' };
  it('keeps inline entries useful when a .txt is missing or the dev host returns HTML', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response('', 404))
      .mockResolvedValueOnce(
        response('<!DOCTYPE html><html><body>app</body></html>'),
      )
      .mockResolvedValueOnce(response('# A real note\n\nThe original body.'));
    vi.stubGlobal('fetch', fetchMock);
    expect(entryPath(entry)).toBe('/discovery/quote/example');
    expect(await loadDiscoveryBody(entry)).toBe('');
    expect(await loadDiscoveryBody(entry)).toBe('');
    expect(await loadDiscoveryBody(entry)).toContain('The original body.');
    expect(fetchMock.mock.calls[0][0]).toBe('/logs/quote/example.txt');
  });
  it('surfaces a server failure so the reader can offer retry', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response('', 503)));
    await expect(loadDiscoveryBody(entry)).rejects.toThrow(
      'could not be loaded',
    );
  });
});
