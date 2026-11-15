import { describe, expect, it } from 'vitest';
import { normalizeTag } from './tagSlug.mjs';
import { parseTagIndex } from './tagIndex';

describe('normalizeTag', () => {
  it('folds case, spacing and punctuation into one kebab-case slug', () => {
    expect(normalizeTag('Turkish Cuisine')).toBe('turkish-cuisine');
    expect(normalizeTag(' UI/UX ')).toBe('ui-ux');
    expect(normalizeTag('Çay Ağacı')).toBe('cay-agaci');
  });

  it('keeps language names distinct instead of collapsing them to "c"', () => {
    expect(normalizeTag('C#')).toBe('csharp');
    expect(normalizeTag('C++')).toBe('cpp');
    expect(normalizeTag('.NET 10')).toBe('dotnet-10');
  });
});

describe('parseTagIndex', () => {
  const source = `(tags)
  > (item)
    (slug) go
    (label) Go
    (count) 2
    (posts) 1
    (projects) 1
  > (item)
    (slug) cli
    (label) Cli
    (count) 1
    (projects) 1
(aliases)
  > (item)
    (alias) golang
    (tag) go
(items)
  > (item)
    (id) post/a
    (type) post
    (title) A post
    (path) /blog/a
    (tags)
      > go
  > (item)
    (id) project/b
    (type) project
    (title) B
    (path) /projects/b
    (tags)
      > go
      > cli
`;

  it('indexes items by tag and resolves aliases and spellings', () => {
    const index = parseTagIndex(source);
    expect(index.itemsByTag.get('go').map((i) => i.id)).toEqual([
      'post/a',
      'project/b',
    ]);
    expect(index.bySlug.get('go').logs).toBe(0);
    expect(index.resolve('golang')).toBe('go');
    expect(index.resolve('GO')).toBe('go');
    expect(index.resolve('rust')).toBe('');
  });

  it('treats a single-tag list as a list', () => {
    const index = parseTagIndex(source);
    expect(index.items[0].tags).toEqual(['go']);
  });
});
