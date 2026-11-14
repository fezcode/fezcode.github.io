import piml from 'piml';
import { fetchLogCategories } from '../../utils/logCategories';

// These are the collection's own art directions, independent of the site theme.
const THEMES = {
  game: {
    label: 'Game',
    accent: '#C5F0C9',
    ink: '#182D28',
    paper: '#E8F5E8',
    motif: 'cartridge',
  },
  movie: {
    label: 'Movie',
    accent: '#F0BE76',
    ink: '#33261E',
    paper: '#F7EBD9',
    motif: 'film',
  },
  music: {
    label: 'Music',
    accent: '#C6B9EC',
    ink: '#27243A',
    paper: '#EFEAF8',
    motif: 'record',
  },
  book: {
    label: 'Book',
    accent: '#E5D8B8',
    ink: '#34392F',
    paper: '#F3EDDD',
    motif: 'folio',
  },
  series: {
    label: 'Series',
    accent: '#86CCD5',
    ink: '#173039',
    paper: '#E2F3F5',
    motif: 'screen',
  },
  article: {
    label: 'Article',
    accent: '#B9D2ED',
    ink: '#25374B',
    paper: '#ECF2FA',
    motif: 'print',
  },
  food: {
    label: 'Food',
    accent: '#F0AF89',
    ink: '#5A3025',
    paper: '#F9E8DC',
    motif: 'table',
  },
  video: {
    label: 'Video',
    accent: '#ED9F98',
    ink: '#47252A',
    paper: '#F9E7E4',
    motif: 'frame',
  },
  quote: {
    label: 'Quote',
    accent: '#DFC0C5',
    ink: '#3D2732',
    paper: '#F7ECED',
    motif: 'type',
  },
  tools: {
    label: 'Tools',
    accent: '#AFC9D7',
    ink: '#243847',
    paper: '#EAF1F5',
    motif: 'blueprint',
  },
  websites: {
    label: 'Websites',
    accent: '#D3D98E',
    ink: '#333D24',
    paper: '#F0F3DD',
    motif: 'browser',
  },
  event: {
    label: 'Event',
    accent: '#E4CB80',
    ink: '#4A3924',
    paper: '#F7EFD9',
    motif: 'ticket',
  },
};
const FALLBACK_THEME = {
  label: 'Discovery',
  accent: '#C4CED6',
  ink: '#27333D',
  paper: '#EDF2F5',
  motif: 'archive',
};

const text = (value) => (typeof value === 'string' ? value.trim() : '');
const categoryKey = (category) => text(category).toLowerCase();
const safeSegment = (value) => /^[-_a-zA-Z0-9]+$/.test(value);
const titleCase = (value) => value.charAt(0).toUpperCase() + value.slice(1);
const timestamp = (entry) => Date.parse(entry.date) || 0;

function throwIfAborted(signal) {
  if (signal?.aborted) {
    const error = new Error('Discovery loading was cancelled.');
    error.name = 'AbortError';
    throw error;
  }
}

