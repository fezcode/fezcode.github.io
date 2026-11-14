// Cache genuine publisher/store artwork locally for discovery shelf spines.
// Requires network access. This never edits the discovery log metadata.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import piml from 'piml';

const publicRoot = join(dirname(fileURLToPath(import.meta.url)), '../public');
const outputRoot = join(publicRoot, 'images/discovery/art/game');
const manifestPath = join(publicRoot, 'images/discovery/game-art.json');
const sourcesPath = join(publicRoot, 'images/discovery/game-art.sources.json');
const entries = piml.parse(
  readFileSync(join(publicRoot, 'logs/game/game.piml'), 'utf8'),
).logs;
const steamIds = {
  'resident-evil-requiem': 3764200,
  '007-first-light': 3768760,
  'lego-batman-legacy-of-the-dark-knight': 2215200,
  'saints-row-the-third': 55230,
  'mirrors-edge-catalyst': 1233570,
  'max-payne-trilogy': 12140,
  'resident-evil-4-remake': 2050650,
  'fallout-4': 377160,
  'kingdoms-of-amalur-reckoning': 102500,
  'resident-evil-3-remake': 952060,
  'nier-automata-and-replicant': 524220,
  'the-outer-worlds': 578650,
  'resident-evil-2-remake': 883710,
};
const headers = {
  'User-Agent': 'Fezcodex-Discovery-Art/1.0 (local editorial artwork cache)',
};
const request = (url) =>
  fetch(url, { headers, signal: AbortSignal.timeout(20000) });
const readJson = (path) =>
  existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
const manifest = readJson(manifestPath);
const sources = readJson(sourcesPath);
const refreshLandscape = process.argv.includes('--refresh-landscape');
mkdirSync(outputRoot, { recursive: true });

async function saveImage(entry, url, sourcePage, sourceTitle) {
  const response = await request(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (!response.headers.get('content-type')?.startsWith('image/'))
    throw new Error('Not an image');
  const image = Buffer.from(await response.arrayBuffer());
  const metadata = await sharp(image).metadata();
  if (
    !metadata.width ||
    metadata.width < 100 ||
    !metadata.height ||
    metadata.height < 100
  )
    throw new Error('Image too small');
  const file = `${entry.slug}.webp`;
  await sharp(image)
    .rotate()
    .resize({
      width: 900,
      height: 1350,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 89 })
    .toFile(join(outputRoot, file));
  manifest[entry.slug] = `/images/discovery/art/game/${file}`;
  sources[entry.slug] = {
    title: entry.title,
    sourceTitle,
    sourcePage,
    imageUrl: url,
    width: metadata.width,
    height: metadata.height,
  };
}

const decode = (value) =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&#39;', "'")
    .replaceAll('&quot;', '"');
async function officialImages(page) {
  const response = await request(page);
  if (!response.ok) throw new Error(`Page HTTP ${response.status}`);
  const html = await response.text();
  const candidates = [];
  for (const meta of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = {};
    for (const match of meta[0].matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g))
      attributes[match[1].toLowerCase()] = decode(match[3]);
    if (
      /^(og:image|og:image:url|twitter:image)$/i.test(
        attributes.property || attributes.name || '',
      ) &&
      attributes.content
    )
      candidates.push(new URL(attributes.content, response.url).href);
  }
  return [...new Set(candidates)];
}

