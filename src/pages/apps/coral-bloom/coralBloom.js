// Curved ribbon bundles: every edge, groove and placement comes from the seed.
// Coordinates live in a resolution-independent 1000-unit-wide composition.
import { normalizeHex } from './colorUtils';

export const PALETTES = [
  {
    id: 'coral',
    name: 'Living coral',
    background: '#222326',
    shadow: '#33282e',
    fold: '#713c48',
    pigment: '#ef626d',
    tip: '#ff8186',
    light: '#ffb0a5',
  },
  {
    id: 'pearl',
    name: 'Moon pearl',
    background: '#20252b',
    shadow: '#303840',
    fold: '#6d7c89',
    pigment: '#c1ced5',
    tip: '#edf0e6',
    light: '#ffffff',
  },
  {
    id: 'kelp',
    name: 'Sea glass',
    background: '#14292b',
    shadow: '#233c3b',
    fold: '#3c7069',
    pigment: '#6bb6a1',
    tip: '#b2ddbc',
    light: '#dcf4cf',
  },
  {
    id: 'iris',
    name: 'Deep iris',
    background: '#24202f',
    shadow: '#392e48',
    fold: '#71527e',
    pigment: '#bb83bd',
    tip: '#eab0d0',
    light: '#ffe0eb',
  },
];

export const FORMATS = [
  { id: 'portrait', name: 'Portrait', width: 1200, height: 1800 },
  { id: 'square', name: 'Square', width: 1600, height: 1600 },
  { id: 'landscape', name: 'Landscape', width: 1800, height: 1200 },
];

export const DEFAULT_SETTINGS = {
  seed: 'coral-140',
  density: 70,
  curl: 65,
  ribs: 38,
  relief: 75,
  grain: 18,
  palette: 'coral',
  colors: null,
  format: 'portrait',
};

export function resolvePalette(settings) {
  const base =
    PALETTES.find((palette) => palette.id === settings.palette) || PALETTES[0];
  const colors = {};
  for (const key of ['pigment', 'tip', 'fold', 'background']) {
    const hex = normalizeHex(settings.colors?.[key]);
    if (hex) colors[key] = hex;
  }
  const palette = { ...base, ...colors };
  if (colors.fold) {
    // Keep the deep roots in the same pigment family as the chosen folds.
    palette.shadow = `#${colors.fold
      .slice(1)
      .match(/.{2}/g)
      .map((channel) =>
        Math.round(parseInt(channel, 16) * 0.45)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')}`;
  }
  return palette;
}

function seededRandom(seed) {
  let state = 2166136261;
  for (const character of String(seed)) {
    state = Math.imul(state ^ character.charCodeAt(0), 16777619);
  }
  return () => {
    state += 0x6d2b79f5;
    let n = Math.imul(state ^ (state >>> 15), state | 1);
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

export function createComposition(settings, aspect = 1.5) {
  const random = seededRandom(settings.seed);
  const height = 1000 * aspect;
  const spacing = 265 - settings.density * 1.05;
  const columns = Math.ceil(1000 / spacing) + 1;
  const rows = Math.ceil(height / spacing) + 1;
  const fans = [];

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const y = (row + (random() - 0.5) * 0.65) * spacing;
      const depth = Math.max(0, Math.min(1, y / height));
      fans.push({
        x:
          (column - 0.3 + (row % 2) * 0.45 + (random() - 0.5) * 0.65) * spacing,
        y,
        length: spacing * (0.98 + random() * 0.48) * (0.78 + depth * 0.42),
        rotation: random() * Math.PI * 2,
        spread: 2.45 + random() * 0.8,
        bend: (random() - 0.5) * 1.2 * (settings.curl / 100),
        curl: (random() - 0.5) * 2.6 * (settings.curl / 100),
        phase: random() * Math.PI * 2,
        lobes: 3 + Math.floor(random() * 2),
        ribs: Math.round(settings.ribs * (0.85 + random() * 0.3)),
        shade: 0.9 + random() * 0.1,
      });
    }
  }

  // Back-to-front depth creates small distant fans and larger foreground folds.
  return fans.sort((a, b) => a.y - b.y);
}

function pointOnRib(fan, angle, t) {
  const radius =
    fan.length *
    (0.86 +
      Math.sin(angle * fan.lobes + fan.phase) * 0.18 +
      Math.cos(angle * 4.5 + fan.phase) * 0.035);
  return {
    x:
      radius *
      (Math.sin(angle) * Math.pow(t, 1.85) +
        fan.bend * (t - 0.6 * t * t) +
        fan.curl * Math.sin(Math.PI * t) * t * 0.28),
    y: radius * (-t + (1 - Math.cos(angle)) * t * t * 0.92),
  };
}

function ribbonPoints(fan, angle, step) {
  const points = [];
  for (let j = 0; j <= 26; j++) {
    const t = j / 26;
    const point = pointOnRib(fan, angle, t);
    const before = pointOnRib(fan, angle, Math.max(0, t - 0.002));
    const after = pointOnRib(fan, angle, Math.min(1, t + 0.002));
    const dx = after.x - before.x;
    const dy = after.y - before.y;
    const distance = Math.hypot(dx, dy) || 1;
    const nx = -dy / distance;
    const ny = dx / distance;
    const neighbor = pointOnRib(fan, angle + step, t);
    // Project spacing onto the normal so the ribs meet as the fan bends.
    const width = Math.abs(
      (neighbor.x - point.x) * nx + (neighbor.y - point.y) * ny,
    );
    points.push({ ...point, nx, ny, width: Math.max(0.13, width * 0.51) });
  }
  return points;
}

