// @vitest-environment node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import piml from 'piml';
import { buildRouteMetaMap, PUBLIC } from './route-meta.mjs';

vi.mock('node:fs', async (importOriginal) => {
  const fs = await importOriginal();
  return { ...fs, readFileSync: vi.fn(fs.readFileSync) };
});

describe('Wordup share metadata', () => {
  it('assigns the collection image and generated cards to words without authored artwork', () => {
    const metadata = buildRouteMetaMap();
    expect(metadata.get('/wordup')).toMatchObject({
      image: '/images/og/wordup.webp',
      type: 'website',
    });

    const { words } = piml.parse(
      readFileSync(join(PUBLIC, 'wordup', 'words.piml'), 'utf8'),
    );
    expect(words.length).toBeGreaterThan(0);
    for (const word of words.filter(
      (entry) => !entry.ogImage && !entry.image,
    )) {
      expect(metadata.get(`/wordup/${word.slug}`)).toMatchObject({
        title: `${word.word} — Wordup | Fezcodex`,
        image: `/images/og/wordup/${word.slug}.webp`,
        type: 'article',
      });
    }
  });

  it('does not invent image metadata for unregistered word routes', () => {
    expect(buildRouteMetaMap().has('/wordup/not-invented')).toBe(false);
  });

  it('preserves authored ogImage and image values before generated word cards', () => {
    const read = vi.mocked(readFileSync);
    const originalRead = read.getMockImplementation();
    read.mockImplementation((path, ...options) =>
      path === join(PUBLIC, 'wordup', 'words.piml')
        ? `(words)
  > (word)
    (slug) with-share-art
    (word) with share art
    (ogImage) /images/custom/share.webp
    (image) /images/custom/cover.webp
  > (word)
    (slug) with-cover-art
    (word) with cover art
    (image) /images/custom/cover.webp
`
        : originalRead(path, ...options),
    );

    try {
      const metadata = buildRouteMetaMap();
      expect(metadata.get('/wordup/with-share-art').image).toBe(
        '/images/custom/share.webp',
      );
      expect(metadata.get('/wordup/with-cover-art').image).toBe(
        '/images/custom/cover.webp',
      );
    } finally {
      read.mockImplementation(originalRead);
    }
  });
});