function safeUrl(value, allowLocal = false) {
  const candidate = text(value);
  if (allowLocal && candidate.startsWith('/') && !candidate.startsWith('//')) {
    return candidate;
  }
  try {
    const url = new URL(candidate);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

export function getCategoryTheme(category) {
  const key = categoryKey(category);
  return Object.prototype.hasOwnProperty.call(THEMES, key)
    ? THEMES[key]
    : { ...FALLBACK_THEME, label: key ? titleCase(key) : FALLBACK_THEME.label };
}

function fallbackCover(entry) {
  const category = categoryKey(entry.category);
  return `/images/discovery/covers/${encodeURIComponent(category)}/${encodeURIComponent(entry.slug)}.svg`;
}

function youtubeCover(link) {
  try {
    const url = new URL(link);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    const host = url.hostname.toLowerCase();
    let id = '';
    if (host === 'youtu.be' || host === 'www.youtu.be') {
      id = url.pathname.split('/')[1];
    } else if (
      [
        'youtube.com',
        'www.youtube.com',
        'm.youtube.com',
        'music.youtube.com',
        'youtube-nocookie.com',
        'www.youtube-nocookie.com',
      ].includes(host)
    ) {
      id =
        url.pathname === '/watch'
          ? url.searchParams.get('v')
          : url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id || '')
      ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
      : '';
  } catch {
    return '';
  }
}

const actualImageUrl = (value) => {
  const url = safeUrl(value, true);
  return url && !url.startsWith('/images/defaults/') ? url : '';
};

export function getEntryCover(entry, artwork = {}) {
  const authored = [
    entry.coverArt,
    entry.cover_art,
    entry.cover,
    entry.image,
    entry.poster,
  ]
    .map(actualImageUrl)
    .filter(Boolean);
  // Explicit item artwork wins. YouTube stills are retained as a fallback,
  // but an actual downloaded album/poster should replace an old video still.
  const authoredArtwork = authored.find(
    (url) => !/^https?:\/\/(?:i\.ytimg\.com|img\.youtube\.com)\//i.test(url),
  );
  if (authoredArtwork) return authoredArtwork;
  const manifest = artwork[`${categoryKey(entry.category)}/${entry.slug}`];
  const manifestCover = actualImageUrl(
    typeof manifest === 'string'
      ? manifest
      : manifest?.cover || manifest?.image,
  );
  return (
    manifestCover ||
    actualImageUrl(entry.spineImage || entry.spine_image) ||
    authored[0] ||
    youtubeCover(entry.link) ||
    fallbackCover(entry)
  );
}

export function entryPath(entry) {
  return `/discovery/${encodeURIComponent(categoryKey(entry.category))}/${encodeURIComponent(entry.slug)}`;
}

function normalizeEntry(raw, category, artwork) {
  const slug = text(raw?.slug);
  const title = text(raw?.title);
  if (!title || !safeSegment(slug)) return null;
  const rating =
    raw.rating === null || raw.rating === undefined || raw.rating === ''
      ? null
      : Number(raw.rating);
  const tags = Array.isArray(raw.tags)
    ? raw.tags.map(text).filter(Boolean)
    : text(raw.tags)
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
  const entry = {
    ...raw,
    id: `${category}/${slug}`,
    category,
    categoryLabel: getCategoryTheme(category).label,
    slug,
    title,
    date: text(raw.date),
    description: text(raw.description),
    rating: Number.isFinite(rating) ? Math.max(0, Math.min(5, rating)) : null,
    tags,
    credit:
      text(raw.artist) ||
      text(raw.author) ||
      text(raw.director) ||
      text(raw.creator) ||
      text(raw.source),
    link: safeUrl(raw.link),
    spineImage: actualImageUrl(raw.spineImage || raw.spine_image),
    imagePosition: text(raw.imagePosition || raw.image_position) || 'center',
  };
  entry.fallbackCover = fallbackCover(entry);
  entry.cover = getEntryCover(entry, artwork);
  return entry;
}

async function fetchArtworkManifest(path, signal) {
  try {
    const response = await fetch(path, { signal });
    if (!response.ok) return {};
    const manifest = await response.json();
    return manifest && typeof manifest === 'object' && !Array.isArray(manifest)
      ? manifest
      : {};
  } catch {
    // Artwork is an optional enhancement. A missing manifest must never hide
    // the real logs, including on older static deployments and offline caches.
    return {};
  }
}

/** Fetch the small category indexes only. Full notes load when an item opens. */
export async function fetchDiscoveryEntries({ signal } = {}) {
  throwIfAborted(signal);
  const [categoryNames, gameArt, mediaArt] = await Promise.all([
    fetchLogCategories(),
    fetchArtworkManifest('/images/discovery/game-art.json', signal),
    fetchArtworkManifest('/images/discovery/media-art.json', signal),
  ]);
  const categories = [...new Set(categoryNames.map(categoryKey))].filter(
    safeSegment,
  );
  const artwork = {
    ...Object.fromEntries(
      Object.entries(gameArt)
        .filter(([slug]) => safeSegment(slug))
        .map(([slug, cover]) => [`game/${slug}`, cover]),
    ),
    ...mediaArt,
  };
  throwIfAborted(signal);
  const results = await Promise.allSettled(
    categories.map(async (category) => {
      const response = await fetch(`/logs/${category}/${category}.piml`, {
        signal,
      });
      if (!response.ok)
        throw new Error(`Could not load ${category} discoveries.`);
      const source = await response.text();
      if (/^\s*(?:<!doctype\s+html|<html\b)/i.test(source)) {
        throw new Error(`No index exists for ${category}.`);
      }
      const parsed = piml.parse(source);
      const items = parsed.logs || parsed.items;
      if (!Array.isArray(items))
        throw new Error(`Invalid ${category} discovery index.`);
      return items
        .map((entry) => normalizeEntry(entry, category, artwork))
        .filter(Boolean);
    }),
  );
  throwIfAborted(signal);
  const failedCategories = categories.filter(
    (_, index) => results[index].status === 'rejected',
  );
  const unique = new Map();
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      result.value.forEach((entry) => {
        if (!unique.has(entry.id)) unique.set(entry.id, entry);
      });
    }
  });
  const entries = filterDiscoveryEntries([...unique.values()]);
  return { entries, categories, failedCategories };
}

export function filterDiscoveryEntries(
  entries,
  { category = 'all', query = '', sort = 'newest' } = {},
) {
  const selectedCategory = categoryKey(category);
  const words = text(query).toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const filtered = entries.filter((entry) => {
    if (
      selectedCategory &&
      selectedCategory !== 'all' &&
      entry.category !== selectedCategory
    )
      return false;
    const haystack = [
      entry.title,
      entry.description,
      entry.credit,
      entry.categoryLabel,
      entry.platform,
      entry.album,
      ...(entry.tags || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase();
    return words.every((word) => haystack.includes(word));
  });
  return filtered.sort((a, b) => {
    const tie = a.id.localeCompare(b.id);
    if (sort === 'oldest') return timestamp(a) - timestamp(b) || tie;
    if (sort === 'title' || sort === 'alphabetical')
      return a.title.localeCompare(b.title) || tie;
    if (sort === 'rating' || sort === 'top-rated')
      return (
        (b.rating ?? -1) - (a.rating ?? -1) ||
        timestamp(b) - timestamp(a) ||
        tie
      );
    return timestamp(b) - timestamp(a) || tie;
  });
}

export async function loadDiscoveryBody(entry, { signal } = {}) {
  throwIfAborted(signal);
  const inline = text(entry.body) || text(entry.content);
  if (inline) return inline;
  const response = await fetch(
    `/logs/${encodeURIComponent(categoryKey(entry.category))}/${encodeURIComponent(entry.slug)}.txt`,
    { signal },
  );
  if (response.status === 404) return '';
  if (!response.ok)
    throw new Error('The full discovery note could not be loaded.');
  const body = await response.text();
  throwIfAborted(signal);
  // Vite/static hosts may serve index.html for a missing .txt instead of 404.
  return /^\s*(?:<!doctype\s+html|<html\b)/i.test(body) ? '' : body;
}
