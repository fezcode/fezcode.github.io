// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, readFile, stat, rm, readdir } from 'node:fs/promises';
import { join, resolve, dirname, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { getWordupOgTargets, publishWordupOg } from './wordup-og.mjs';

const folders = [];
afterEach(async () => {
  for (const folder of folders.splice(0)) {
    if (
      dirname(resolve(folder)) !== resolve(tmpdir()) ||
      !basename(folder).startsWith('wordup-og-')
    )
      throw new Error('Unexpected test cleanup target');
    await rm(folder, { recursive: true, force: true });
  }
});
const makeFile = async () => {
  const folder = await mkdtemp(join(tmpdir(), 'wordup-og-'));
  folders.push(folder);
  return join(folder, 'card.webp');
};

describe('Wordup OG preservation', () => {
  it('preserves existing bytes and modification time until explicitly forced', async () => {
    const file = await makeFile();
    expect(await publishWordupOg(file, Buffer.from('original'))).toBe(true);
    const before = await stat(file);
    expect(await publishWordupOg(file, Buffer.from('new'))).toBe(false);
    expect(await readFile(file, 'utf8')).toBe('original');
    expect((await stat(file)).mtimeMs).toBe(before.mtimeMs);
    expect(
      await publishWordupOg(file, Buffer.from('requested'), { force: true }),
    ).toBe(true);
    expect(await readFile(file, 'utf8')).toBe('requested');
  });

  it('does not overwrite a concurrent writer and leaves no temporary files', async () => {
    const file = await makeFile();
    const results = await Promise.all([
      publishWordupOg(file, Buffer.from('first')),
      publishWordupOg(file, Buffer.from('second')),
    ]);
    expect(results.sort()).toEqual([false, true]);
    expect(['first', 'second']).toContain(await readFile(file, 'utf8'));
    expect(await readdir(folders[0])).toEqual(['card.webp']);
  });

  it('respects authored images and limits forced regeneration to selected registered paths', () => {
    const words = [
      { word: 'cancıl', slug: 'cancil' },
      { word: 'özel', slug: 'ozel', ogImage: '/custom.webp' },
    ];
    expect(getWordupOgTargets(words).map((target) => target.route)).toEqual([
      '/wordup',
      '/wordup/cancil',
    ]);
    expect(
      getWordupOgTargets(words, { slug: 'cancil' }).map(
        (target) => target.route,
      ),
    ).toEqual(['/wordup/cancil']);
    expect(
      getWordupOgTargets(words, { indexOnly: true }).map(
        (target) => target.route,
      ),
    ).toEqual(['/wordup']);
    expect(() => getWordupOgTargets(words, { slug: '../escape' })).toThrow(
      'Unknown Wordup slug',
    );
  });
});
