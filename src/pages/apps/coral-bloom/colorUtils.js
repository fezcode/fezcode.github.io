export function normalizeHex(value) {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(/^#?([a-f\d]{3}|[a-f\d]{6})$/i);
  if (!match) return null;
  const digits = match[1].toLowerCase();
  return `#${digits.length === 3 ? [...digits].map((digit) => digit + digit).join('') : digits}`;
}

export function hexToHsv(value, fallbackHue = 0) {
  const hex = normalizeHex(value) || '#000000';
  const channels = [1, 3, 5].map(
    (index) => parseInt(hex.slice(index, index + 2), 16) / 255,
  );
  const [r, g, b] = channels;
  const high = Math.max(...channels);
  const low = Math.min(...channels);
  const delta = high - low;
  let h = fallbackHue;
  if (delta) {
    if (high === r) h = ((g - b) / delta) % 6;
    else if (high === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s: high ? (delta / high) * 100 : 0, v: high * 100 };
}

export function hsvToHex({ h, s, v }) {
  const hue = (((h % 360) + 360) % 360) / 60;
  const saturation = Math.max(0, Math.min(100, s)) / 100;
  const brightness = Math.max(0, Math.min(100, v)) / 100;
  const chroma = brightness * saturation;
  const second = chroma * (1 - Math.abs((hue % 2) - 1));
  const channels = [
    [chroma, second, 0],
    [second, chroma, 0],
    [0, chroma, second],
    [0, second, chroma],
    [second, 0, chroma],
    [chroma, 0, second],
  ][Math.floor(hue)];
  return `#${channels
    .map((channel) =>
      Math.round((channel + brightness - chroma) * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}
