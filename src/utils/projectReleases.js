/* global BigInt, globalThis */
// Latest-release lookup for projects, done the way Airlift does it.
//
// Airlift never asks each app's repository. Its "Release index" workflow
// rebuilds one file, release.json, whenever a catalog app's releases change,
// and every check reads that single file: one request, no GitHub API rate
// limit, private repositories listed as unavailable instead of failing.
// Releases keep GitHub's field names. A release counts only if it isn't a
// draft and its tag is semantic (major.minor.patch); the newest stable one by
// semantic-version order wins. This module reads the same index with the
// same rules, so fezcodex and Airlift always agree on what "latest" is.

export const RELEASE_INDEX_URL =
  'https://raw.githubusercontent.com/fezcode/Airlift/main/release.json';

const CACHE_KEY = 'fezcodex-release-index';
const FRESH_MS = 6 * 60 * 60 * 1000; // Airlift: Fresh = 6 hours
const RETRY_MS = 60 * 1000; // Airlift: Retry after an error = 1 minute

// ---------------------------------------------------------------- semver

const SEMVER =
  /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/;

/** Airlift's SemVersion.TryNormalize: trim, drop a leading v, then validate. */
export const normalizeVersion = (value) => {
  const normalized = String(value ?? '')
    .trim()
    .replace(/^v+/, '');
  return SEMVER.test(normalized) ? normalized : null;
};

const bigCompare = (a, b) => {
  const x = BigInt(a);
  const y = BigInt(b);
  return x === y ? 0 : x > y ? 1 : -1;
};

/** Airlift's SemVersion.Compare: numeric core, then prerelease precedence. */
export const compareVersions = (left, right) => {
  const a = SEMVER.exec(left);
  const b = SEMVER.exec(right);
  if (!a || !b) throw new Error('A release version must use major.minor.patch.');
  for (let i = 1; i <= 3; i++) {
    const c = bigCompare(a[i], b[i]);
    if (c !== 0) return c;
  }
  const ap = a[4] || '';
  const bp = b[4] || '';
  if (ap === bp) return 0;
  if (!ap) return 1; // a release outranks its prereleases
  if (!bp) return -1;
  const aa = ap.split('.');
  const bb = bp.split('.');
  for (let i = 0; i < Math.min(aa.length, bb.length); i++) {
    const an = /^\d+$/.test(aa[i]);
    const bn = /^\d+$/.test(bb[i]);
    const c =
      an && bn
        ? bigCompare(aa[i], bb[i])
        : an
          ? -1
          : bn
            ? 1
            : aa[i] < bb[i]
              ? -1
              : aa[i] > bb[i]
                ? 1
                : 0;
    if (c !== 0) return c;
  }
  return Math.sign(aa.length - bb.length);
};

// ---------------------------------------------------------------- repos

