/**
 * Resolves a track to a playable preview clip.
 *
 * The repo has no real track audio — the files under public/demystify/genre are
 * two-second synthesised blips — so previews come from the iTunes Search API,
 * which needs no key, sends `access-control-allow-origin: *`, and returns a
 * ~30 second excerpt per track. Nothing is downloaded until a reader presses
 * play, and each lookup is cached for the session.
 */

const ENDPOINT = 'https://itunes.apple.com/search';

/** Query cache keyed by the cleaned search term. A miss is cached too. */
const cache = new Map();

/**
 * Search terms have to be looser than our display strings: the catalogue does
 * not know "— 2017 Remaster" or "(In My Hands)", and multi-artist credits only
 * match on the lead name.
 */
const clean = (value) =>
  String(value || '')
    .replace(/\s*[—–]\s*.*$/, '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const leadArtist = (value) => clean(String(value || '').split(',')[0]);

export const previewQuery = (track) =>
  `${clean(track?.title)} ${leadArtist(track?.artist)}`.trim();

/**
 * @returns {Promise<{url: string, title: string, artist: string}|null>}
 *          null when the catalogue has no match — the caller falls back.
 */
export const findPreview = (track) => {
  const term = previewQuery(track);
  if (!term) return Promise.resolve(null);
  if (cache.has(term)) return cache.get(term);

  const request = fetch(
    `${ENDPOINT}?term=${encodeURIComponent(term)}&entity=song&limit=1`,
  )
    .then((res) => {
      if (!res.ok) throw new Error(`iTunes search responded ${res.status}`);
      return res.json();
    })
    .then((body) => {
      const hit = body?.results?.[0];
      if (!hit?.previewUrl) return null;
      return {
        url: hit.previewUrl,
        title: hit.trackName,
        artist: hit.artistName,
      };
    })
    .catch((err) => {
      // Network failures are worth retrying; a genuine miss is not.
      cache.delete(term);
      throw err;
    });

  cache.set(term, request);
  return request;
};

export const clearPreviewCache = () => cache.clear();
