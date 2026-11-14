import { stat, mkdir, writeFile, link, rename, unlink } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function getWordupOgTargets(words, { slug, indexOnly = false } = {}) {
  if (slug && indexOnly)
    throw new Error('Choose either --slug or --index-only.');
  const entries = words.filter((word) => word?.word && SLUG.test(word.slug));
  if (
    slug &&
    (!SLUG.test(slug) || !entries.some((word) => word.slug === slug))
  ) {
    throw new Error(`Unknown Wordup slug: ${slug}`);
  }
  const targets = slug
    ? []
    : [{ route: '/wordup', file: 'images/og/wordup.webp' }];
  if (!indexOnly) {
    for (const word of entries) {
      if (slug && word.slug !== slug) continue;
      // An authored image is an explicit override, including remote images.
      if (word.ogImage || word.image) continue;
      targets.push({
        route: '/wordup/' + word.slug,
        slug: word.slug,
        file: 'images/og/wordup/' + word.slug + '.webp',
      });
    }
  }
  return targets;
}

export async function existingOgFile(file) {
  try {
    const info = await stat(file);
    if (!info.isFile())
      throw new Error(`OG destination is not a file: ${file}`);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

// Publish complete images atomically. A concurrent default run cannot replace
// someone else's existing art; only the explicitly forced path may overwrite.
export async function publishWordupOg(file, bytes, { force = false } = {}) {
  await mkdir(dirname(file), { recursive: true });
  const temporary = join(dirname(file), `.wordup-og-${randomUUID()}.tmp`);
  try {
    await writeFile(temporary, bytes, { flag: 'wx' });
    if (force) await rename(temporary, file);
    else await link(temporary, file);
    return true;
  } catch (error) {
    if (!force && error.code === 'EEXIST') return false;
    throw error;
  } finally {
    await unlink(temporary).catch((error) => {
      if (error.code !== 'ENOENT') throw error;
    });
  }
}
