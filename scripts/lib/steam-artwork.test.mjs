import assert from 'node:assert/strict';
import test from 'node:test';
import { isPortraitArtwork, steamPortraitUrls } from './steam-artwork.mjs';

test('resolves current relative Steam asset formats and prioritizes high-resolution portraits', () => {
  assert.deepEqual(
    steamPortraitUrls({
      asset_url_format: 'steam/apps/3764200/${FILENAME}?t=1779840172',
      library_capsule: 'portrait-hash/library_capsule.jpg',
      library_capsule_2x: 'portrait-hash/library_capsule_2x.jpg',
      header: 'different-hash/header.jpg',
    }),
    [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3764200/portrait-hash/library_capsule_2x.jpg?t=1779840172',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3764200/portrait-hash/library_capsule.jpg?t=1779840172',
    ],
  );
});

test('retains absolute legacy formats and handles missing portrait metadata', () => {
  assert.deepEqual(
    steamPortraitUrls({
      asset_url_format: 'https://cdn.example/steam/{FILENAME}',
      library_capsule: 'old/library_600x900.jpg',
    }),
    ['https://cdn.example/steam/old/library_600x900.jpg'],
  );
  assert.deepEqual(steamPortraitUrls({ header: 'header.jpg' }), []);
});

test('rejects store banners instead of treating them as tall case artwork', () => {
  assert.equal(isPortraitArtwork({ width: 460, height: 215 }), false);
  assert.equal(isPortraitArtwork({ width: 600, height: 900 }), true);
  assert.equal(isPortraitArtwork({ width: 900, height: 900 }), false);
  assert.equal(isPortraitArtwork(), false);
});