function traceRibbon(ctx, points, scale = 1, offset = 0) {
  ctx.beginPath();
  points.forEach((p, index) => {
    const width = p.width * (scale + offset);
    const x = p.x + p.nx * width;
    const y = p.y + p.ny * width;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  const tip = points[points.length - 1];
  const centerX = tip.x + tip.nx * tip.width * offset;
  const centerY = tip.y + tip.ny * tip.width * offset;
  const normalAngle = Math.atan2(tip.ny, tip.nx);
  ctx.arc(
    centerX,
    centerY,
    tip.width * scale,
    normalAngle,
    normalAngle - Math.PI,
    true,
  );
  for (let j = points.length - 1; j >= 0; j--) {
    const p = points[j];
    const width = p.width * (offset - scale);
    ctx.lineTo(p.x + p.nx * width, p.y + p.ny * width);
  }
  ctx.closePath();
}

function drawFan(ctx, fan, palette, relief) {
  ctx.save();
  ctx.translate(fan.x, fan.y);
  ctx.rotate(fan.rotation);
  ctx.globalAlpha = fan.shade;
  const step = fan.spread / (fan.ribs - 1);
  const bundles = Array.from({ length: fan.ribs }, (_, index) =>
    ribbonPoints(fan, -fan.spread / 2 + index * step, step),
  );

  // A membrane under the ribs keeps the shadowed inner fan continuous.
  ctx.beginPath();
  bundles[0].forEach((p, index) => {
    if (index === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  bundles.forEach((rib) => {
    const tip = rib[rib.length - 1];
    ctx.lineTo(tip.x, tip.y);
  });
  [...bundles[bundles.length - 1]]
    .reverse()
    .forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.closePath();
  const membrane = ctx.createLinearGradient(
    0,
    0,
    fan.bend * fan.length * 0.4,
    -fan.length,
  );
  membrane.addColorStop(0, palette.shadow);
  membrane.addColorStop(0.45, palette.fold);
  membrane.addColorStop(1, palette.pigment);
  ctx.fillStyle = membrane;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.30)';
  ctx.shadowBlur = fan.length * 0.04;
  ctx.shadowOffsetY = fan.length * 0.018;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  for (const points of bundles) {
    const tip = points[points.length - 1];
    const color = ctx.createLinearGradient(0, 0, tip.x, tip.y);
    color.addColorStop(0, palette.shadow);
    color.addColorStop(0.22, palette.fold);
    color.addColorStop(0.61, palette.pigment);
    color.addColorStop(1, palette.tip);
    traceRibbon(ctx, points);
    ctx.fillStyle = color;
    ctx.fill();

    // A broad soft groove and an off-centre ridge light give each rib relief.
    const shade = ctx.createLinearGradient(0, 0, tip.x, tip.y);
    shade.addColorStop(0, `rgba(12, 14, 22, ${relief * 0.008})`);
    shade.addColorStop(0.42, `rgba(18, 15, 26, ${relief * 0.0065})`);
    shade.addColorStop(0.88, 'rgba(18, 15, 26, 0)');
    traceRibbon(ctx, points, 0.57, 0.4);
    ctx.fillStyle = shade;
    ctx.fill();

    const highlight = ctx.createLinearGradient(0, 0, tip.x, tip.y);
    highlight.addColorStop(0, 'rgba(255, 255, 255, 0)');
    highlight.addColorStop(0.5, `rgba(255, 222, 211, ${relief * 0.0018})`);
    highlight.addColorStop(1, `rgba(255, 222, 211, ${relief * 0.001})`);
    traceRibbon(ctx, points, 0.16, -0.4);
    ctx.fillStyle = highlight;
    ctx.fill();
  }

  // Fine curved stems continue the root without outlining the fan.
  ctx.beginPath();
  ctx.moveTo(-fan.bend * fan.length * 0.08, fan.length * 0.22);
  ctx.quadraticCurveTo(-fan.bend * fan.length * 0.04, fan.length * 0.06, 0, 0);
  ctx.lineWidth = Math.max(0.5, fan.length * 0.004);
  ctx.strokeStyle = palette.fold;
  ctx.stroke();
  ctx.restore();
}

function addGrain(ctx, width, height, amount, seed) {
  if (!amount) return;
  const random = seededRandom(`${seed}-grain`);
  const image = ctx.getImageData(0, 0, width, height);
  for (let i = 0; i < image.data.length; i += 4) {
    const noise = (random() - 0.5) * amount * 0.48;
    image.data[i] += noise;
    image.data[i + 1] += noise;
    image.data[i + 2] += noise;
  }
  ctx.putImageData(image, 0, 0);
}

export function renderCoralBloom(canvas, settings) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('This browser could not create a drawing canvas.');
  const palette = resolvePalette(settings);
  const { width, height } = canvas;
  ctx.resetTransform();
  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, width, height);
  ctx.save();
  ctx.scale(width / 1000, width / 1000);
  const fans = createComposition(settings, height / width);
  for (const fan of fans) drawFan(ctx, fan, palette, settings.relief);
  ctx.restore();
  addGrain(ctx, width, height, settings.grain, settings.seed);
  return fans.length;
}
