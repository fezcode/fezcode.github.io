import { describe, expect, it } from 'vitest';
import {
  applyLatestRelease,
  compareVersions,
  detectPlatform,
  isNewer,
  latestFromIndex,
  normalizeVersion,
  parseRelease,
  pickAsset,
  repoFromLink,
  upgradeAssetLink,
  upgradeFileName,
  validIndex,
} from './projectReleases';

const asset = (repo, name, size = 1000) => ({
  name,
  size,
  state: 'uploaded',
  browser_download_url: `https://github.com/${repo}/releases/download/v1/${name}`,
});

const release = (repo, tag, extra = {}) => ({
  tag_name: tag,
  draft: false,
  prerelease: false,
  html_url: `https://github.com/${repo}/releases/tag/${tag}`,
  published_at: '2026-11-01T00:00:00Z',
  assets: [],
  ...extra,
});

describe('semantic versions (Airlift rules)', () => {
  it('normalizes a leading v and rejects non-semver tags', () => {
    expect(normalizeVersion(' v1.2.3 ')).toBe('1.2.3');
    expect(normalizeVersion('1.2.3-beta.1+build.5')).toBe('1.2.3-beta.1+build.5');
    expect(normalizeVersion('1.2')).toBeNull();
    expect(normalizeVersion('01.2.3')).toBeNull();
    expect(normalizeVersion('nightly')).toBeNull();
  });

  it('compares numerically and ranks a release above its prereleases', () => {
    expect(compareVersions('0.10.0', '0.9.9')).toBe(1);
    expect(compareVersions('1.0.0', '1.0.0-rc.1')).toBe(1);
    expect(compareVersions('1.0.0-rc.2', '1.0.0-rc.10')).toBe(-1);
    expect(compareVersions('1.0.0-alpha', '1.0.0-1')).toBe(1);
    expect(compareVersions('2.0.0', '2.0.0')).toBe(0);
  });

  it('isNewer never moves a version backwards', () => {
    expect(isNewer('0.3.6', '0.3.3')).toBe(true);
    expect(isNewer('0.3.3', '0.3.6')).toBe(false);
    expect(isNewer('0.3.6', 'unknown')).toBe(true);
    expect(isNewer('nope', '0.1.0')).toBe(false);
  });
});

describe('repoFromLink', () => {
  it('extracts owner/repo from GitHub links', () => {
    expect(repoFromLink('https://github.com/fezcode/Airlift')).toBe('fezcode/Airlift');
    expect(repoFromLink('https://github.com/fezcode/Airlift/releases/latest')).toBe(
      'fezcode/Airlift',
    );
    expect(repoFromLink('https://github.com/fezcode/piml.git')).toBe('fezcode/piml');
    expect(repoFromLink('https://example.com/x/y')).toBeNull();
  });
});

describe('index reading', () => {
  const repo = 'fezcode/App';
  const index = {
    schema: 1,
    apps: {
      'fezcode/App': {
        available: true,
        releases: [
          release(repo, 'v0.9.0'),
          release(repo, 'v0.10.0'),
          release(repo, 'v0.11.0', { draft: true }),
          release(repo, 'v0.12.0-beta.1', { prerelease: true }),
          release(repo, 'nightly'),
        ],
      },
      'fezcode/Private': { available: false, releases: [] },
    },
  };

  it('validates the index shape', () => {
    expect(validIndex(index)).toBe(true);
    expect(validIndex({ schema: 2, apps: {} })).toBe(false);
    expect(validIndex({ schema: 1, apps: [] })).toBe(false);
  });

  it('picks the highest stable semver, skipping drafts and bad tags', () => {
    expect(latestFromIndex(index, 'fezcode/app').version).toBe('0.10.0');
  });

  it('includes prereleases only on the preview channel', () => {
    expect(latestFromIndex(index, repo, { prerelease: true }).version).toBe(
      '0.12.0-beta.1',
    );
  });

  it('returns null for unavailable or unknown repos', () => {
    expect(latestFromIndex(index, 'fezcode/Private')).toBeNull();
    expect(latestFromIndex(index, 'fezcode/Nope')).toBeNull();
  });

  it('keeps only uploaded assets hosted in the repo itself', () => {
    const parsed = parseRelease(
      release(repo, 'v1.0.0', {
        assets: [
          asset(repo, 'App-Setup-1.0.0.exe'),
          { ...asset(repo, 'empty.exe'), size: 0 },
          { ...asset(repo, 'partial.exe'), state: 'starter' },
          { ...asset(repo, 'evil.exe'), browser_download_url: 'https://evil.example/evil.exe' },
          asset('someone/else', 'other.exe'),
        ],
      }),
      repo,
    );
    expect(parsed.assets.map((a) => a.name)).toEqual(['App-Setup-1.0.0.exe']);
  });
});