/** "https://github.com/fezcode/Airlift/..." -> "fezcode/Airlift". */
export const repoFromLink = (link) => {
  const m = String(link || '').match(
    /github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?(?:[/?#]|$)/i,
  );
  return m ? `${m[1]}/${m[2]}` : null;
};

const sameRepo = (a, b) => a.toLowerCase() === b.toLowerCase();

const ASSET_PATH = (repo) => `/${repo}/releases/download/`.toLowerCase();

/** One release, validated like Airlift's ParseRelease; null if unusable. */
export const parseRelease = (raw, repo) => {
  if (!raw || raw.draft) return null;
  const version = normalizeVersion(raw.tag_name);
  if (!version) return null;
  const assets = [];
  for (const asset of raw.assets || []) {
    if (asset.state && asset.state !== 'uploaded') continue;
    if (!(asset.size > 0)) continue;
    const name = String(asset.name || '');
    if (!name || /[\\/]/.test(name)) continue;
    let url;
    try {
      url = new URL(asset.browser_download_url);
    } catch {
      continue;
    }
    // Only files hosted in this repository's own releases.
    if (
      url.protocol !== 'https:' ||
      url.hostname !== 'github.com' ||
      !url.pathname.toLowerCase().startsWith(ASSET_PATH(repo))
    ) {
      continue;
    }
    assets.push({ name, size: asset.size, url: url.href });
  }
  return {
    tag: raw.tag_name,
    version,
    url: raw.html_url,
    publishedAt: raw.published_at,
    prerelease: Boolean(raw.prerelease),
    assets,
  };
};

/**
 * The newest release of `repo` in an index, or null. `prerelease` widens the
 * channel to prereleases, as Airlift's preview channel does.
 */
export const latestFromIndex = (index, repo, { prerelease = false } = {}) => {
  if (!index?.apps || !repo) return null;
  const key = Object.keys(index.apps).find((k) => sameRepo(k, repo));
  const entry = key && index.apps[key];
  if (!entry || entry.available !== true) return null;
  const candidates = (entry.releases || [])
    .map((r) => parseRelease(r, key))
    .filter((r) => r && (prerelease || !r.prerelease));
  if (!candidates.length) return null;
  candidates.sort((a, b) => compareVersions(b.version, a.version));
  return candidates[0];
};

/** Is the index a shape we understand (schema 1, apps object)? */
export const validIndex = (index) =>
  Boolean(
    index &&
      index.schema === 1 &&
      index.apps &&
      typeof index.apps === 'object' &&
      !Array.isArray(index.apps),
  );

// ---------------------------------------------------------------- platform

/** The visitor's OS and CPU, as far as the browser will say. */
// Order matters: Android reports "Linux", iPadOS can report "Macintosh".
// "Windows" is matched as a word: a bare /win/ would also match "Darwin".
const OS_PATTERNS = [
  ['android', /android/i],
  ['ios', /iphone|ipad|ipod/i],
  ['windows', /windows|win32|win64|wow64/i],
  ['macos', /macintosh|mac ?os|macintel|darwin/i],
  ['linux', /linux|x11|cros/i],
];

const osFrom = (text) =>
  (OS_PATTERNS.find(([, re]) => re.test(text)) || [null])[0];

/** The visitor's OS and CPU, as far as the browser will say. */
export const detectPlatform = (nav = globalThis.navigator) => {
  if (!nav) return { os: null, arch: null };
  const ua = String(nav.userAgent || '');
  const hint = String(nav.userAgentData?.platform || nav.platform || '');
  // The user agent names the OS; the platform hint is only a fallback.
  const os = osFrom(ua) || osFrom(hint);
  const text = `${ua} ${hint}`;
  const arch = /arm64|aarch64/i.test(text)
    ? 'arm64'
    : /x86_64|x64|win64|wow64|amd64/i.test(text)
      ? 'x64'
      : null;
  return { os, arch };
};

const IGNORED = /\.(sha256|sha512|sig|asc|txt|json|blockmap|zsync|yml|yaml|md)$/i;

const OS_HINTS = {
  windows: { name: /win(dows)?|setup/i, ext: /\.(exe|msi|msix|appx)$/i },
  macos: { name: /mac|darwin|osx|universal/i, ext: /\.(dmg|pkg)$/i },
  linux: {
    name: /linux/i,
    ext: /\.(appimage|deb|rpm|flatpak|snap)$/i,
  },
  android: { name: /android/i, ext: /\.(apk|aab)$/i },
};

const ARCH_HINTS = {
  arm64: /arm64|aarch64|universal/i,
  x64: /x64|x86[_-]?64|amd64|win64|universal/i,
};

/**
 * The release file that best fits a platform, or null. Names are matched the
 * way most release pipelines label them (Setup.exe, *.dmg, linux-x86_64...).
 */
export const pickAsset = (assets, platform) => {
  const os = platform?.os;
  const hints = os && OS_HINTS[os];
  if (!hints || !assets?.length) return null;
  let best = null;
  for (const asset of assets) {
    if (IGNORED.test(asset.name)) continue;
    const otherOs = Object.entries(OS_HINTS).some(
      ([key, h]) => key !== os && (h.ext.test(asset.name) || h.name.test(asset.name)),
    );
    const byName = hints.name.test(asset.name);
    const byExt = hints.ext.test(asset.name);
    if (!byName && !byExt) continue;
    if (otherOs && !byName) continue;
    let score = (byExt ? 4 : 0) + (byName ? 3 : 0);
    if (platform.arch) {
      if (ARCH_HINTS[platform.arch].test(asset.name)) score += 2;
      else if (Object.values(ARCH_HINTS).some((re) => re.test(asset.name))) score -= 3;
    }
    if (/setup|installer/i.test(asset.name)) score += 1;
    if (!best || score > best.score) best = { asset, score };
  }
  return best ? best.asset : null;
};

// ---------------------------------------------------------------- applying

/** Is `next` a newer semantic version than `current` (or current unusable)? */
export const isNewer = (next, current) => {
  const n = normalizeVersion(next);
  if (!n) return false;
  const c = normalizeVersion(current);
  return !c || compareVersions(n, c) > 0;
};

const latestUrl = (repo) =>
  `https://github.com/${repo}/releases/latest`.toLowerCase();

/**
 * A link to a file in an older release, moved to the latest release:
 * ".../download/v0.90.1/Descry-0.90.1.dmg" -> the same file at 0.94.2. When
 * the latest release has no such file, the link goes to the latest-release
 * page instead of a stale build. Anything else is returned unchanged.
 */
export const upgradeAssetLink = (value, repo, release) => {
  if (typeof value !== 'string' || !repo || !release) return value;
  const m = value.match(
    /^https:\/\/github\.com\/([^/]+\/[^/]+)\/releases\/download\/([^/]+)\/([^/?#]+)$/i,
  );
  if (!m || m[1].toLowerCase() !== repo.toLowerCase()) return value;
  const oldVersion = normalizeVersion(decodeURIComponent(m[2]));
  if (!oldVersion || !isNewer(release.version, oldVersion)) return value;
  const wanted = decodeURIComponent(m[3])
    .split(oldVersion)
    .join(release.version)
    .toLowerCase();
  const match = (release.assets || []).find(
    (a) => a.name.toLowerCase() === wanted,
  );
  return match ? match.url : `https://github.com/${m[1]}/releases/latest`;
};

// Just the x.y.z number: in "App-1.2.3-linux-x64.zip" the suffix is not a
// prerelease tag.
const SEMVER_IN_TEXT = /(?<![\d.])\d+\.\d+\.\d+(?!\.?\d)/;

/**
 * A file name shown as a label ("Descry-Setup-0.90.1.exe"), renamed to the
 * latest release's file, but only if that release really ships it.
 */
export const upgradeFileName = (name, release) => {
  if (typeof name !== 'string' || !release) return name;
  const found = name.match(SEMVER_IN_TEXT);
  if (!found || !isNewer(release.version, found[0])) return name;
  const wanted = name.split(found[0]).join(release.version);
  const match = (release.assets || []).find(
    (a) => a.name.toLowerCase() === wanted.toLowerCase(),
  );
  return match ? match.name : name;
};

/**
 * A copy of a project config with the live release applied:
 * - `version` moves up to the latest release (never down);
 * - every link that means "download the latest release" points straight at
 *   the file for this visitor's OS, when the release has one;
 * - `latestRelease` carries the details for pages that want them.
 * Links stay on GitHub's latest-release page when no file matches.
 */
export const applyLatestRelease = (cfg, latest) => {
  if (!cfg || !latest?.release) return cfg;
  const { repo, release, asset } = latest;
  const target = latestUrl(repo);
  const swap = (value) => {
    if (typeof value === 'string') {
      if (asset && value.replace(/\/+$/, '').toLowerCase() === target) {
        return asset.url;
      }
      return upgradeAssetLink(value, repo, release);
    }
    if (Array.isArray(value)) return value.map(swap);
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [
          k,
          k === 'file' ? upgradeFileName(v, release) : swap(v),
        ]),
      );
    }
    return value;
  };
  const next = swap(cfg);
  if (cfg.version && isNewer(release.version, cfg.version)) {
    next.version = release.version;
  }
  next.latestRelease = {
    version: release.version,
    url: release.url,
    publishedAt: release.publishedAt,
    asset,
  };
  return next;
};

// ---------------------------------------------------------------- loading

const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
  } catch {
    return null;
  }
};

