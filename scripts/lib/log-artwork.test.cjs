const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const piml = require('piml');
const { setLogArtwork } = require('./log-artwork.cjs');

function fixture(t, text) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'log-artwork-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const file = path.join(directory, 'logs.piml');
  fs.writeFileSync(file, text);
  return file;
}

const content = `(logs)
  > (item)
    (slug) first
    (title) A title # editorial note
    (tags)
      > action
      > cover art
    (image) https://i.ytimg.com/vi/example/hqdefault.jpg
    (description)
      A multiline description.

      (image) This is description text, not metadata.

  > (item)
    (slug) second
    (title) Another title
    (description) Keep  two spaces and # an inline comment
`;

test('patches only artwork and preserves unrelated text and Windows newlines', (t) => {
  const text = content.replaceAll('\n', '\r\n');
  const file = fixture(t, text);
  const imageSource = {
    provider: 'Publisher',
    page: 'https://example.com/a',
    url: 'https://example.com/a.jpg',
    title: 'Poster # 1',
    width: 900,
    height: 1350,
  };
  assert.equal(
    setLogArtwork(file, 'first', { image: '/images/art.webp', imageSource }),
    true,
  );
  const result = fs.readFileSync(file, 'utf8');
  assert.ok(result.includes('    (title) A title # editorial note\r\n'));
  assert.ok(
    result.includes('    (tags)\r\n      > action\r\n      > cover art\r\n'),
  );
  assert.ok(
    result.includes('      (image) This is description text, not metadata.'),
  );
  assert.ok(
    result.endsWith(
      text.slice(text.indexOf('  > (item)\r\n    (slug) second')),
    ),
  );
  assert.equal(result.replaceAll('\r\n', '').includes('\n'), false);
  assert.deepEqual(piml.parse(result).logs[0].imageSource, imageSource);
  assert.equal(
    setLogArtwork(file, 'first', { image: '/images/art.webp', imageSource }),
    false,
  );
  assert.equal(fs.readFileSync(file, 'utf8'), result);
});

test('fresh reads retain edits made by other async workers and replace nested sources', async (t) => {
  const file = fixture(t, content);
  await Promise.all([
    Promise.resolve().then(() =>
      setLogArtwork(file, 'first', {
        image: '/first.webp',
        imageSource: { provider: 'First', page: 'https://example.com/first' },
      }),
    ),
    Promise.resolve().then(() =>
      setLogArtwork(file, 'second', {
        image: '/second.webp',
        imageSource: { provider: 'Second' },
      }),
    ),
  ]);
  setLogArtwork(file, 'first', {
    image: '/new.webp',
    imageSource: { provider: 'Replacement', width: 800 },
  });
  const entries = piml.parse(fs.readFileSync(file, 'utf8')).logs;
  assert.equal(entries[0].image, '/new.webp');
  assert.deepEqual(entries[0].imageSource, {
    provider: 'Replacement',
    width: 800,
  });
  assert.equal(entries[1].image, '/second.webp');
  assert.deepEqual(entries[1].imageSource, { provider: 'Second' });
});

test('retains a source when omitted and keeps a missing final newline', (t) => {
  const file = fixture(
    t,
    '(logs)\n  > (item)\n    (slug) a\n    (imageSource)\n      (provider) Author\n    (title) Original',
  );
  setLogArtwork(file, 'a', { image: '/a.webp' });
  const result = fs.readFileSync(file, 'utf8');
  assert.equal(result.endsWith('\n'), false);
  assert.deepEqual(piml.parse(result).logs[0].imageSource, {
    provider: 'Author',
  });
});

test('retains the full provenance of an alternative image behind an authored override', (t) => {
  const file = fixture(t, content);
  const image = '/images/logs/games/authored.webp';
  const imageSource = {
    provider: 'Existing authored image',
    url: image,
    alternative: {
      image: '/images/discovery/art/game/downloaded.webp',
      provider: 'Steam store artwork',
      page: 'https://store.steampowered.com/app/1/',
      url: 'https://example.com/library_600x900.jpg',
      title: 'Downloaded store edition',
      width: 600,
      height: 900,
    },
  };
  setLogArtwork(file, 'first', { image, imageSource });
  assert.deepEqual(
    piml.parse(fs.readFileSync(file, 'utf8')).logs[0].imageSource,
    imageSource,
  );
  assert.equal(setLogArtwork(file, 'first', { image, imageSource }), false);
  assert.throws(
    () =>
      setLogArtwork(file, 'first', {
        image,
        imageSource: { alternative: { provider: 'Missing image' } },
      }),
    /alternative.image/,
  );
});

test('rejects invalid input, duplicate slugs and invalid existing PIML without writing', (t) => {
  for (const text of [
    content,
    content.replace('(slug) second', '(slug) first'),
    content.replace('(tags)', '(title) Duplicate'),
  ]) {
    const file = fixture(t, text);
    if (text === content) {
      assert.throws(
        () => setLogArtwork(file, 'missing', { image: '/a.webp' }),
        /expected one log/,
      );
      assert.throws(
        () =>
          setLogArtwork(file, 'first', {
            image: '/a.webp',
            imageSource: { width: NaN },
          }),
        /positive number/,
      );
    } else {
      assert.throws(() => setLogArtwork(file, 'first', { image: '/a.webp' }));
    }
    assert.equal(fs.readFileSync(file, 'utf8'), text);
  }
});
