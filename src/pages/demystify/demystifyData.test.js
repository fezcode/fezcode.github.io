import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  clearDemystifyCache,
  fetchText,
  isLive,
  items,
  loadEntries,
  paragraphs,
  parseBlocks,
  raw,
  text,
  toCollection,
  toEntry,
  tracks,
} from './demystifyData';

describe('parseBlocks', () => {
  it('splits on === and reads key: value pairs', () => {
    const blocks = parseBlocks(
      '===\nid: grunge\nname: GRUNGE\n===\nid: britpop\nname: BRITPOP\n',
    );
    expect(blocks).toHaveLength(2);
    expect(text(blocks[0], 'name')).toBe('GRUNGE');
    expect(text(blocks[1], 'id')).toBe('britpop');
  });

  it('keeps a value written on the same line as its key', () => {
    // The previous parser treated `breakdown:` as a mode switch and threw the
    // inline text away, silently blanking every entry written this way.
    const [fields] = parseBlocks('===\nbreakdown: Born in Seattle.\n');
    expect(text(fields, 'breakdown')).toBe('Born in Seattle.');
  });

  it('appends continuation lines to the key above them', () => {
    const [fields] = parseBlocks(
      '===\nbreakdown:\nBorn in Seattle.\nLoud, then quiet.\n',
    );
    expect(text(fields, 'breakdown')).toBe('Born in Seattle. Loud, then quiet.');
  });

  it('merges an inline value with the lines that follow it', () => {
    const [fields] = parseBlocks('===\nbreakdown: First.\nSecond.\n');
    expect(text(fields, 'breakdown')).toBe('First. Second.');
  });

  it('preserves ASCII art verbatim', () => {
    const art = ['+-------+', '| /\\/\\  |', '+-------+'].join('\n');
    const [fields] = parseBlocks(`===\nascii:\n${art}\n\nexamples:\n- A | B\n`);
    expect(raw(fields, 'ascii')).toBe(art);
  });

  it('only opens a key at column zero, so indented art survives', () => {
    const [fields] = parseBlocks('===\nascii:\n  note: not a key\n');
    expect(raw(fields, 'ascii')).toBe('  note: not a key');
    expect(fields.note).toBeUndefined();
  });

  it('reads "- title | note" lists', () => {
    const [fields] = parseBlocks(
      '===\nexamples:\n- Nevermind (1991) | Butch Vig production\n- Bleach\n',
    );
    expect(items(fields, 'examples')).toEqual([
      { title: 'Nevermind (1991)', note: 'Butch Vig production' },
      { title: 'Bleach', note: '' },
    ]);
  });

  it('returns nothing for empty input', () => {
    expect(parseBlocks('')).toEqual([]);
    expect(parseBlocks('===\n===\n')).toEqual([]);
  });
});

describe('atlas fields', () => {
  it('keeps prose paragraphs separate instead of running them together', () => {
    const [fields] = parseBlocks(
      '===\nwhat:\n First paragraph.\n Second paragraph.\n',
    );
    expect(paragraphs(fields, 'what')).toEqual([
      'First paragraph.',
      'Second paragraph.',
    ]);
    // text() still collapses the same field when a single line is wanted.
    expect(text(fields, 'what')).toBe('First paragraph. Second paragraph.');
  });

  it('does not treat an indented sentence starting "Word:" as a new key', () => {
    // Prose is written indented precisely so this cannot happen.
    const [fields] = parseBlocks('===\nwhat:\n Note: this is still prose.\n');
    expect(paragraphs(fields, 'what')).toEqual(['Note: this is still prose.']);
    expect(fields.Note).toBeUndefined();
  });

  it('reads three-field track lines', () => {
    const [fields] = parseBlocks(
      '===\ntracks:\n - P1·01 | Snake Eyes | Feint, CoMa\n - P2·30 | Saltwater | Chicane\n',
    );
    expect(tracks(fields, 'tracks')).toEqual([
      { pos: 'P1·01', title: 'Snake Eyes', artist: 'Feint, CoMa' },
      { pos: 'P2·30', title: 'Saltwater', artist: 'Chicane' },
    ]);
  });

  it('parses the 20-band spectrum, defaulting to empty', () => {
    const [withSpec] = parseBlocks('===\nid: x\nspec: 95,88,60,35\n');
    expect(toEntry(withSpec).spec).toEqual([95, 88, 60, 35]);
    expect(toEntry(parseBlocks('===\nid: x\n')[0]).spec).toEqual([]);
  });

  it('maps family, source and sub onto the entry', () => {
    const [fields] = parseBlocks(
      '===\nid: trip-hop\nfamily: Electronic\nsource: ON REPEAT\nsub: Bristol slow-motion hip hop\n',
    );
    expect(toEntry(fields)).toMatchObject({
      family: 'Electronic',
      source: 'ON REPEAT',
      sub: 'Bristol slow-motion hip hop',
    });
  });
});

describe('shapes', () => {
  it('maps a collection block and defaults status to PENDING', () => {
    const [fields] = parseBlocks('===\nid: movie\nname: MOVIE\n');
    const collection = toCollection(fields);
    expect(collection).toMatchObject({ id: 'movie', status: 'PENDING' });
    expect(isLive(collection)).toBe(false);
  });

  it('treats a collection as live only when it has a route', () => {
    expect(isLive({ status: 'LIVE', route: '/demystify/genre' })).toBe(true);
    expect(isLive({ status: 'LIVE', route: '' })).toBe(false);
  });

  it('maps an entry block, including numeric fallbacks', () => {
    const [fields] = parseBlocks(
      '===\nid: grunge\nname: GRUNGE\nfreqs: 110, 164.81\nsynthType: square\n',
    );
    const entry = toEntry(fields);
    expect(entry.freqs).toEqual([110, 164.81]);
    expect(entry.synthType).toBe('square');
    expect(toEntry(parseBlocks('===\nid: x\n')[0]).freqs).toEqual([
      220, 330, 440,
    ]);
  });
});

describe('fetchText caching', () => {
  beforeEach(() => {
    clearDemystifyCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearDemystifyCache();
  });

  it('issues one request no matter how many callers ask', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, text: () => Promise.resolve('===\nid: a\n') }),
    );

    const [first, second] = await Promise.all([
      fetchText('/demystify/index.txt'),
      fetchText('/demystify/index.txt'),
    ]);

    expect(first).toBe(second);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('does not cache failures, so a later mount can retry', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 404 }));
    await expect(fetchText('/missing.txt')).rejects.toThrow('404');

    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, text: () => Promise.resolve('===\nid: a\n') }),
    );
    await expect(fetchText('/missing.txt')).resolves.toContain('id: a');
  });

  it('loads entries from the collection index path', async () => {
    global.fetch = vi.fn((url) => {
      expect(url).toBe('/demystify/genre/index.txt');
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve('===\nid: grunge\nname: GRUNGE\n'),
      });
    });

    await expect(loadEntries('genre')).resolves.toEqual([
      expect.objectContaining({ id: 'grunge', name: 'GRUNGE' }),
    ]);
  });
});
