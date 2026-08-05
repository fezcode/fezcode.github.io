/**
 * Data layer for /demystify.
 *
 * Every demystify file — the collection registry, a collection's entry index,
 * and an individual entry — uses one format, so one parser reads all of them:
 *
 *   ===
 *   key: inline value
 *   multiline:
 *   further lines belong to the previous key
 *   list:
 *   - item | trailing note
 *   ===
 *
 * A key only opens when a line starts at column zero with `identifier:`, which
 * is why ASCII-art blocks (whose lines start with `+`, `|`, `/` or a space)
 * survive intact.
 */

const KEY_LINE = /^([a-zA-Z][a-zA-Z0-9_]*):(.*)$/;
const BLOCK_SEPARATOR = /^===\s*$/m;

/**
 * Splits a demystify file into blocks of `{ key: [rawLine, ...] }`.
 * Values stay as line arrays so callers can decide whether whitespace matters.
 */
export const parseBlocks = (text) => {
  if (!text) return [];

  return text
    .split(BLOCK_SEPARATOR)
    .map((block) => {
      const fields = {};
      let currentKey = null;

      for (const line of block.split(/\r?\n/)) {
        const match = KEY_LINE.exec(line);
        if (match) {
          const [, key, inlineValue] = match;
          currentKey = key;
          fields[key] = fields[key] || [];
          if (inlineValue.trim()) fields[key].push(inlineValue.trim());
          continue;
        }
        if (currentKey) fields[currentKey].push(line);
      }

      return fields;
    })
    .filter((fields) => Object.keys(fields).length > 0);
};

/** Collapses a field to a single trimmed line — for names, tags, prose. */
export const text = (fields, key, fallback = '') => {
  const lines = fields[key];
  if (!lines) return fallback;
  const joined = lines
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ');
  return joined || fallback;
};

/** Preserves a field verbatim, minus surrounding blank lines — for ASCII art. */
export const raw = (fields, key, fallback = '') => {
  const lines = fields[key];
  if (!lines) return fallback;
  const trimmed = [...lines];
  while (trimmed.length && !trimmed[0].trim()) trimmed.shift();
  while (trimmed.length && !trimmed[trimmed.length - 1].trim()) trimmed.pop();
  return trimmed.length ? trimmed.join('\n') : fallback;
};

/** Reads `- title | note` lines out of a field. */
export const items = (fields, key) => {
  const lines = fields[key];
  if (!lines) return [];
  return lines
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-'))
    .map((line) => {
      const content = line.slice(1).trim();
      const pipeIdx = content.indexOf('|');
      if (pipeIdx === -1) return { title: content, note: '' };
      return {
        title: content.slice(0, pipeIdx).trim(),
        note: content.slice(pipeIdx + 1).trim(),
      };
    })
    .filter((entry) => entry.title);
};

export const numbers = (fields, key, fallback) => {
  const parsed = text(fields, key)
    .split(',')
    .map((value) => Number.parseFloat(value.trim()))
    .filter((value) => Number.isFinite(value));
  return parsed.length ? parsed : fallback;
};

/* -------------------------------------------------------------------------- */
/* Shapes                                                                      */
/* -------------------------------------------------------------------------- */

export const toCollection = (fields) => ({
  id: text(fields, 'id'),
  rank: text(fields, 'rank'),
  name: text(fields, 'name'),
  tag: text(fields, 'tag'),
  count: text(fields, 'count'),
  status: text(fields, 'status', 'PENDING').toUpperCase(),
  route: text(fields, 'route'),
  blurb: text(fields, 'blurb'),
});

export const toEntry = (fields) => ({
  id: text(fields, 'id'),
  rank: text(fields, 'rank'),
  name: text(fields, 'name'),
  years: text(fields, 'years'),
  tag: text(fields, 'tag'),
  origin: text(fields, 'origin'),
  signature: text(fields, 'signature'),
  keyGear: text(fields, 'keyGear'),
  audio: text(fields, 'audio'),
  synthType: text(fields, 'synthType', 'sawtooth'),
  freqs: numbers(fields, 'freqs', [220, 330, 440]),
  breakdown: text(fields, 'breakdown'),
  ascii: raw(fields, 'ascii'),
  examples: items(fields, 'examples'),
});

export const isLive = (collection) =>
  collection.status === 'LIVE' && Boolean(collection.route);

/* -------------------------------------------------------------------------- */
/* Fetching                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Demystify content is static text that never changes within a session, so
 * responses are memoised per path. In-flight promises are cached too, which
 * collapses the duplicate index request the hub and a collection would
 * otherwise both fire.
 *
 * Requests are deliberately not abortable: the promise is shared between every
 * caller, so one component unmounting must not cancel a fetch another is still
 * waiting on. Consumers discard late results instead (see useDemystifyResource).
 */
const cache = new Map();

export const fetchText = (path) => {
  const cached = cache.get(path);
  if (cached) return cached;

  const request = fetch(path)
    .then((res) => {
      if (!res.ok) throw new Error(`${path} responded ${res.status}`);
      return res.text();
    })
    .catch((err) => {
      // Never cache a failure: a retry on the next mount should hit the network.
      cache.delete(path);
      throw err;
    });

  cache.set(path, request);
  return request;
};

export const clearDemystifyCache = () => cache.clear();

export const COLLECTIONS_INDEX = '/demystify/index.txt';

export const collectionIndexPath = (collectionId) =>
  `/demystify/${collectionId}/index.txt`;

export const entryPath = (collectionId, entryId) =>
  `/demystify/${collectionId}/${entryId}.txt`;

export const loadCollections = async () => {
  const body = await fetchText(COLLECTIONS_INDEX);
  return parseBlocks(body).map(toCollection).filter((entry) => entry.id);
};

export const loadEntries = async (collectionId) => {
  const body = await fetchText(collectionIndexPath(collectionId));
  return parseBlocks(body).map(toEntry).filter((entry) => entry.id);
};

export const loadEntry = async (collectionId, entryId) => {
  const body = await fetchText(entryPath(collectionId, entryId));
  const [fields] = parseBlocks(body);
  if (!fields) throw new Error(`${entryId} is empty`);
  return toEntry(fields);
};