describe('platform and asset picking', () => {
  const repo = 'fezcode/Drops';
  const assets = [
    'Drops-Setup-0.1.0.exe',
    'Drops-0.1.0-osx-arm64.dmg',
    'Drops-0.1.0-osx-x64.dmg',
    'Drops-0.1.0-linux-x64.tar.gz',
    'Drops-0.1.0-x86_64.AppImage',
    'checksums.sha256',
  ].map((name) => parseRelease(release(repo, 'v0.1.0', { assets: [asset(repo, name)] }), repo).assets[0]);

  it('detects the OS and CPU from the user agent', () => {
    expect(
      detectPlatform({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }),
    ).toEqual({ os: 'windows', arch: 'x64' });
    expect(detectPlatform({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }).os).toBe(
      'macos',
    );
    expect(detectPlatform({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64)' })).toEqual({
      os: 'linux',
      arch: 'x64',
    });
    expect(detectPlatform({ userAgent: 'Mozilla/5.0 (Linux; Android 14)' }).os).toBe('android');
  });

  it('never mistakes macOS ("Darwin") for Windows, and trusts the UA over the hint', () => {
    expect(detectPlatform({ userAgent: 'Darwin/24.0.0' }).os).toBe('macos');
    expect(
      detectPlatform({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        userAgentData: { platform: 'Windows' },
      }).os,
    ).toBe('macos');
    expect(detectPlatform({ userAgent: '', platform: 'Win32' }).os).toBe('windows');
  });

  it('picks the right file per OS and architecture', () => {
    expect(pickAsset(assets, { os: 'windows', arch: 'x64' }).name).toBe('Drops-Setup-0.1.0.exe');
    expect(pickAsset(assets, { os: 'macos', arch: 'arm64' }).name).toBe('Drops-0.1.0-osx-arm64.dmg');
    expect(pickAsset(assets, { os: 'macos', arch: 'x64' }).name).toBe('Drops-0.1.0-osx-x64.dmg');
    expect(pickAsset(assets, { os: 'linux', arch: 'x64' }).name).toMatch(/AppImage|linux-x64/);
  });

  it('returns null when nothing fits (phones, unknown OS)', () => {
    expect(pickAsset(assets, { os: 'ios', arch: null })).toBeNull();
    expect(pickAsset(assets, { os: null, arch: null })).toBeNull();
    expect(pickAsset([assets[0]], { os: 'macos', arch: 'arm64' })).toBeNull();
  });
});

describe('applyLatestRelease', () => {
  const repo = 'fezcode/App';
  const latest = {
    repo,
    release: { version: '0.3.6', url: 'u', publishedAt: 'p', assets: [] },
    asset: { name: 'App-Setup-0.3.6.exe', url: 'https://github.com/fezcode/App/releases/download/v0.3.6/App-Setup-0.3.6.exe' },
  };
  const cfg = {
    version: '0.3.3',
    download: 'https://github.com/fezcode/App/releases/latest',
    hero: { primary: { href: 'https://github.com/fezcode/App/releases/latest/' } },
    other: 'https://github.com/fezcode/App/releases',
    list: ['https://github.com/fezcode/App/releases/latest'],
  };

  it('raises the version and points latest-download links at the OS file', () => {
    const next = applyLatestRelease(cfg, latest);
    expect(next.version).toBe('0.3.6');
    expect(next.download).toBe(latest.asset.url);
    expect(next.hero.primary.href).toBe(latest.asset.url);
    expect(next.list[0]).toBe(latest.asset.url);
    expect(next.other).toBe(cfg.other); // the releases page itself stays
    expect(next.latestRelease.asset).toBe(latest.asset);
    expect(cfg.download).toMatch(/releases\/latest$/); // input untouched
  });

  it('keeps links on the latest-release page when no file matches', () => {
    const next = applyLatestRelease(cfg, { ...latest, asset: null });
    expect(next.download).toBe(cfg.download);
    expect(next.version).toBe('0.3.6');
  });

  it('moves links pinned to an older release file onto the latest release', () => {
    const rel = {
      version: '0.94.2',
      assets: [
        { name: 'Descry-0.94.2.dmg', url: 'https://github.com/fezcode/Descry/releases/download/v0.94.2/Descry-0.94.2.dmg' },
      ],
    };
    const old = 'https://github.com/fezcode/Descry/releases/download/v0.90.1/Descry-0.90.1.dmg';
    const gone = 'https://github.com/fezcode/Descry/releases/download/v0.90.1/Descry-0.90.1-old.zip';
    expect(upgradeAssetLink(old, 'fezcode/Descry', rel)).toBe(rel.assets[0].url);
    expect(upgradeAssetLink(gone, 'fezcode/Descry', rel)).toBe(
      'https://github.com/fezcode/Descry/releases/latest',
    );
    // Already current, another repo, or not a release file: untouched.
    expect(upgradeAssetLink(rel.assets[0].url, 'fezcode/Descry', rel)).toBe(rel.assets[0].url);
    expect(upgradeAssetLink(old, 'fezcode/Other', rel)).toBe(old);
    expect(upgradeAssetLink('https://github.com/fezcode/Descry', 'fezcode/Descry', rel)).toBe(
      'https://github.com/fezcode/Descry',
    );
  });

  it('renames file labels only to files the latest release ships', () => {
    const rel = {
      version: '0.94.2',
      assets: [{ name: 'Descry-0.94.2-windows-x64-portable.zip' }, { name: 'Descry-Setup-0.94.2.exe' }],
    };
    expect(upgradeFileName('Descry-0.90.1-windows-x64-portable.zip', rel)).toBe(
      'Descry-0.94.2-windows-x64-portable.zip',
    );
    expect(upgradeFileName('Descry-Setup-0.90.1.exe', rel)).toBe('Descry-Setup-0.94.2.exe');
    expect(upgradeFileName('Descry-0.90.1.dmg', rel)).toBe('Descry-0.90.1.dmg'); // not shipped
    expect(upgradeFileName('dist/win-x64/desktop/', rel)).toBe('dist/win-x64/desktop/');
    const next = applyLatestRelease({ ways: [{ file: 'Descry-Setup-0.90.1.exe' }] }, {
      repo: 'fezcode/Descry',
      release: rel,
      asset: null,
    });
    expect(next.ways[0].file).toBe('Descry-Setup-0.94.2.exe');
  });

  it('never lowers a version', () => {
    const next = applyLatestRelease({ ...cfg, version: '9.0.0' }, latest);
    expect(next.version).toBe('9.0.0');
  });
});
