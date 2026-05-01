import { wrapText } from '../utils';

// Squarified — the layout itself is a Bruls/Huijsmans/van Wijk (2000)
// squarified treemap. Repo metadata is treated as a weighted set; the
// algorithm packs them as nested rectangles with aspect ratios as close
// to 1 as possible. Each tile carries one piece of information.
export const squarified = (ctx, width, height, scale, data) => {
  const {
    primaryColor,
    secondaryColor,
    bgColor,
    repoOwner,
    repoName,
    description,
    language,
    stars,
    forks,
    supportUrl,
  } = data;

  const ink = '#0E0E10';
  const inkSoft = 'rgba(14,14,16,0.62)';
  const grout = '#0E0E10';
  const card = '#F4EFE8';

  const sans = '"Inter", "Helvetica Neue", system-ui, sans-serif';
  const serif = '"Cormorant Garamond", "EB Garamond", Georgia, serif';
  const mono = '"JetBrains Mono", "Geist Mono", ui-monospace, monospace';

  // 1. Canvas — dark grout so the tile gaps read as clean lines.
  ctx.fillStyle = grout;
  ctx.fillRect(0, 0, width, height);

  // 2. Build the weighted tile set. Largest weight = title, then a
  //    descending tail. Skipping a slot drops it from the layout entirely.
  const accent = primaryColor || '#C8FF3D';
  const accent2 = secondaryColor || '#7EC8E3';
  const ground = bgColor || '#1F1B16';

  const items = [
    { id: 'title', weight: 56, fill: accent, ink, render: drawTitle },
    {
      id: 'desc',
      weight: 28,
      fill: card,
      ink,
      render: drawDescription,
      skip: !description,
    },
    {
      id: 'stars',
      weight: 12,
      fill: ground,
      ink: card,
      render: makeStat('STARS', String(stars ?? '')),
      skip: stars === undefined || stars === null || stars === '',
    },
    {
      id: 'forks',
      weight: 9,
      fill: accent2,
      ink,
      render: makeStat('FORKS', String(forks ?? '')),
      skip: forks === undefined || forks === null || forks === '',
    },
    {
      id: 'language',
      weight: 7,
      fill: card,
      ink,
      render: makeStat('LANG', String(language ?? '').toUpperCase()),
      skip: !language,
    },
    {
      id: 'owner',
      weight: 6,
      fill: ground,
      ink: card,
      render: drawOwner,
    },
    { id: 'mark', weight: 4, fill: accent, ink, render: drawMark },
  ].filter((it) => !it.skip);

  // Re-normalise weights to the canvas area so the treemap fills exactly.
  const totalWeight = items.reduce((s, it) => s + it.weight, 0);
  const totalArea = width * height;
  for (const it of items) it.area = (it.weight / totalWeight) * totalArea;

  // 3. Run the squarified algorithm. Returns a list of {item, x,y,w,h}.
  const tiles = squarify(items, { x: 0, y: 0, w: width, h: height });

  // 4. Paint each tile with a small inset (grout gap) and dispatch to its
  //    renderer for the typography pass.
  const gap = 4 * scale;
  for (const t of tiles) {
    const x = t.x + gap;
    const y = t.y + gap;
    const w = Math.max(0, t.w - gap * 2);
    const h = Math.max(0, t.h - gap * 2);
    ctx.fillStyle = t.item.fill;
    ctx.fillRect(x, y, w, h);
    t.item.render(ctx, { x, y, w, h }, scale, {
      ink: t.item.ink,
      inkSoft,
      sans,
      serif,
      mono,
      data,
    });
  }

  // 5. Tiny attribution strip — keeps the academic origin visible without
  //    competing with the layout.
  ctx.fillStyle = 'rgba(244,239,232,0.55)';
  ctx.font = `500 ${11 * scale}px ${mono}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(
    supportUrl
      ? `${supportUrl}  ·  squarified treemap, bruls et al. 2000`
      : 'squarified treemap — bruls, huijsmans & van wijk, 2000',
    width - 14 * scale,
    height - 10 * scale,
  );
  ctx.textAlign = 'left';
};

// ─── tile renderers ───────────────────────────────────────────────────────

function drawTitle(ctx, r, scale, env) {
  const pad = 28 * scale;
  ctx.fillStyle = env.ink;
  ctx.textBaseline = 'alphabetic';

  ctx.font = `600 ${11 * scale}px ${env.mono}`;
  letterSpaced(ctx, 'REPOSITORY', r.x + pad, r.y + pad + 8 * scale, 2.6 * scale);

  const name = env.data.repoName || '';
  const size = pickFontSize(ctx, name, r.w - pad * 2, [
    96, 84, 72, 60, 50, 40, 32,
  ].map((n) => n * scale), `700 SIZEpx ${env.sans}`);
  ctx.font = `700 ${size}px ${env.sans}`;
  ctx.fillText(name, r.x + pad, r.y + r.h * 0.62);

  ctx.font = `italic 400 ${20 * scale}px ${env.serif}`;
  ctx.fillText(
    `@${(env.data.repoOwner || '').toLowerCase()}`,
    r.x + pad,
    r.y + r.h * 0.62 + 32 * scale,
  );
}

function drawDescription(ctx, r, scale, env) {
  if (!env.data.description) return;
  const pad = 22 * scale;
  ctx.fillStyle = env.ink;
  ctx.textBaseline = 'alphabetic';

  ctx.font = `600 ${10 * scale}px ${env.mono}`;
  letterSpaced(ctx, 'ABSTRACT', r.x + pad, r.y + pad + 6 * scale, 2.4 * scale);

  ctx.font = `400 ${Math.min(24, Math.max(14, r.h / 9)) * scale}px ${env.serif}`;
  wrapText(
    ctx,
    env.data.description,
    r.x + pad,
    r.y + pad + 32 * scale,
    r.w - pad * 2,
    Math.min(28, Math.max(18, r.h / 8)) * scale,
  );
}

function makeStat(label, value) {
  return (ctx, r, scale, env) => {
    const pad = 18 * scale;
    ctx.fillStyle = env.ink;
    ctx.textBaseline = 'alphabetic';
    ctx.font = `600 ${11 * scale}px ${env.mono}`;
    letterSpaced(ctx, label, r.x + pad, r.y + pad + 6 * scale, 2.4 * scale);

    const size = pickFontSize(
      ctx,
      value,
      r.w - pad * 2,
      [72, 60, 48, 40, 32, 24, 20].map((n) => n * scale),
      `700 SIZEpx ${env.sans}`,
    );
    ctx.font = `700 ${size}px ${env.sans}`;
    ctx.fillText(value, r.x + pad, r.y + r.h - pad);
  };
}

function drawOwner(ctx, r, scale, env) {
  const pad = 16 * scale;
  ctx.fillStyle = env.ink;
  ctx.textBaseline = 'alphabetic';
  ctx.font = `600 ${10 * scale}px ${env.mono}`;
  letterSpaced(ctx, 'OWNER', r.x + pad, r.y + pad + 4 * scale, 2.2 * scale);

  const owner = (env.data.repoOwner || '').toLowerCase();
  const size = pickFontSize(ctx, owner, r.w - pad * 2, [
    44, 36, 28, 22, 18, 14,
  ].map((n) => n * scale), `italic 400 SIZEpx ${env.serif}`);
  ctx.font = `italic 400 ${size}px ${env.serif}`;
  ctx.fillText(owner, r.x + pad, r.y + r.h - pad);
}

function drawMark(ctx, r, scale, env) {
  // Tiny solid square — an "emblem" tile, no text. Just a single dot.
  ctx.fillStyle = env.ink;
  const dot = Math.min(r.w, r.h) * 0.18;
  ctx.beginPath();
  ctx.arc(r.x + r.w / 2, r.y + r.h / 2, dot, 0, Math.PI * 2);
  ctx.fill();
}

// ─── squarified treemap ───────────────────────────────────────────────────

function squarify(items, rect) {
  // Items are dispatched with their `area` already normalised to the rect.
  const queue = items.slice().sort((a, b) => b.area - a.area);
  const placed = [];
  let R = { ...rect };
  let row = [];

  const shorter = (R) => Math.min(R.w, R.h);

  const push = (it) => {
    const trial = [...row, it];
    if (row.length === 0 || worst(trial, shorter(R)) <= worst(row, shorter(R))) {
      row = trial;
      return true;
    }
    return false;
  };

  while (queue.length) {
    const next = queue.shift();
    if (push(next)) continue;

    // Lay out current row, then start a new one with `next`.
    const laid = layoutRow(row, R);
    placed.push(...laid.tiles);
    R = laid.remaining;
    row = [next];
  }
  if (row.length) {
    const laid = layoutRow(row, R);
    placed.push(...laid.tiles);
  }
  return placed;
}

function worst(row, side) {
  if (row.length === 0) return Infinity;
  const s = row.reduce((acc, it) => acc + it.area, 0);
  let max = -Infinity;
  let min = Infinity;
  for (const it of row) {
    if (it.area > max) max = it.area;
    if (it.area < min) min = it.area;
  }
  // Bruls et al., equation (1).
  return Math.max(
    (side * side * max) / (s * s),
    (s * s) / (side * side * min),
  );
}

function layoutRow(row, R) {
  const s = row.reduce((acc, it) => acc + it.area, 0);
  const tiles = [];
  if (R.w >= R.h) {
    // Stack the row vertically along the left edge; strip width = s / R.h.
    const stripW = s / R.h;
    let y = R.y;
    for (const it of row) {
      const tileH = (it.area / s) * R.h;
      tiles.push({ item: it, x: R.x, y, w: stripW, h: tileH });
      y += tileH;
    }
    return {
      tiles,
      remaining: { x: R.x + stripW, y: R.y, w: R.w - stripW, h: R.h },
    };
  }
  // Otherwise stack horizontally along the top edge.
  const stripH = s / R.w;
  let x = R.x;
  for (const it of row) {
    const tileW = (it.area / s) * R.w;
    tiles.push({ item: it, x, y: R.y, w: tileW, h: stripH });
    x += tileW;
  }
  return {
    tiles,
    remaining: { x: R.x, y: R.y + stripH, w: R.w, h: R.h - stripH },
  };
}

// ─── helpers ──────────────────────────────────────────────────────────────

function letterSpaced(ctx, text, x, y, spacing) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
  return cx - x;
}

function pickFontSize(ctx, text, maxWidth, ladder, fontTemplate) {
  for (const size of ladder) {
    ctx.font = fontTemplate.replace('SIZE', String(size));
    if (ctx.measureText(text).width <= maxWidth) return size;
  }
  return ladder[ladder.length - 1];
}

