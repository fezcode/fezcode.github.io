// Node and link painters for the knowledge graph's two looks:
// "paper" (risograph inks on cool paper) and "space" (a star chart with effects).

const FONT = "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif";

export const radiusOf = (node) =>
  node.group === 'tag'
    ? 1.6 + Math.sqrt(node.val) * 0.9
    : node.group === 'project'
      ? 5
      : 4;

const hash = (str) => {
  let n = 0;
  for (let i = 0; i < str.length; i++) n = (n * 31 + str.charCodeAt(i)) >>> 0;
  return n;
};

const hexToRgb = (hex) => {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
};
const rgba = (hex, a) => `rgba(${hexToRgb(hex).join(',')},${a})`;

const shouldLabel = (node, scale, { lit, isLit, isFocus, isSelected }) =>
  isFocus ||
  isSelected ||
  (lit && isLit && scale > 0.9) ||
  (!lit &&
    ((node.group === 'tag' && node.val >= 6 && scale > 0.7) ||
      (node.group === 'tag' && scale > 1.6) ||
      scale > 2.6));

const drawLabel = (ctx, node, r, scale, isFocus, { fill, halo }) => {
  const px = (isFocus ? 15 : 12) / scale;
  const weight = node.group === 'tag' || isFocus ? 700 : 500;
  ctx.font = `${weight} ${px}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const text =
    node.name.length > 34 && !isFocus ? `${node.name.slice(0, 32)}…` : node.name;
  const y = node.y + r + 3 / scale;
  ctx.lineJoin = 'round';
  ctx.lineWidth = 4 / scale;
  ctx.strokeStyle = halo;
  ctx.strokeText(text, node.x, y);
  ctx.fillStyle = fill;
  ctx.fillText(text, node.x, y);
};

// ---------------------------------------------------------------- paper

const PAPER_INK = {
  post: '#ff48b0',
  log: '#ff6c2f',
  app: '#00a95c',
  project: '#0078bf',
  tag: '#000000',
};

const paintPaper = (node, ctx, scale, s) => {
  const r = radiusOf(node);
  ctx.save();
  ctx.globalAlpha = s.isLit ? 1 : 0.13;

  if (s.isSelected || s.isFocus) {
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = '#ffe800';
    ctx.beginPath();
    ctx.arc(node.x, node.y, r * 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  if (node.group === 'tag') {
    ctx.fillStyle = PAPER_INK.tag;
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // two plates, a touch out of register
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = PAPER_INK[node.group];
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = Math.max(0.6, 1.3 / scale);
    ctx.beginPath();
    ctx.arc(node.x + r * 0.22, node.y - r * 0.16, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (shouldLabel(node, scale, s))
    drawLabel(ctx, node, r, scale, s.isFocus, { fill: '#000', halo: '#e9ecf2' });
  ctx.restore();
};

// ---------------------------------------------------------------- space

const SPACE_INK = {
  post: '#ff4fd8',
  log: '#a98bff',
  app: '#2ee6ff',
  project: '#ffc53d',
  tag: '#c9ccff',
};

const glowCache = new Map();
const glowSprite = (hex) => {
  if (glowCache.has(hex)) return glowCache.get(hex);
  const size = 96;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.12, rgba(hex, 0.95));
  grad.addColorStop(0.35, rgba(hex, 0.32));
  grad.addColorStop(0.65, rgba(hex, 0.08));
  grad.addColorStop(1, rgba(hex, 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  glowCache.set(hex, c);
  return c;
};

const paintSpace = (node, ctx, scale, s) => {
  const r = radiusOf(node);
  const color = SPACE_INK[node.group];
  const seed = node.__seed ?? (node.__seed = hash(node.id));
  const t = s.t;
  const twinkle =
    s.reduced ? 1 : 0.8 + 0.2 * Math.sin(t * (0.0012 + (seed % 7) * 0.0003) + seed);

  ctx.save();
  ctx.globalAlpha = s.isLit ? 1 : 0.16;
  ctx.globalCompositeOperation = 'lighter';

  // halo
  const R = r * (node.group === 'tag' ? 3.4 : 4.6) * twinkle * (s.isFocus ? 1.35 : 1);
  ctx.drawImage(glowSprite(color), node.x - R, node.y - R, R * 2, R * 2);

  // diffraction spikes on projects and whatever has focus
  if (node.group === 'project' || s.isFocus || s.isSelected) {
    const len = r * (s.isFocus ? 7 : 4.5) * twinkle;
    ctx.strokeStyle = rgba(color, 0.75);
    ctx.lineWidth = Math.max(0.25, 0.9 / scale);
    ctx.beginPath();
    ctx.moveTo(node.x - len, node.y);
    ctx.lineTo(node.x + len, node.y);
    ctx.moveTo(node.x, node.y - len);
    ctx.lineTo(node.x, node.y + len);
    ctx.stroke();
  }

  // core
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = node.group === 'tag' ? '#eef0ff' : '#ffffff';
  ctx.beginPath();
  ctx.arc(node.x, node.y, r * (node.group === 'tag' ? 0.55 : 0.5), 0, Math.PI * 2);
  ctx.fill();

  if (s.isSelected) {
    ctx.globalCompositeOperation = 'lighter';
    // pulse rings
    if (!s.reduced) {
      for (let i = 0; i < 2; i++) {
        const p = ((t / 1700 + i / 2) % 1 + 1) % 1;
        ctx.strokeStyle = rgba(color, (1 - p) * 0.8);
        ctx.lineWidth = Math.max(0.3, 1.4 / scale) * (1 - p * 0.6);
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * (1.6 + p * 6), 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    // rotating orbit with a moon
    const orbit = r * 3.2;
    ctx.strokeStyle = rgba(color, 0.55);
    ctx.lineWidth = Math.max(0.25, 0.8 / scale);
    ctx.setLineDash([2.5 / scale, 3.5 / scale]);
    ctx.lineDashOffset = s.reduced ? 0 : -t * 0.004;
    ctx.beginPath();
    ctx.arc(node.x, node.y, orbit, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    const a = s.reduced ? -0.8 : t * 0.0015;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(node.x + Math.cos(a) * orbit, node.y + Math.sin(a) * orbit, Math.max(0.6, 1.8 / scale), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';

  if (shouldLabel(node, scale, s))
    drawLabel(ctx, node, r, scale, s.isFocus, {
      fill: s.isFocus ? '#ffffff' : '#dcdcff',
      halo: 'rgba(6,6,26,0.85)',
    });
  ctx.restore();
};

// ---------------------------------------------------------------- registry

export const GRAPH_THEMES = {
  paper: {
    id: 'paper',
    label: 'Paper',
    ink: PAPER_INK,
    paint: paintPaper,
    link: (touches, focused) =>
      !focused ? 'rgba(0,0,0,0.13)' : touches ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.04)',
    particles: () => 0,
  },
  space: {
    id: 'space',
    label: 'Space',
    ink: SPACE_INK,
    paint: paintSpace,
    link: (touches, focused) =>
      !focused
        ? 'rgba(170,175,255,0.13)'
        : touches
          ? 'rgba(130,235,255,0.8)'
          : 'rgba(170,175,255,0.035)',
    // light travelling along lit links; a few ambient drifters otherwise
    particles: (touches, focused, link) => {
      if (focused) return touches ? 3 : 0;
      const key = link.__seed ?? (link.__seed = hash(`${link.source.id || link.source}>${link.target.id || link.target}`));
      return key % 23 === 0 ? 1 : 0;
    },
  },
};
