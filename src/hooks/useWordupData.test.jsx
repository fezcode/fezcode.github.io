import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const index = `(words)
  > (word)
    (slug) yarinsama
    (word) yarınsama
    (language) tr
    (definition) Missing a moment before it happens.
  > (word)
    (slug) tablimbo
    (word) tablimbo
    (language) en
    (definition) An open possibility.
`;

let api;

beforeEach(async () => {
  vi.resetModules();
  api = await import('./useWordupData');
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Wordup content', () => {
  it('finds pöskürmek by its unaccented spelling and Turkish meaning', () => {
    const word = {
      word: 'pöskürmek',
      language: 'tr',
      translation: 'Zihinsel tükenme ve ruhsal çöküntü.',
    };
    expect(api.filterWordupWords([word], { query: 'POSKURMEK' })).toEqual([
      word,
    ]);
    expect(api.filterWordupWords([word], { query: 'ruhsal cokuntu' })).toEqual([
      word,
    ]);
  });

  it('finds Turkish words and roots from an ASCII keyboard', () => {
    expect(api.normalizeWordupSearch('YARINSAMA')).toBe('yarinsama');
    expect(api.normalizeWordupSearch('İÇ SES')).toBe('ic ses');
    const words = [
      { word: 'yarınsama', language: 'tr', roots: 'yarın + anımsama' },
      { word: 'tablimbo', language: 'en', roots: 'tab + limbo' },
    ];
    expect(api.filterWordupWords(words, { query: 'YARINSAMA' })).toEqual([
      words[0],
    ]);
    expect(
      api.filterWordupWords(words, { query: 'animsama', language: 'tr' }),
    ).toEqual([words[0]]);
    expect(api.filterWordupWords(words, { language: 'en' })).toEqual([
      words[1],
    ]);
  });

  it('shares an index request between the collection and an entry', async () => {
    const fetchMock = vi.fn(async (path) => ({
      ok: true,
      text: async () =>
        path.endsWith('.piml') ? index : '## Tomorrow\n\nBody.',
    }));
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => ({
      collection: api.useWordupData(),
      entry: api.useWordupEntry('yarinsama'),
    }));

    await waitFor(() => expect(result.current.entry.loading).toBe(false));
    expect(result.current.collection.words).toHaveLength(2);
    expect(result.current.entry.word.word).toBe('yarınsama');
    expect(result.current.entry.content).toContain('## Tomorrow');
    expect(fetchMock.mock.calls.map(([path]) => path)).toEqual([
      '/wordup/words.piml',
      '/wordup/yarinsama.txt',
    ]);
  });

  it('resolves unknown slugs without requesting arbitrary text paths', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      text: async () => index,
    }));
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => api.useWordupEntry('../other-file'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.notFound).toBe(true);
    expect(result.current.error).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('reports a missing registered body as a load error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (path) =>
        path.endsWith('.piml')
          ? { ok: true, text: async () => index }
          : { ok: false, status: 404 },
      ),
    );

    const { result } = renderHook(() => api.useWordupEntry('tablimbo'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error.message).toContain('404');
    expect(result.current.notFound).toBe(false);
  });
});
