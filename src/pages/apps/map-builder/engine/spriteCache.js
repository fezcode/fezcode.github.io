// Sprite bitmap cache. Each catalog entry's draw() is rendered once into a padded
// offscreen canvas keyed by (id, theme, size-bucket, tint); placement is then a
// cheap drawImage, so thousands of placed sprites stay fast. LRU-bounded.

import { makeRng } from '../sprites/draw';

const cache = new Map(); // key -> canvas (with _bucket / _pad)
const LIMIT = 1600;

function evict() {
  while (cache.size > LIMIT) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
}

function touch(key, cv) {
  // refresh LRU position
  cache.delete(key);
  cache.set(key, cv);
}

function bucket(px) {
  return Math.max(16, Math.min(512, Math.round(px / 8) * 8));
}

// Returns an offscreen canvas whose sprite content spans `_bucket` px, centred,
// with `_pad` px of transparent margin on every side for shadows/outlines.
export function getSpriteBitmap(entry, theme, screenPx, tint) {
  if (!entry || typeof entry.draw !== 'function') return null;
  const b = bucket(screenPx);
  const key = `${entry.id}|${theme.id}|${b}|${tint || ''}`;
  const existing = cache.get(key);
  if (existing) {
    touch(key, existing);
    return existing;
  }

  const pad = Math.ceil(b * 0.18) + 4;
  const dim = b + pad * 2;
  const cv = document.createElement('canvas');
  cv.width = dim;
  cv.height = dim;
  const ctx = cv.getContext('2d');
  ctx.save();
  ctx.translate(dim / 2, dim / 2);
  const scale = b / (entry.size || 64);
  ctx.scale(scale, scale);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const rng = makeRng((entry.seed >>> 0) || 1);
  try {
    entry.draw(ctx, { size: entry.size || 64, rng, theme, tint: tint || undefined });
  } catch (err) {
    if (typeof console !== 'undefined') console.warn('[map-builder] sprite failed:', entry.id, err);
  }
  ctx.restore();

  cv._bucket = b;
  cv._pad = pad;
  cache.set(key, cv);
  evict();
  return cv;
}

export function clearSpriteCache() {
  cache.clear();
}

export function spriteCacheSize() {
  return cache.size;
}
