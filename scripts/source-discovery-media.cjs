// Download real media artwork and save its path/provenance in the log PIML.
// Run manually when adding entries. Existing selected artwork is retained.
const fs = require('node:fs');
const path = require('node:path');
const piml = require('piml');
const sharp = require('sharp');
const { setLogArtwork } = require('./lib/log-artwork.cjs');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const OUT = path.join(PUBLIC, 'images/discovery');
const ART = path.join(OUT, 'covers');
const CATEGORIES = ['movie', 'series', 'music', 'book'];
const logFile = (category) =>
  path.join(PUBLIC, `logs/${category}/${category}.piml`);
const readEntries = () =>
  CATEGORIES.flatMap((category) => {
    const data = piml.parse(fs.readFileSync(logFile(category), 'utf8'));
    return (data.logs || []).map((entry) => ({ ...entry, category }));
  });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const plain = (value) =>
  String(value || '')
    .replace(/\s*\([^)]*\)/g, '')
    .trim();
const normalized = (value) =>
  plain(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const moviePages = {
  'the-jason-bourne-series': 'The Bourne Identity (2002 film)',
  'the-hunt-for-red-october': 'The Hunt for Red October (film)',
  'batman-mask-of-the-phantasm': 'Batman: Mask of the Phantasm',
  'project-hail-mary-2026': 'Project Hail Mary (film)',
  'balkanski-spijun-1984': 'Balkan Spy',
  'crash-2004': 'Crash (2004 film)',
  'unleashed-2005': 'Unleashed (2005 film)',
  'mr-and-mrs-smith-2005': 'Mr. & Mrs. Smith (2005 film)',
  'john-wick-chapter-1-movie': 'John Wick (film)',
  'heat-1995-movie': 'Heat (1995 film)',
  'blade-1998-movie': 'Blade (1998 film)',
  'manchester-by-the-sea-movie': 'Manchester by the Sea (film)',
  'collateral-2004-movie': 'Collateral (film)',
  'relay-2024': 'Relay (2025 film)',
};
const seriesNames = {
  'furia-tv-series': ['Furia', 'Rage'],
  'ayak-isleri-tv-series': ['Ayak İşleri', 'Running Errands'],
  'marvels-the-punisher-tv-series': ['The Punisher'],
  'last-man-on-earth-tv-series': ['The Last Man on Earth'],
  'shogun-tv-series': ['Shōgun'],
  'splinter-cell-deathwatch': ["Tom Clancy's Splinter Cell: Deathwatch"],
};
const appleAlbumIds = {
  'dreamed-at-dawn': [1183752753, 'tr'],
  'special-ed-neva-go-back': [1239560635, 'us'],
};
const musicAlbums = {
  'born-to-die-lana-del-rey': 'Born to Die',
  'dying-light-ost': 'Dying Light',
  'morcheeba-easier-said-than-done': 'Head Up High',
  'in-the-aeroplane-over-the-sea': 'In the Aeroplane Over the Sea',
};

async function response(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(22000),
      headers: {
        'User-Agent': 'FezcodexDiscovery/1.0 (personal media artwork archive)',
      },
    });
    if (res.status === 429 || res.status === 503) {
      await sleep(2000 * (attempt + 1));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  }
  throw new Error('Rate limited');
}
const json = async (url) => (await response(url)).json();
const isYouTubeArtwork = (entry) =>
  /^https?:\/\/(?:i\.ytimg\.com|img\.youtube\.com)\//i.test(
    entry.image || '',
  ) ||
  /^https?:\/\/(?:i\.ytimg\.com|img\.youtube\.com)\//i.test(
    entry.imageSource?.url || '',
  ) ||
  /youtube/i.test(entry.imageSource?.provider || '');