async function loadEntry(entry) {
  const existing = manifest[entry.slug];
  if (
    existing &&
    existsSync(join(publicRoot, existing.slice(1))) &&
    !(
      refreshLandscape &&
      sources[entry.slug]?.width > sources[entry.slug]?.height
    )
  )
    return 'cached';
  const steamId =
    entry.link?.match(/store\.steampowered\.com\/app\/(\d+)/)?.[1] ||
    steamIds[entry.slug];
  let sourceTitle = entry.title;
  let candidates = [];
  let page = entry.link;
  if (entry.slug === 'the-legend-of-zelda-breath-of-the-wild') {
    page =
      'https://www.nintendo.com/us/store/products/the-legend-of-zelda-breath-of-the-wild-switch/';
    candidates = [
      'https://assets.nintendo.com/image/upload/store/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58',
    ];
  } else if (entry.slug === 'openfront-io') {
    page = 'https://github.com/openfrontio/OpenFrontIO';
    const files = await (
      await request(
        'https://api.github.com/repos/openfrontio/OpenFrontIO/contents/resources/press/images/key-art',
      )
    ).json();
    if (Array.isArray(files))
      candidates = files
        .filter((file) => /\.(png|jpe?g|webp)$/i.test(file.name))
        .sort(
          (a, b) =>
            Number(/portrait|600x900|vertical/i.test(b.name)) -
            Number(/portrait|600x900|vertical/i.test(a.name)),
        )
        .map((file) => file.download_url);
    // The publisher's current repository keeps its logo in proprietary assets.
    candidates.push(
      'https://raw.githubusercontent.com/openfrontio/OpenFrontIO/main/proprietary/images/OpenFrontLogo.svg',
    );
  }
  if (steamId) {
    page = `https://store.steampowered.com/app/${steamId}/`;
    try {
      const html = decode(await (await request(page)).text()).replaceAll(
        '\\/',
        '/',
      );
      for (const match of html.matchAll(
        /https?:\/\/[^"'<>\s\\]+library_600x900[^"'<>\s\\]*/g,
      ))
        candidates.push(match[0]);
      candidates.push(
        `https://cdn.akamai.steamstatic.com/steam/apps/${steamId}/library_600x900.jpg`,
      );
    } catch {
      /* The store may display an age gate; the image API below remains usable. */
    }
    try {
      const input = encodeURIComponent(
        JSON.stringify({
          ids: [{ appid: Number(steamId) }],
          context: { language: 'english', country_code: 'US' },
          data_request: { include_assets: true },
        }),
      );
      const itemResponse = await (
        await request(
          `https://api.steampowered.com/IStoreBrowseService/GetItems/v1/?input_json=${input}`,
        )
      ).json();
      const assets = itemResponse.response?.store_items?.[0]?.assets;
      if (assets?.asset_url_format && assets.library_capsule)
        candidates.push(
          assets.asset_url_format.replace('{FILENAME}', assets.library_capsule),
        );
    } catch {
      /* Legacy Steam asset paths below work for older titles. */
    }
    try {
      const details = await (
        await request(
          `https://store.steampowered.com/api/appdetails?appids=${steamId}&filters=basic&l=english&cc=US`,
        )
      ).json();
      if (details[steamId]?.success) {
        const data = details[steamId].data;
        sourceTitle = data.name;
        // Newer Steam uploads put their asset hash between app id and filename.
        for (const image of [
          data.header_image,
          data.capsule_image,
          data.capsule_imagev5,
        ]) {
          if (!image) continue;
          const prefix = image.slice(0, image.lastIndexOf('/') + 1);
          for (const file of [
            'library_600x900.jpg',
            'library_600x900_2x.jpg',
            'library_600x900.png',
          ])
            candidates.push(`${prefix}${file}`);
        }
        candidates.push(
          ...[data.header_image, data.capsule_image].filter(Boolean),
        );
      }
    } catch {
      /* Artwork endpoint remains a separately verified source. */
    }
    for (const host of [
      'https://shared.fastly.steamstatic.com',
      'https://cdn.akamai.steamstatic.com',
    ]) {
      for (const file of [
        'library_600x900.jpg',
        'library_600x900_2x.jpg',
        'library_600x900.png',
        'header.jpg',
      ])
        candidates.push(
          `${host}/store_item_assets/steam/apps/${steamId}/${file}`,
        );
    }
  } else if (!candidates.length) {
    candidates = await officialImages(page);
  }
  const errors = [];
  for (const url of candidates) {
    try {
      await saveImage(entry, url, page, sourceTitle);
      console.log(`Downloaded ${entry.slug} (${sourceTitle})`);
      return 'downloaded';
    } catch (error) {
      errors.push(error.message);
    }
  }
  throw new Error(
    `No verified image for ${entry.slug}: ${errors.join(', ') || 'no social artwork on official page'}`,
  );
}

const failures = [];
let cursor = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (cursor < entries.length) {
      const entry = entries[cursor++];
      try {
        await loadEntry(entry);
      } catch (error) {
        failures.push({ slug: entry.slug, error: error.message });
        console.error(error.message);
      }
    }
  }),
);
writeFileSync(
  manifestPath,
  `${JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 2)}\n`,
);
writeFileSync(
  sourcesPath,
  `${JSON.stringify(Object.fromEntries(Object.entries(sources).sort()), null, 2)}\n`,
);
console.log(
  `${Object.keys(manifest).length}/${entries.length} verified game images cached. ${failures.length} unresolved.`,
);
if (failures.length) process.exitCode = 1;
