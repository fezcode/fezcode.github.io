// Rewrite the version numbers stored in project data to each repo's latest
// release, found the way Airlift finds it (see src/utils/projectReleases.js):
// one read of Airlift's release.json, drafts and non-semver tags ignored,
// newest stable release by semantic version.
//
// Repos that Airlift's index doesn't carry (libraries such as piml, gobake)
// fall back to the same repo's public GitHub releases, then its tags. Repos
// the index marks unavailable (private) are left as they are.
//
//   node scripts/sync-project-versions.mjs          write changes
//   node scripts/sync-project-versions.mjs --check  report only
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import piml from 'piml';
import {
  RELEASE_INDEX_URL,
  validIndex,
  latestFromIndex,
  parseRelease,
  normalizeVersion,
  compareVersions,
  repoFromLink,
  upgradeAssetLink,
  upgradeFileName,
} from '../src/utils/projectReleases.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJECTS = path.join(ROOT, 'public', 'projects');
const CHECK = process.argv.includes('--check');

const headers = {
  'User-Agent': 'fezcodex-sync-project-versions',
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

const getJson = async (url) => {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
};

/** Latest stable semver from the repo's own releases, then its tags. */
const latestFromGitHub = async (repo) => {
  const releases = await getJson(
    `https://api.github.com/repos/${repo}/releases?per_page=100`,
  ).catch(() => []);
  const parsed = releases
    .map((r) => parseRelease(r, repo))
    .filter((r) => r && !r.prerelease);
  if (parsed.length) {
    parsed.sort((a, b) => compareVersions(b.version, a.version));
    return { version: parsed[0].version, source: 'releases', release: parsed[0] };
  }
  const tags = await getJson(
    `https://api.github.com/repos/${repo}/tags?per_page=100`,
  ).catch(() => []);
  const versions = tags
    .map((t) => normalizeVersion(t.name))
    .filter((v) => v && !v.includes('-'));
  if (!versions.length) return null;
  versions.sort((a, b) => compareVersions(b, a));
  return { version: versions[0], source: 'tags' };
};

// ------------------------------------------------------------ file edits

const changes = [];

const edit = (file, transform) => {
  const before = fs.readFileSync(file, 'utf8');
  const after = transform(before);
  if (after !== before) {
    if (!CHECK) fs.writeFileSync(file, after);
    return true;
  }
  return false;
};

/** (version) inside the projects.piml item whose (slug) is `slug`. */
const setPimlVersion = (text, slug, version) => {
  const items = text.split(/(?=^\s*> \(item\)|^\s*> \(project\))/m);
  return items
    .map((block) =>
      new RegExp(`^\\s*\\(slug\\)\\s+${slug}\\s*$`, 'm').test(block)
        ? block.replace(/^(\s*\(version\)\s+)\S+/m, `$1${version}`)
        : block,
    )
    .join('');
};

/** The top-level "version" of a JSON-ish app file (2-space indent only). */
const setTopLevelJsonVersion = (text, version) =>
  text.replace(/^( {2}"version":\s*")[^"]+(")/m, `$1${version}$2`);

/** A top-level (version) line in a project's PIML side file. */
const setTopLevelPimlVersion = (text, version) =>
  text.replace(/^(\(version\)\s+)\S+/m, `$1${version}`);

// ------------------------------------------------------------ main

const index = await fetch(RELEASE_INDEX_URL).then((r) => r.json());
if (!validIndex(index)) throw new Error('Airlift release index: unknown format');

const pimlFile = path.join(PROJECTS, 'projects.piml');
const data = piml.parse(fs.readFileSync(pimlFile, 'utf8'));
const projects = (data.projects || Object.values(data).find(Array.isArray) || [])
  .filter((p) => p.version && p.repo_link);

const report = [];
for (const project of projects) {
  const repo = repoFromLink(project.repo_link);
  if (!repo) continue;
  const inIndex = Object.keys(index.apps).find(
    (k) => k.toLowerCase() === repo.toLowerCase(),
  );
  let latest = null;
  let source = '';
  let release = null;
  if (inIndex) {
    const rel = latestFromIndex(index, repo);
    if (rel) {
      latest = rel.version;
      source = 'airlift index';
      release = rel;
    }
  } else {
    const gh = await latestFromGitHub(repo);
    if (gh) {
      latest = gh.version;
      source = `github ${gh.source}`;
      release = gh.release || null;
    }
  }
  if (!latest) {
    // No public release to read (private repo): projects.piml stays the
    // best-known version, and side files are brought up to it.
    latest = normalizeVersion(project.version);
    source = 'private, kept projects.piml version';
    if (!latest) continue;
  }

  const current = String(project.version);
  // Never move a version backwards because a source is behind.
  const newer =
    !normalizeVersion(current) || compareVersions(latest, normalizeVersion(current)) > 0;
  const touched = [];
  if (newer) {
    if (edit(pimlFile, (t) => setPimlVersion(t, project.slug, latest))) {
      touched.push('projects.piml');
    }
  }
  // Side files carry their own copy; bring them up to the same version.
  const dir = path.join(PROJECTS, project.slug);
  const sides = [
    ['app.txt', setTopLevelJsonVersion],
    ['hifi.txt', setTopLevelJsonVersion],
    ['hero.txt', setTopLevelPimlVersion],
  ];
  for (const [name, setter] of sides) {
    const file = path.join(dir, name);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    const m =
      text.match(/^ {2}"version":\s*"([^"]+)"/m) || text.match(/^\(version\)\s+(\S+)/m);
    const sideVersion = m && normalizeVersion(m[1]);
    if (sideVersion && compareVersions(latest, sideVersion) > 0) {
      if (edit(file, (t) => setter(t, latest))) touched.push(`${project.slug}/${name}`);
    }
  }
  // Links pinned to a file in an older release move to the same file in the
  // latest one (or to the latest-release page if that file is gone).
  if (release && fs.existsSync(dir)) {
    for (const name of fs.readdirSync(dir)) {
      const file = path.join(dir, name);
      if (!/\.(txt|piml|json)$/i.test(name) || !fs.statSync(file).isFile()) continue;
      const moved = edit(file, (t) =>
        t
          .replace(
            /https:\/\/github\.com\/[^/\s"')]+\/[^/\s"')]+\/releases\/download\/[^/\s"')]+\/[^\s"')]+/g,
            (url) => upgradeAssetLink(url, repo, release),
          )
          // "file" labels naming a release file follow it to the new version.
          .replace(
            /("file":\s*")([^"]+)(")/g,
            (all, a, name, b) => `${a}${upgradeFileName(name, release)}${b}`,
          ),
      );
      if (moved) touched.push(`${project.slug}/${name} (download links)`);
    }
  }
  if (touched.length) changes.push(...touched);
  report.push([
    project.slug,
    current,
    latest,
    `${source}${touched.length ? ` -> ${touched.join(', ')}` : ' (up to date)'}`,
  ]);
}

for (const [slug, from, to, note] of report) {
  console.log(`${slug.padEnd(16)} ${String(from).padEnd(9)} ${String(to).padEnd(9)} ${note}`);
}
console.log(
  `\n${CHECK ? 'Would change' : 'Changed'} ${changes.length} file edit(s).`,
);