async function retainExistingArtwork(entry) {
  const image = typeof entry.image === 'string' ? entry.image : '';
  if (!image || image.startsWith('/images/defaults/')) return false;
  // A real album cover may replace an older video still, including a locally
  // cached still whose provider is retained in imageSource.
  if (entry.category === 'music' && isYouTubeArtwork(entry)) return false;
  if (image.startsWith('/')) {
    try {
      await sharp(path.join(PUBLIC, image.slice(1)))
        .raw()
        .toBuffer();
      return true;
    } catch {
      return false;
    }
  }
  if (/^https?:\/\//.test(image)) {
    await download(
      entry,
      image,
      entry.imageSource?.provider || 'Authored artwork URL',
      entry.imageSource?.page || entry.link || image,
      entry.imageSource?.title || entry.title,
      entry.imageSource,
    );
    // If caching fails, the authored URL remains selected. Provider search
    // must not silently swap it for a different edition's cover.
    return true;
  }
  return false;
}

async function download(
  entry,
  image,
  provider,
  reference,
  title = entry.title,
  existingSource,
) {
  if (!/^https?:\/\//.test(image || '') || /\.svg(?:\?|$)/i.test(image))
    return false;
  try {
    const res = await response(image);
    const bytes = Buffer.from(await res.arrayBuffer());
    const metadata = await sharp(bytes).metadata();
    if (
      !metadata.width ||
      metadata.width < 140 ||
      metadata.height < 160 ||
      bytes.length < 1000
    )
      return false;
    const directory = path.join(ART, entry.category);
    fs.mkdirSync(directory, { recursive: true });
    const file = path.join(directory, `${entry.slug}.webp`);
    await sharp(bytes)
      .rotate()
      .resize({
        width: 720,
        height: 1080,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toFile(file);
    // Fully decode the written asset before making it discoverable.
    await sharp(file).raw().toBuffer();
    setLogArtwork(logFile(entry.category), entry.slug, {
      image: `/images/discovery/covers/${entry.category}/${entry.slug}.webp`,
      imageSource: {
        ...existingSource,
        provider,
        page: reference,
        url: image,
        title,
        width: metadata.width,
        height: metadata.height,
      },
    });
    return true;
  } catch {
    return false;
  }
}
async function wiki(entry, titles) {
  for (const title of [...new Set(titles.filter(Boolean))]) {
    const reference = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}`;
    try {
      const summary = await json(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replaceAll(' ', '_'))}`,
      );
      if (summary.type === 'disambiguation') continue;
      const context = summary.description || summary.extract || '';
      if (entry.category === 'movie' && !/\b(?:film|movie)\b/i.test(context))
        continue;
      if (
        entry.category === 'series' &&
        !/\b(?:television|series|miniseries|tv)\b/i.test(context)
      )
        continue;
      if (
        entry.category === 'music' &&
        !/\b(?:album|song|single|soundtrack|record)\b/i.test(context)
      )
        continue;
      const image = summary.originalimage?.source || summary.thumbnail?.source;
      if (
        await download(
          entry,
          image,
          'Wikipedia article artwork',
          reference,
          summary.title || title,
        )
      )
        return true;
    } catch {}
  }
  return false;
}
async function movie(entry) {
  const title = plain(entry.title);
  const year = entry.title.match(/\((\d{4})\)/)?.[1];
  const candidates = [
    moviePages[entry.slug],
    year && `${title} (${year} film)`,
    `${title} (film)`,
    title,
  ];
  return wiki(entry, candidates);
}
function sameShow(entry, show) {
  const names = [...(seriesNames[entry.slug] || []), plain(entry.title)];
  return names.some((name) => normalized(name) === normalized(show.name));
}
async function series(entry) {
  const imdb = entry.link?.match(/imdb\.com\/title\/(tt\d+)/)?.[1];
  if (imdb) {
    try {
      const show = await json(
        `https://api.tvmaze.com/lookup/shows?imdb=${imdb}`,
      );
      if (
        sameShow(entry, show) &&
        (await download(
          entry,
          show.image?.original || show.image?.medium,
          'TVmaze show poster',
          show.url,
          show.name,
        ))
      )
        return true;
    } catch {}
  }
  for (const name of [...(seriesNames[entry.slug] || []), plain(entry.title)]) {
    try {
      const list = await json(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(name)}`,
      );
      const matches = list
        .map((result) => result.show)
        .filter((show) => sameShow(entry, show));
      matches.sort(
        (a, b) =>
          Math.abs(
            Number(a.premiered?.slice(0, 4)) - (Number(entry.year) || 2024),
          ) -
          Math.abs(
            Number(b.premiered?.slice(0, 4)) - (Number(entry.year) || 2024),
          ),
      );
      for (const show of matches)
        if (
          await download(
            entry,
            show.image?.original || show.image?.medium,
            'TVmaze show poster',
            show.url,
            show.name,
          )
        )
          return true;
    } catch {}
  }
  return wiki(entry, [
    `${plain(entry.title)} (TV series)`,
    `${plain(entry.title)} (2025 TV series)`,
    plain(entry.title),
  ]);
}
async function music(entry) {
  const album = musicAlbums[entry.slug] || entry.album || plain(entry.title);
  const artist = plain(entry.artist).split(' & ')[0];
  if (appleAlbumIds[entry.slug]) {
    const [id, country] = appleAlbumIds[entry.slug];
    try {
      const result = await json(
        `https://itunes.apple.com/lookup?id=${id}&country=${country}`,
      );
      const item = result.results?.find((value) => value.collectionId === id);
      const image = item?.artworkUrl100?.replace(
        /100x100bb\.(jpg|png)/,
        '1000x1000bb.$1',
      );
      if (
        item &&
        (await download(
          entry,
          image,
          'Apple Music album artwork',
          item.collectionViewUrl,
          item.collectionName,
        ))
      )
        return true;
    } catch {}
  }
  try {
    const result = await json(
      `https://itunes.apple.com/search?term=${encodeURIComponent(`${artist} ${album}`)}&entity=album&limit=8`,
    );
    const candidates = result.results.filter((item) => {
      const a = normalized(artist);
      const b = normalized(item.artistName);
      const namesMatch = a && b && (a.includes(b) || b.includes(a));
      const t = normalized(album);
      const u = normalized(item.collectionName);
      return namesMatch && (t.includes(u) || u.includes(t));
    });
    for (const item of candidates) {
      const image = item.artworkUrl100?.replace(
        /100x100bb\.(jpg|png)/,
        '1000x1000bb.$1',
      );
      if (
        await download(
          entry,
          image,
          'Apple Music album artwork',
          item.collectionViewUrl,
          item.collectionName,
        )
      )
        return true;
    }
  } catch {}
  const videoId = entry.link?.match(
    /(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[&?]|$)/,
  )?.[1];
  if (
    videoId &&
    (await download(
      entry,
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      'Authored YouTube video artwork',
      entry.link,
    ))
  )
    return true;
  return wiki(entry, [`${album} (album)`, album]);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const entries = readEntries().sort(
    (a, b) => Date.parse(b.date) - Date.parse(a.date),
  );
  let cursor = 0;
  const missing = [];
  const worker = async () => {
    while (cursor < entries.length) {
      const entry = entries[cursor++];
      const key = `${entry.category}/${entry.slug}`;
      if (await retainExistingArtwork(entry)) {
        console.log(`Existing ${key}`);
        continue;
      }
      const ok =
        entry.category === 'movie'
          ? await movie(entry)
          : entry.category === 'series'
            ? await series(entry)
            : entry.category === 'music'
              ? await music(entry)
              : false;
      console.log(`${ok ? 'Downloaded' : 'Missing'} ${key}`);
      if (!ok) missing.push(key);
      await sleep(200);
    }
  };
  await Promise.all(Array.from({ length: 3 }, worker));
  const covered = readEntries().filter(
    (entry) =>
      typeof entry.image === 'string' &&
      entry.image &&
      !entry.image.startsWith('/images/defaults/'),
  );
  console.log(
    JSON.stringify(
      {
        covered: covered.length,
        counts: covered.reduce(
          (counts, entry) => ({
            ...counts,
            [entry.category]: (counts[entry.category] || 0) + 1,
          }),
          {},
        ),
        missing,
      },
      null,
      2,
    ),
  );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
