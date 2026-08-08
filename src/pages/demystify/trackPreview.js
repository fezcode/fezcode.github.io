/**
 * Resolves a track to a playable preview clip.
 *
 * The repo has no real track audio — the files under public/demystify/genre are
 * two-second synthesised blips — so previews come from the iTunes Search API,
 * which needs no key, sends `access-control-allow-origin: *`, and returns a
 * ~30 second excerpt per track. Nothing is downloaded until a reader presses
 * play, and each lookup is cached for the session.
 *
 * Apple's catalogue does not cover everything, and its search always returns
 * *something*. Taking the first result on faith is how "Wyclef Jean" by Young
 * Thug ends up playing a Wyclef Jean record. Every result is therefore checked
 * against the track we asked for, and a mismatch is treated as no match.
 */

const SEARCH = 'https://itunes.apple.com/search';
const LOOKUP = 'https://itunes.apple.com/lookup';

/** Cache keyed by the resolved request. A confirmed miss is cached too. */
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

/** Every credited artist, for the looser match test. */
const allArtists = (value) =>
  String(value || '')
    .split(/,|&|\bfeat\.?\b|\bwith\b/i)
    .map((part) => clean(part).toLowerCase())
    .filter(Boolean);

/** Strip everything that varies between a display title and a catalogue title. */
const normalise = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/\([^)]*\)|\[[^\]]*\]/g, ' ')
    .replace(/\s*[—–-]\s*(remaster|remastered|original mix|extended|radio|single|live|instrumental|explicit).*$/i, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const previewQuery = (track) =>
  `${clean(track?.title)} ${leadArtist(track?.artist)}`.trim();

/**
 * Does this catalogue result plausibly *are* the track we asked for?
 * Title must contain-or-be-contained, and at least one credited artist has to
 * appear on either side — enough to reject unrelated songs without discarding
 * legitimate "(feat. …)" and remaster variations.
 */
export const isMatch = (track, result) => {
  const wanted = normalise(track?.title);
  const got = normalise(result?.trackName);
  if (!wanted || !got) return false;
  if (!got.includes(wanted) && !wanted.includes(got)) return false;

  const resultArtist = String(result?.artistName || '').toLowerCase();
  const ours = allArtists(track?.artist);
  if (!ours.length) return true;
  return ours.some(
    (name) => resultArtist.includes(name) || name.includes(resultArtist),
  );
};

const toPreview = (hit) =>
  hit?.previewUrl
    ? { url: hit.previewUrl, title: hit.trackName, artist: hit.artistName }
    : null;

const request = (url, pick) =>
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`iTunes responded ${res.status}`);
      return res.json();
    })
    .then((body) => pick(body?.results || []));

/**
 * `track.preview` overrides the lookup:
 *   'none'   — this track is not in the catalogue; do not search
 *   a number — an iTunes track id, fetched directly and trusted
 *   any text — a replacement search term
 *
 * @returns {Promise<{url,title,artist}|null>} null when nothing confidently matched
 */
export const findPreview = (track) => {
  const override = String(track?.preview || '').trim();
  if (override.toLowerCase() === 'none') return Promise.resolve(null);

  const byId = /^\d+$/.test(override);
  const term = override && !byId ? override : previewQuery(track);
  if (!byId && !term) return Promise.resolve(null);

  const key = byId ? `id:${override}` : `q:${term}`;
  if (cache.has(key)) return cache.get(key);

  const pending = (
    byId
      ? request(`${LOOKUP}?id=${encodeURIComponent(override)}`, (r) =>
          toPreview(r[0]),
        )
      : request(
          `${SEARCH}?term=${encodeURIComponent(term)}&entity=song&limit=5`,
          // Take the first result that actually is the track, not merely the
          // first result.
          (results) => toPreview(results.find((hit) => isMatch(track, hit))),
        )
  ).catch((err) => {
    // Network failures are worth retrying; a confirmed miss is not.
    cache.delete(key);
    throw err;
  });

  cache.set(key, pending);
  return pending;
};

export const clearPreviewCache = () => cache.clear();
