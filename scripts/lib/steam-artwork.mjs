const STEAM_ARTWORK_ROOT =
  'https://shared.akamai.steamstatic.com/store_item_assets/';

/** Steam's library artwork has independent hashes and a literal placeholder. */
export function steamPortraitUrls(assets = {}) {
  if (!assets.asset_url_format) return [];
  return [assets.library_capsule_2x, assets.library_capsule]
    .filter(Boolean)
    .map(
      (filename) =>
        new URL(
          assets.asset_url_format.replace(/\$?\{FILENAME\}/g, filename),
          STEAM_ARTWORK_ROOT,
        ).href,
    );
}

export function isPortraitArtwork({ width = 0, height = 0 } = {}) {
  return width > 0 && height > width;
}