const writeCache = (entry) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Storage full or blocked: the in-memory copy still serves this visit.
  }
};

let pending = null;

/**
 * The release index, from cache while fresh (6 h, or 1 min after a failure)
 * and otherwise from the network. On failure the last good copy is kept.
 * Resolves to null only when there has never been a good copy.
 */
export const loadReleaseIndex = () => {
  if (pending) return pending;
  const cached = readCache();
  const age = cached ? Date.now() - cached.checkedAt : Infinity;
  if (cached && age < (cached.error ? RETRY_MS : FRESH_MS)) {
    return Promise.resolve(cached.index || null);
  }
  pending = fetch(RELEASE_INDEX_URL, { cache: 'no-cache' })
    .then((res) => {
      if (!res.ok) throw new Error(`release index HTTP ${res.status}`);
      return res.json();
    })
    .then((index) => {
      if (!validIndex(index)) throw new Error('unknown release index format');
      writeCache({ index, checkedAt: Date.now(), error: null });
      return index;
    })
    .catch((error) => {
      writeCache({
        index: cached?.index || null,
        checkedAt: Date.now(),
        error: String(error?.message || error),
      });
      return cached?.index || null;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
};

/** Latest release info for a repo link, plus the file for this visitor. */
export const resolveLatest = async (repoLink, platform = detectPlatform()) => {
  const repo = repoFromLink(repoLink);
  if (!repo) return null;
  const index = await loadReleaseIndex();
  const release = latestFromIndex(index, repo);
  if (!release) return null;
  return { repo, release, asset: pickAsset(release.assets, platform) };
};
