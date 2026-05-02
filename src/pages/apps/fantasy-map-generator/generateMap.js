import { random, noise2D, fbm, ridgedFbm } from './noise';
import { computeMask, biomeOf, pickName, pickFrom } from './world';

const REALM_COLORS = ['#7A1D1D', '#1D3E5A', '#4A5C2E', '#5C3E7A', '#7A5E1D', '#2E5A5A'];

// Single-pass renderer. Uses overlapping circles (rather than per-cell rects)
// for the land mass so coastlines read as soft, hand-printed shapes instead of
// pixelated grids.
export function generateMap(ctx, width, height, cfg) {
  const {
    seed, nameSeed = cfg.seed, palette, presetCfg, bank, worldTitle,
    waterLevel, mountains, hills, climate, roughness,
    forestDensity, swampiness,
    cityCount, castleCount, villageCount, capitalCount,
    ruinCount, towerCount, monasteryCount, stoneCount, volcanoCount, lighthouseCount,
    shipCount, krakenCount, wreckCount, seaMonsters, lakeCount, riverCount,
    realmCount, showBorders, shadeRealms, showRoads,
    showCompass, showCartouche, showLegend, showScale, showGrid,
    showLabels = true,
  } = cfg;

  const used = new Set();

  // ── Paper background + grain
  ctx.fillStyle = palette.paper;
  ctx.fillRect(0, 0, width, height);
  const grainCount = Math.floor(width * height * 0.010);
  for (let i = 0; i < grainCount; i++) {
    const x = random(seed + i) * width;
    const y = random(seed + i + 0.13) * height;
    ctx.fillStyle = random(i) > 0.5 ? 'rgba(0,0,0,0.022)' : 'rgba(255,255,255,0.025)';
    ctx.fillRect(x, y, 2, 2);
  }

  // ── Heightmap & moisture (16:10 friendly grid)
  const w = 240, h = 150;
  const cellW = width / w, cellH = height / h;
  const cellR = Math.max(cellW, cellH);
  const heightMap = new Float32Array(w * h);
  const moistureMap = new Float32Array(w * h);
  const scale = 3.2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = (x / w) * scale;
      const ny = (y / h) * scale;
      const mask = computeMask(presetCfg.mask, x, y, w, h, seed);
      let elev = fbm(nx, ny, seed, 5);
      elev = (elev + mask) * 0.5;
      const ridge = ridgedFbm(nx, ny, seed + 100, 4);
      elev = elev * (1 - mountains * 0.35) + ridge * mountains * 0.45 * (1 + roughness * 0.3);
      elev += presetCfg.mountAdj * 0.3;
      if (elev > 0.55 && elev < 0.65) elev = 0.6 + (elev - 0.6) * 0.3;
      heightMap[y * w + x] = elev;
      moistureMap[y * w + x] = fbm(nx + 14, ny + 14, seed + 200, 3);
    }
  }

  const wlvl = Math.max(0.05, Math.min(0.85, waterLevel + presetCfg.waterAdj));
  const effectiveClimate = climate * (presetCfg.climate / 0.5);
  const getElev = (x, y) => (x < 0 || x >= w || y < 0 || y >= h ? 0 : heightMap[y * w + x]);
  const cellCenter = (x, y) => ({ px: (x + 0.5) * cellW, py: (y + 0.5) * cellH });

  // ── Ocean wash (full canvas)
  ctx.fillStyle = palette.water;
  ctx.fillRect(0, 0, width, height);

  // Deep-water mottle for tonal interest in ocean
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const e = heightMap[y * w + x];
      if (e < wlvl * 0.6) {
        const { px, py } = cellCenter(x, y);
        ctx.fillStyle = palette.waterDeep + '70';
        ctx.beginPath();
        ctx.arc(px, py, cellR * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ── Land coast halo (ink ring), then paper fill on top via overlapping circles.
  // Two passes give a soft outlined silhouette without per-cell rectangles.
  ctx.fillStyle = palette.waterOutline;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (heightMap[y * w + x] >= wlvl) {
        const { px, py } = cellCenter(x, y);
        ctx.beginPath();
        ctx.arc(px, py, cellR * 1.45, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.fillStyle = palette.paper;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (heightMap[y * w + x] >= wlvl) {
        const { px, py } = cellCenter(x, y);
        ctx.beginPath();
        ctx.arc(px, py, cellR * 1.18, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ── Biome blobs (overlapping translucent discs respect the smooth coast)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const e = heightMap[y * w + x];
      if (e < wlvl) continue;
      const lat = y / h;
      const m = moistureMap[y * w + x];
      const b = biomeOf(e, m, lat, effectiveClimate);
      let fill = null;
      if (b === 'desert') fill = palette.desert;
      else if (b === 'snow') fill = palette.snow;
      else if (b === 'tundra') fill = palette.tundra;
      else if (b === 'jungle') fill = palette.jungle + 'B0';
      else if (b === 'swamp') fill = palette.swamp + 'B0';
      if (fill) {
        const { px, py } = cellCenter(x, y);
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(px, py, cellR * 1.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Latitude grid
  if (showGrid) {
    ctx.strokeStyle = palette.ink + '20';
    ctx.lineWidth = 0.6;
    ctx.setLineDash([3, 6]);
    ctx.beginPath();
    for (let i = 1; i < 12; i++) { ctx.moveTo((i / 12) * width, 0); ctx.lineTo((i / 12) * width, height); }
    for (let i = 1; i < 8; i++)  { ctx.moveTo(0, (i / 8) * height); ctx.lineTo(width, (i / 8) * height); }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ── Lakes (smooth bezier blobs)
  const drawLake = (cx, cy, size) => {
    const { px, py } = cellCenter(cx, cy);
    ctx.fillStyle = palette.water;
    ctx.strokeStyle = palette.waterOutline;
    ctx.lineWidth = 1.5;
    const pts = [];
    const seg = 18;
    for (let i = 0; i < seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      const r = size * cellR * (0.85 + 0.35 * noise2D(Math.cos(a) * 2, Math.sin(a) * 2, seed + cx));
      pts.push({ x: px + Math.cos(a) * r, y: py + Math.sin(a) * r });
    }
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const n = pts[(i + 1) % pts.length];
      const mx = (p.x + n.x) / 2;
      const my = (p.y + n.y) / 2;
      if (i === 0) ctx.moveTo(mx, my);
      else ctx.quadraticCurveTo(p.x, p.y, mx, my);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };
  let pl = 0;
  for (let i = 0; i < 200 && pl < lakeCount; i++) {
    const lx = Math.floor(random(seed + i * 3.1) * w);
    const ly = Math.floor(random(seed + i * 4.7) * h);
    if (getElev(lx, ly) > wlvl + 0.05 && getElev(lx, ly) < 0.55) {
      drawLake(lx, ly, 2.2 + random(lx + ly) * 1.8);
      pl++;
    }
  }

  // ── Rivers (downhill flow, smoothed)
  ctx.strokeStyle = palette.waterOutline;
  ctx.lineCap = 'round';
  for (let i = 0; i < riverCount; i++) {
    let rx = Math.floor(random(seed + i * 7) * w);
    let ry = Math.floor(random(seed + i * 11) * h);
    if (getElev(rx, ry) > wlvl + 0.2) {
      const path = [];
      let cx = rx, cy = ry, flow = true, guard = 0;
      while (flow && guard < 220) {
        guard++;
        path.push({ x: cx, y: cy });
        if (getElev(cx, cy) < wlvl) break;
        let minE = getElev(cx, cy), nx = cx, ny = cy;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const e = getElev(cx + dx, cy + dy);
          if (e < minE) { minE = e; nx = cx + dx; ny = cy + dy; }
        }
        if (nx === cx && ny === cy) { flow = false; drawLake(cx, cy, 1.2); }
        else { cx = nx; cy = ny; }
      }
      if (path.length > 5) {
        ctx.lineWidth = 1.2 + Math.min(3, path.length / 50);
        ctx.beginPath();
        const p0 = cellCenter(path[0].x, path[0].y);
        ctx.moveTo(p0.px, p0.py);
        for (let p = 1; p < path.length - 1; p++) {
          const cur = cellCenter(path[p].x, path[p].y);
          const nxt = cellCenter(path[p + 1].x, path[p + 1].y);
          const jx = (random(seed + p) - 0.5) * 2;
          const jy = (random(seed + p * 2) - 0.5) * 2;
          ctx.quadraticCurveTo(cur.px + jx, cur.py + jy, (cur.px + nxt.px) / 2, (cur.py + nxt.py) / 2);
        }
        const last = cellCenter(path[path.length - 1].x, path[path.length - 1].y);
        ctx.lineTo(last.px, last.py);
        ctx.stroke();
      }
    }
  }

  // ── Settlement placement
  const placeNear = (count, predicate, minDist, list) => {
    let att = 0;
    while (list.length < count && att < 600) {
      const rx = Math.floor(random(seed + att * 1.7 + list.length * 13) * w);
      const ry = Math.floor(random(seed + att * 2.3 + list.length * 17) * h);
      if (predicate(rx, ry) && !list.some((p) => Math.hypot(p.x - rx, p.y - ry) < minDist)) {
        list.push({ x: rx, y: ry });
      }
      att++;
    }
  };

  const cities = [];
  placeNear(cityCount, (x, y) => getElev(x, y) > wlvl && getElev(x, y) < 0.55, 12, cities);
  cities.forEach((c, i) => { c.name = pickName(nameSeed + i, bank, used); c.kind = 'city'; });

  const capitals = cities.slice(0, Math.min(capitalCount, cities.length));
  capitals.forEach((c, i) => {
    c.kind = 'capital';
    c.name = i < bank.cap.length ? bank.cap[i] : c.name;
  });

  const castles = [];
  placeNear(castleCount, (x, y) => {
    const e = getElev(x, y);
    return e > 0.55 && e < 0.78 && !cities.some((c) => Math.hypot(c.x - x, c.y - y) < 18);
  }, 22, castles);
  castles.forEach((c, i) => { c.name = pickName(nameSeed + 500 + i, bank, used); });

  const villages = [];
  placeNear(villageCount, (x, y) => {
    const e = getElev(x, y);
    return e > wlvl + 0.02 && e < 0.5 && !cities.some((c) => Math.hypot(c.x - x, c.y - y) < 8);
  }, 8, villages);
  villages.forEach((v, i) => { v.name = pickName(nameSeed + 900 + i, bank, used); });

  // ── Realms
  const realmCenters = capitals.length ? capitals : cities.slice(0, Math.min(realmCount, cities.length));
  const realmList = realmCenters.slice(0, realmCount).map((c, i) => ({
    ...c,
    color: REALM_COLORS[i % REALM_COLORS.length],
    name: i < bank.realm.length ? bank.realm[i] : pickName(nameSeed + 7000 + i, bank, used),
  }));

  const cellRealm = new Int8Array(w * h);
  if (realmList.length && (showBorders || shadeRealms)) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (heightMap[y * w + x] < wlvl) { cellRealm[y * w + x] = -1; continue; }
        let best = 0, bd = Infinity;
        for (let r = 0; r < realmList.length; r++) {
          const d = Math.hypot(realmList[r].x - x, realmList[r].y - y) + noise2D(x / 8, y / 8, seed + r * 31) * 12;
          if (d < bd) { bd = d; best = r; }
        }
        cellRealm[y * w + x] = best;
      }
    }
    if (shadeRealms) {
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const r = cellRealm[y * w + x];
          if (r < 0) continue;
          const { px, py } = cellCenter(x, y);
          ctx.fillStyle = realmList[r].color + '20';
          ctx.beginPath();
          ctx.arc(px, py, cellR * 1.0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    if (showBorders) {
      ctx.strokeStyle = palette.realmInk;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([7, 3, 2, 3]);
      ctx.beginPath();
      for (let y = 0; y < h - 1; y++) {
        for (let x = 0; x < w - 1; x++) {
          const r0 = cellRealm[y * w + x];
          if (r0 < 0) continue;
          const rR = cellRealm[y * w + (x + 1)];
          const rB = cellRealm[(y + 1) * w + x];
          if (rR >= 0 && rR !== r0) {
            ctx.moveTo((x + 1) * cellW, y * cellH);
            ctx.lineTo((x + 1) * cellW, (y + 1) * cellH);
          }
          if (rB >= 0 && rB !== r0) {
            ctx.moveTo(x * cellW, (y + 1) * cellH);
            ctx.lineTo((x + 1) * cellW, (y + 1) * cellH);
          }
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // ── Roads
  if (showRoads) {
    ctx.strokeStyle = palette.road;
    ctx.lineWidth = 1.6;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    const all = [...capitals, ...cities.filter(c => c.kind !== 'capital'), ...castles];
    all.forEach((s, i) => {
      let nearest = null, minD = Infinity;
      all.forEach((o, j) => {
        if (i === j) return;
        const d = Math.hypot(s.x - o.x, s.y - o.y);
        if (d < minD) { minD = d; nearest = o; }
      });
      if (nearest && minD < 50) {
        const a = cellCenter(s.x, s.y);
        const b = cellCenter(nearest.x, nearest.y);
        const mx = (a.px + b.px) / 2, my = (a.py + b.py) / 2;
        const off = (random(seed + i * 13) - 0.5) * 30;
        ctx.moveTo(a.px, a.py);
        ctx.quadraticCurveTo(mx + off, my + off, b.px, b.py);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ── Terrain features
  const features = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const e = heightMap[y * w + x];
      const m = moistureMap[y * w + x];
      if (e < wlvl) continue;
      const { px, py } = cellCenter(x, y);
      const lat = y / h;
      const b = biomeOf(e, m, lat, effectiveClimate);
      if (e > 0.68 && random(x * y + seed) < 0.32 * mountains)
        features.push({ type: 'mountain', x: px, y: py, h: e });
      else if (e > 0.55 && e < 0.65 && random(x * y + seed * 1.3) < 0.18 * roughness)
        features.push({ type: 'plateau', x: px, y: py });
      else if (e > 0.5 && e < 0.65 && random(x * y + seed) < 0.18 * hills)
        features.push({ type: 'hill', x: px, y: py });
      else if (b === 'forest' && random(x * y + seed) < 0.42 * forestDensity)
        features.push({ type: 'tree', x: px, y: py });
      else if (b === 'jungle' && random(x * y + seed) < 0.5 * forestDensity)
        features.push({ type: 'jungle', x: px, y: py });
      else if (b === 'swamp' && random(x * y + seed) < 0.35 * swampiness)
        features.push({ type: 'swamp', x: px, y: py });
      else if (b === 'desert' && random(x * y + seed) < 0.05)
        features.push({ type: 'dune', x: px, y: py });
      else if ((b === 'snow' || b === 'tundra') && e > 0.5 && random(x * y + seed) < 0.08)
        features.push({ type: 'pine', x: px, y: py });
    }
  }
  features.sort((a, b) => a.y - b.y);

  // ── Icon helpers (modern pictogram style)
  const drawMountain = (fx, fy, elev) => {
    const sz = 22 + (elev - 0.6) * 70;
    // back peak (lighter)
    ctx.fillStyle = palette.mountainShadow + 'AA';
    ctx.beginPath();
    ctx.moveTo(fx - sz * 0.3, fy);
    ctx.lineTo(fx - sz * 0.05, fy - sz * 0.85);
    ctx.lineTo(fx + sz * 0.4, fy);
    ctx.closePath();
    ctx.fill();
    // main peak
    ctx.fillStyle = palette.mountainLight;
    ctx.beginPath();
    ctx.moveTo(fx - sz * 0.5, fy);
    ctx.lineTo(fx, fy - sz);
    ctx.lineTo(fx + sz * 0.5, fy);
    ctx.closePath();
    ctx.fill();
    // shadow side
    ctx.fillStyle = palette.mountainShadow;
    ctx.beginPath();
    ctx.moveTo(fx, fy - sz);
    ctx.lineTo(fx + sz * 0.5, fy);
    ctx.lineTo(fx + sz * 0.05, fy);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(fx - sz * 0.5, fy);
    ctx.lineTo(fx, fy - sz);
    ctx.lineTo(fx + sz * 0.5, fy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(fx, fy - sz);
    ctx.lineTo(fx + sz * 0.05, fy);
    ctx.stroke();
    // hatching on shadow side
    ctx.lineWidth = 0.8;
    for (let k = 1; k < 4; k++) {
      const t = k / 4;
      ctx.beginPath();
      ctx.moveTo(fx + sz * 0.05 * t, fy - sz * (1 - t));
      ctx.lineTo(fx + sz * 0.5 * t, fy - sz * (1 - t) * 0.4);
      ctx.stroke();
    }
    if (elev > 0.78) {
      ctx.fillStyle = palette.snow;
      ctx.beginPath();
      ctx.moveTo(fx - sz * 0.18, fy - sz * 0.7);
      ctx.lineTo(fx - sz * 0.06, fy - sz * 0.78);
      ctx.lineTo(fx, fy - sz);
      ctx.lineTo(fx + sz * 0.04, fy - sz * 0.82);
      ctx.lineTo(fx + sz * 0.18, fy - sz * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  };

  const drawPlateau = (fx, fy) => {
    const sz = 20;
    ctx.fillStyle = palette.mountainLight;
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(fx - sz, fy);
    ctx.lineTo(fx - sz * 0.7, fy - sz * 0.55);
    ctx.lineTo(fx + sz * 0.7, fy - sz * 0.55);
    ctx.lineTo(fx + sz, fy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // hatched top
    ctx.lineWidth = 0.7;
    for (let k = 0; k < 4; k++) {
      const t = k / 3;
      ctx.beginPath();
      ctx.moveTo(fx - sz * 0.65 + sz * 1.3 * t, fy - sz * 0.55);
      ctx.lineTo(fx - sz * 0.55 + sz * 1.3 * t, fy - sz * 0.45);
      ctx.stroke();
    }
  };

  const drawTree = (fx, fy) => {
    const sz = 8 + random(fx) * 4;
    // trunk
    ctx.fillStyle = palette.mountainShadow;
    ctx.fillRect(fx - 1, fy - 2, 2, 4);
    // crown — three overlapping circles
    ctx.fillStyle = palette.forest;
    ctx.beginPath();
    ctx.arc(fx - sz * 0.4, fy - sz * 0.6, sz * 0.55, 0, Math.PI * 2);
    ctx.arc(fx + sz * 0.4, fy - sz * 0.55, sz * 0.55, 0, Math.PI * 2);
    ctx.arc(fx, fy - sz * 1.05, sz * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 0.9;
    ctx.stroke();
  };

  const drawPine = (fx, fy) => {
    const sz = 9 + random(fx) * 4;
    ctx.fillStyle = palette.forest;
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 1;
    // 3 stacked triangles
    for (let k = 0; k < 3; k++) {
      const off = k * sz * 0.32;
      const wd = sz * (0.55 - k * 0.1);
      ctx.beginPath();
      ctx.moveTo(fx - wd, fy - off);
      ctx.lineTo(fx, fy - off - sz * 0.55);
      ctx.lineTo(fx + wd, fy - off);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = palette.mountainShadow;
    ctx.fillRect(fx - 1, fy, 2, 3);
  };

  const drawJungle = (fx, fy) => {
    const sz = 12 + random(fx) * 5;
    ctx.fillStyle = palette.jungle;
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(fx - sz * 0.35, fy - sz * 0.3, sz * 0.45, 0, Math.PI * 2);
    ctx.arc(fx + sz * 0.35, fy - sz * 0.4, sz * 0.5, 0, Math.PI * 2);
    ctx.arc(fx, fy - sz * 0.85, sz * 0.55, 0, Math.PI * 2);
    ctx.arc(fx, fy - sz * 0.3, sz * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  };

  const drawSwamp = (fx, fy) => {
    ctx.strokeStyle = palette.swamp;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(fx - 6, fy);   ctx.lineTo(fx + 6, fy);
    ctx.moveTo(fx - 4, fy - 3); ctx.lineTo(fx + 4, fy - 3);
    ctx.moveTo(fx - 2, fy - 6); ctx.lineTo(fx + 2, fy - 6);
    ctx.stroke();
  };

  const drawDune = (fx, fy) => {
    ctx.strokeStyle = palette.ink + 'A0';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(fx - 8, fy);
    ctx.quadraticCurveTo(fx - 4, fy - 5, fx, fy);
    ctx.quadraticCurveTo(fx + 4, fy - 4, fx + 8, fy);
    ctx.stroke();
  };

  const drawHill = (fx, fy) => {
    const sz = 11 + random(fx) * 5;
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(fx - sz, fy);
    ctx.quadraticCurveTo(fx, fy - sz, fx + sz, fy);
    ctx.stroke();
  };

  features.forEach((f) => {
    const j = (random(f.x + f.y) - 0.5) * 5;
    const fx = f.x + j, fy = f.y + j;
    if (f.type === 'mountain') drawMountain(fx, fy, f.h);
    else if (f.type === 'plateau') drawPlateau(fx, fy);
    else if (f.type === 'tree') drawTree(fx, fy);
    else if (f.type === 'pine') drawPine(fx, fy);
    else if (f.type === 'jungle') drawJungle(fx, fy);
    else if (f.type === 'swamp') drawSwamp(fx, fy);
    else if (f.type === 'dune') drawDune(fx, fy);
    else if (f.type === 'hill') drawHill(fx, fy);
  });

  // ── Volcanoes
  const volTotal = volcanoCount + (presetCfg.volcanoes || 0);
  let vc = 0;
  for (let i = 0; i < 200 && vc < volTotal; i++) {
    const vx = Math.floor(random(seed + 12000 + i * 5) * w);
    const vy = Math.floor(random(seed + 13000 + i * 7) * h);
    const e = getElev(vx, vy);
    if (e > 0.55 && e < 0.85) {
      const { px, py } = cellCenter(vx, vy);
      const sz = 38;
      // truncated cone
      ctx.fillStyle = palette.mountainShadow;
      ctx.beginPath();
      ctx.moveTo(px - sz / 2, py);
      ctx.lineTo(px - sz / 6, py - sz);
      ctx.lineTo(px + sz / 6, py - sz);
      ctx.lineTo(px + sz / 2, py);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = palette.mountainLight + 'C0';
      ctx.beginPath();
      ctx.moveTo(px - sz / 2, py);
      ctx.lineTo(px - sz / 6, py - sz);
      ctx.lineTo(px, py - sz);
      ctx.lineTo(px - sz * 0.06, py);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(px - sz / 2, py);
      ctx.lineTo(px - sz / 6, py - sz);
      ctx.lineTo(px + sz / 6, py - sz);
      ctx.lineTo(px + sz / 2, py);
      ctx.stroke();
      // crater glow
      ctx.fillStyle = '#E8553F';
      ctx.beginPath();
      ctx.ellipse(px, py - sz, sz / 6, sz / 14, 0, 0, Math.PI * 2);
      ctx.fill();
      // smoke billows
      ctx.fillStyle = palette.ink + '55';
      for (let k = 0; k < 4; k++) {
        ctx.beginPath();
        ctx.arc(px + (k - 1) * 5, py - sz - 6 - k * 9, 7 + k * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      // lava
      ctx.strokeStyle = '#E8553F';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(px, py - sz);
      ctx.quadraticCurveTo(px + 4, py - sz / 2, px - 2, py);
      ctx.stroke();
      vc++;
    }
  }

  // ── Ruins (broken arch)
  let rcc = 0;
  for (let i = 0; i < 300 && rcc < ruinCount; i++) {
    const rx = Math.floor(random(seed + 21000 + i * 5) * w);
    const ry = Math.floor(random(seed + 22000 + i * 7) * h);
    const e = getElev(rx, ry);
    if (e > wlvl + 0.05 && e < 0.65 && !cities.some(c => Math.hypot(c.x - rx, c.y - ry) < 8)) {
      const { px, py } = cellCenter(rx, ry);
      ctx.strokeStyle = palette.ink;
      ctx.fillStyle = palette.paperShade;
      ctx.lineWidth = 1.4;
      // standing column
      ctx.fillRect(px - 9, py - 14, 4, 14);
      ctx.strokeRect(px - 9, py - 14, 4, 14);
      // partial arch
      ctx.beginPath();
      ctx.arc(px, py - 14, 5, Math.PI, Math.PI * 1.7);
      ctx.stroke();
      // broken column
      ctx.fillRect(px + 5, py - 8, 4, 8);
      ctx.strokeRect(px + 5, py - 8, 4, 8);
      // fallen capital
      ctx.beginPath();
      ctx.ellipse(px + 11, py + 2, 4, 1.5, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // ground
      ctx.beginPath();
      ctx.moveTo(px - 14, py); ctx.lineTo(px + 14, py);
      ctx.stroke();
      ctx.fillStyle = palette.text;
      ctx.font = 'italic 13px "DM Mono", "IM Fell English", serif';
      ctx.textAlign = 'center';
      if (showLabels) ctx.fillText('Ruins of ' + pickName(nameSeed + 23000 + i, bank, used), px, py + 16, 140);
      rcc++;
    }
  }

  // ── Wizard towers (tall slim with conical roof + banner)
  let tcc = 0;
  for (let i = 0; i < 300 && tcc < towerCount; i++) {
    const tx = Math.floor(random(seed + 31000 + i * 5) * w);
    const ty = Math.floor(random(seed + 32000 + i * 7) * h);
    const e = getElev(tx, ty);
    if (e > 0.5 && e < 0.78) {
      const { px, py } = cellCenter(tx, ty);
      ctx.fillStyle = palette.paperShade;
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 1.4;
      // tower body (slight taper)
      ctx.beginPath();
      ctx.moveTo(px - 4, py);
      ctx.lineTo(px - 3, py - 22);
      ctx.lineTo(px + 3, py - 22);
      ctx.lineTo(px + 4, py);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // window slit
      ctx.fillStyle = palette.ink;
      ctx.fillRect(px - 1, py - 15, 2, 4);
      // conical roof
      ctx.fillStyle = palette.realmInk;
      ctx.beginPath();
      ctx.moveTo(px - 6, py - 22);
      ctx.lineTo(px, py - 38);
      ctx.lineTo(px + 6, py - 22);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // banner
      ctx.beginPath();
      ctx.moveTo(px, py - 38);
      ctx.lineTo(px, py - 46);
      ctx.lineTo(px + 7, py - 43);
      ctx.lineTo(px, py - 40);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = palette.text;
      ctx.font = 'italic 12px "DM Mono", serif';
      ctx.textAlign = 'center';
      if (showLabels) ctx.fillText('Tower of ' + pickName(nameSeed + 33000 + i, bank, used), px, py + 14, 140);
      tcc++;
    }
  }

  // ── Monasteries (chapel + steeple + cross)
  let mcc = 0;
  for (let i = 0; i < 300 && mcc < monasteryCount; i++) {
    const tx = Math.floor(random(seed + 41000 + i * 5) * w);
    const ty = Math.floor(random(seed + 42000 + i * 7) * h);
    const e = getElev(tx, ty);
    if (e > 0.45 && e < 0.7) {
      const { px, py } = cellCenter(tx, ty);
      ctx.fillStyle = palette.paperShade;
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 1.4;
      // chapel base
      ctx.fillRect(px - 12, py - 8, 24, 8);
      ctx.strokeRect(px - 12, py - 8, 24, 8);
      // steep pitched roof
      ctx.beginPath();
      ctx.moveTo(px - 14, py - 8);
      ctx.lineTo(px, py - 20);
      ctx.lineTo(px + 14, py - 8);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // small steeple
      ctx.fillRect(px - 2, py - 24, 4, 4);
      ctx.strokeRect(px - 2, py - 24, 4, 4);
      // cross
      ctx.beginPath();
      ctx.moveTo(px, py - 24);
      ctx.lineTo(px, py - 32);
      ctx.moveTo(px - 3, py - 28);
      ctx.lineTo(px + 3, py - 28);
      ctx.stroke();
      ctx.fillStyle = palette.text;
      ctx.font = 'italic 12px "DM Mono", serif';
      ctx.textAlign = 'center';
      if (showLabels) ctx.fillText('Abbey of ' + pickName(nameSeed + 43000 + i, bank, used), px, py + 12, 150);
      mcc++;
    }
  }

  // ── Standing stones (3 stones in arc with shadow)
  let scc = 0;
  for (let i = 0; i < 300 && scc < stoneCount; i++) {
    const tx = Math.floor(random(seed + 51000 + i * 5) * w);
    const ty = Math.floor(random(seed + 52000 + i * 7) * h);
    const e = getElev(tx, ty);
    if (e > wlvl + 0.05 && e < 0.6) {
      const { px, py } = cellCenter(tx, ty);
      // shadow
      ctx.fillStyle = palette.ink + '30';
      ctx.beginPath();
      ctx.ellipse(px, py + 3, 16, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // three menhir stones
      ctx.fillStyle = palette.mountainShadow;
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 1.3;
      const stones = [
        { x: -8, h: 10, w: 4, lean: -0.1 },
        { x: 0,  h: 13, w: 5, lean: 0.05 },
        { x: 8,  h: 9,  w: 4, lean: 0.12 },
      ];
      stones.forEach(s => {
        ctx.beginPath();
        ctx.moveTo(px + s.x - s.w / 2, py);
        ctx.lineTo(px + s.x - s.w / 2 + s.lean * s.h, py - s.h);
        ctx.lineTo(px + s.x + s.w / 2 + s.lean * s.h, py - s.h);
        ctx.lineTo(px + s.x + s.w / 2, py);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
      });
      scc++;
    }
  }

  // ── Lighthouses (tapered tower + light cone)
  let lcc = 0;
  for (let i = 0; i < 600 && lcc < lighthouseCount; i++) {
    const tx = Math.floor(random(seed + 61000 + i * 5) * w);
    const ty = Math.floor(random(seed + 62000 + i * 7) * h);
    const e = getElev(tx, ty);
    let coast = false;
    if (e >= wlvl) {
      for (let dy = -1; dy <= 1 && !coast; dy++) for (let dx = -1; dx <= 1 && !coast; dx++) {
        if (getElev(tx + dx, ty + dy) < wlvl) coast = true;
      }
    }
    if (coast) {
      const { px, py } = cellCenter(tx, ty);
      // light cone (drawn first, behind tower)
      ctx.fillStyle = '#F0C76A55';
      ctx.beginPath();
      ctx.moveTo(px, py - 22);
      ctx.lineTo(px + 28, py - 32);
      ctx.lineTo(px + 28, py - 12);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(px, py - 22);
      ctx.lineTo(px - 28, py - 32);
      ctx.lineTo(px - 28, py - 12);
      ctx.closePath();
      ctx.fill();
      // tower (tapered)
      ctx.fillStyle = palette.paperShade;
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(px - 5, py);
      ctx.lineTo(px - 3, py - 18);
      ctx.lineTo(px + 3, py - 18);
      ctx.lineTo(px + 5, py);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // stripes
      ctx.fillStyle = palette.realmInk;
      ctx.fillRect(px - 4, py - 12, 8, 2);
      ctx.fillRect(px - 4, py - 6,  8, 2);
      // lamp room
      ctx.fillStyle = palette.paperShade;
      ctx.fillRect(px - 4, py - 22, 8, 4);
      ctx.strokeRect(px - 4, py - 22, 8, 4);
      // lamp
      ctx.fillStyle = '#F0C76A';
      ctx.beginPath();
      ctx.arc(px, py - 20, 2.5, 0, Math.PI * 2);
      ctx.fill();
      // cap
      ctx.beginPath();
      ctx.moveTo(px - 5, py - 22);
      ctx.lineTo(px, py - 28);
      ctx.lineTo(px + 5, py - 22);
      ctx.closePath();
      ctx.stroke();
      lcc++;
    }
  }

  // ── Castles (single tall keep with crenellations + flag)
  castles.forEach((c) => {
    const { px: cx, py: cy } = cellCenter(c.x, c.y);
    const W = 22, H = 28;
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 1.6;
    ctx.fillStyle = palette.paperShade;
    // keep body
    ctx.fillRect(cx - W / 2, cy - H, W, H);
    ctx.strokeRect(cx - W / 2, cy - H, W, H);
    // crenellations
    for (let i = 0; i < 4; i++) {
      const bx = cx - W / 2 + i * (W / 4);
      ctx.fillRect(bx + 1, cy - H - 4, 4, 4);
      ctx.strokeRect(bx + 1, cy - H - 4, 4, 4);
    }
    // arched gate
    ctx.fillStyle = palette.ink;
    ctx.beginPath();
    ctx.moveTo(cx - 4, cy);
    ctx.lineTo(cx - 4, cy - 8);
    ctx.arc(cx, cy - 8, 4, Math.PI, 0);
    ctx.lineTo(cx + 4, cy);
    ctx.closePath();
    ctx.fill();
    // window
    ctx.fillStyle = palette.paperShade;
    ctx.fillRect(cx - 2, cy - 18, 4, 4);
    ctx.strokeRect(cx - 2, cy - 18, 4, 4);
    // flagpole + flag
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy - H - 4);
    ctx.lineTo(cx, cy - H - 16);
    ctx.stroke();
    ctx.fillStyle = palette.realmInk;
    ctx.beginPath();
    ctx.moveTo(cx, cy - H - 16);
    ctx.lineTo(cx + 9, cy - H - 13);
    ctx.lineTo(cx, cy - H - 10);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // label
    ctx.fillStyle = palette.text;
    ctx.font = 'bold 14px "DM Serif Display", "IM Fell DW Pica", serif';
    ctx.textAlign = 'center';
    if (showLabels) ctx.fillText(c.name, cx, cy + 16, 130);
  });

  // ── Ships (caravel — curved hull + billowing sail)
  const drawShip = (px, py) => {
    ctx.fillStyle = palette.paper;
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 1.4;
    // hull (smile)
    ctx.beginPath();
    ctx.moveTo(px - 10, py);
    ctx.quadraticCurveTo(px, py + 8, px + 10, py);
    ctx.lineTo(px + 6, py - 1);
    ctx.lineTo(px - 6, py - 1);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // mast
    ctx.beginPath();
    ctx.moveTo(px, py - 1);
    ctx.lineTo(px, py - 18);
    ctx.stroke();
    // billowing sail
    ctx.fillStyle = palette.paper;
    ctx.beginPath();
    ctx.moveTo(px, py - 16);
    ctx.quadraticCurveTo(px + 12, py - 12, px + 8, py - 4);
    ctx.lineTo(px, py - 4);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // pennant
    ctx.fillStyle = palette.realmInk;
    ctx.beginPath();
    ctx.moveTo(px, py - 18);
    ctx.lineTo(px + 5, py - 16);
    ctx.lineTo(px, py - 14);
    ctx.fill();
  };
  let sc = 0;
  for (let i = 0; i < 300 && sc < shipCount; i++) {
    const sx = Math.floor(random(seed + 70000 + i * 7) * w);
    const sy = Math.floor(random(seed + 71000 + i * 11) * h);
    if (getElev(sx, sy) < wlvl - 0.05) {
      const { px, py } = cellCenter(sx, sy);
      drawShip(px, py);
      sc++;
    }
  }

  // ── Sea serpents (single sinuous bezier with snake head)
  let smc = 0;
  for (let i = 0; i < 300 && smc < seaMonsters; i++) {
    const sx = Math.floor(random(seed + 80000 + i * 7) * w);
    const sy = Math.floor(random(seed + 81000 + i * 11) * h);
    if (getElev(sx, sy) < wlvl - 0.1) {
      const { px, py } = cellCenter(sx, sy);
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      // 3 humps
      ctx.beginPath();
      ctx.moveTo(px - 24, py);
      ctx.bezierCurveTo(px - 20, py - 12, px - 12, py - 12, px - 8, py);
      ctx.bezierCurveTo(px - 4, py + 12, px + 4, py + 12, px + 8, py);
      ctx.bezierCurveTo(px + 12, py - 10, px + 18, py - 10, px + 22, py);
      ctx.stroke();
      // head
      ctx.fillStyle = palette.ink;
      ctx.beginPath();
      ctx.ellipse(px + 26, py - 4, 5, 3, -0.4, 0, Math.PI * 2);
      ctx.fill();
      // eye
      ctx.fillStyle = palette.paper;
      ctx.beginPath();
      ctx.arc(px + 27, py - 5, 1, 0, Math.PI * 2);
      ctx.fill();
      // forked tongue
      ctx.strokeStyle = palette.realmInk;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px + 30, py - 4);
      ctx.lineTo(px + 34, py - 4);
      ctx.moveTo(px + 33, py - 5);
      ctx.lineTo(px + 35, py - 6);
      ctx.moveTo(px + 33, py - 3);
      ctx.lineTo(px + 35, py - 2);
      ctx.stroke();
      smc++;
    }
  }

  // ── Krakens (round body + 6 curling tentacles with bezier)
  let kc = 0;
  for (let i = 0; i < 300 && kc < krakenCount; i++) {
    const sx = Math.floor(random(seed + 90000 + i * 7) * w);
    const sy = Math.floor(random(seed + 91000 + i * 11) * h);
    if (getElev(sx, sy) < wlvl - 0.15) {
      const { px, py } = cellCenter(sx, sy);
      ctx.strokeStyle = palette.ink;
      ctx.fillStyle = palette.waterDeep;
      ctx.lineWidth = 1.6;
      // body
      ctx.beginPath();
      ctx.arc(px, py, 11, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      // mantle dome
      ctx.fillStyle = palette.water;
      ctx.beginPath();
      ctx.arc(px, py - 3, 8, Math.PI, 0);
      ctx.fill(); ctx.stroke();
      // 6 curling tentacles
      ctx.lineCap = 'round';
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2 + 0.3;
        const r1 = 11;
        const startX = px + Math.cos(a) * r1;
        const startY = py + Math.sin(a) * r1;
        const c1x = px + Math.cos(a) * 24 + Math.cos(a + 1.2) * 6;
        const c1y = py + Math.sin(a) * 24 + Math.sin(a + 1.2) * 6;
        const endX = px + Math.cos(a + 0.4) * 32;
        const endY = py + Math.sin(a + 0.4) * 32;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(c1x, c1y, endX, endY);
        ctx.stroke();
        // suckers as tiny arcs along the curve
        ctx.lineWidth = 1;
        for (let s = 1; s < 4; s++) {
          const t = s / 4;
          const sxp = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * c1x + t * t * endX;
          const syp = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * c1y + t * t * endY;
          ctx.beginPath();
          ctx.arc(sxp, syp, 1.2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      // eyes
      ctx.fillStyle = palette.paper;
      ctx.beginPath(); ctx.arc(px - 4, py - 1, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(px + 4, py - 1, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = palette.ink;
      ctx.beginPath(); ctx.arc(px - 4, py - 1, 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(px + 4, py - 1, 1.2, 0, Math.PI * 2); ctx.fill();
      kc++;
    }
  }

  // ── Shipwrecks (tilted broken hull)
  let wcc = 0;
  for (let i = 0; i < 300 && wcc < wreckCount; i++) {
    const sx = Math.floor(random(seed + 95000 + i * 7) * w);
    const sy = Math.floor(random(seed + 96000 + i * 11) * h);
    if (getElev(sx, sy) < wlvl - 0.05) {
      const { px, py } = cellCenter(sx, sy);
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(0.25);
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-12, 4);
      ctx.quadraticCurveTo(0, 12, 12, 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-6, 4);
      ctx.lineTo(-10, -8);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(2, 4);
      ctx.lineTo(8, -3);
      ctx.stroke();
      ctx.restore();
      wcc++;
    }
  }

  // ── Villages (two pitched-roof houses)
  villages.forEach((v) => {
    const { px: cx, py: cy } = cellCenter(v.x, v.y);
    ctx.fillStyle = palette.paper;
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 1.1;
    // house 1
    ctx.fillRect(cx - 5, cy - 3, 4, 4);
    ctx.strokeRect(cx - 5, cy - 3, 4, 4);
    ctx.fillStyle = palette.realmInk;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy - 3);
    ctx.lineTo(cx - 3, cy - 7);
    ctx.lineTo(cx, cy - 3);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // house 2
    ctx.fillStyle = palette.paper;
    ctx.fillRect(cx + 1, cy - 2, 4, 3);
    ctx.strokeRect(cx + 1, cy - 2, 4, 3);
    ctx.fillStyle = palette.realmInk;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 2);
    ctx.lineTo(cx + 3, cy - 5);
    ctx.lineTo(cx + 6, cy - 2);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // label
    ctx.fillStyle = palette.text;
    ctx.font = '11px "DM Mono", serif';
    ctx.textAlign = 'center';
    if (showLabels) ctx.fillText(v.name, cx, cy + 14, 80);
  });

  // ── Cities & capitals
  cities.forEach((city) => {
    const { px: cx, py: cy } = cellCenter(city.x, city.y);
    if (city.kind === 'capital') {
      // medallion + star + crown
      ctx.fillStyle = palette.paper;
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      // 5-point star
      ctx.fillStyle = palette.realmInk;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? 6 : 2.5;
        const sx = cx + Math.cos(a) * r;
        const sy = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
      // crown above
      ctx.fillStyle = palette.realmInk;
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx - 9, cy - 14);
      ctx.lineTo(cx - 9, cy - 18);
      ctx.lineTo(cx - 4, cy - 15);
      ctx.lineTo(cx, cy - 21);
      ctx.lineTo(cx + 4, cy - 15);
      ctx.lineTo(cx + 9, cy - 18);
      ctx.lineTo(cx + 9, cy - 14);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // jewel dots
      ctx.fillStyle = palette.paper;
      ctx.beginPath(); ctx.arc(cx, cy - 17, 0.8, 0, Math.PI * 2); ctx.fill();
      // label (auto-shrunk)
      ctx.fillStyle = palette.text;
      ctx.font = 'bold 22px "DM Serif Display", "Cinzel", serif';
      ctx.textAlign = 'center';
      if (showLabels) ctx.fillText(city.name.toUpperCase(), cx, cy - 26, 220);
    } else {
      // ringed dot
      ctx.fillStyle = palette.paper;
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = palette.realmInk;
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = palette.text;
      ctx.font = 'bold 16px "DM Serif Display", "IM Fell DW Pica", serif';
      ctx.textAlign = 'center';
      if (showLabels) ctx.fillText(city.name, cx, cy - 11, 150);
    }
  });

  // ── Realm name labels at centroid (with paper-stroke halo, auto-fit)
  if (realmList.length && shadeRealms && showLabels) {
    const sums = realmList.map(() => ({ x: 0, y: 0, n: 0 }));
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const r = cellRealm[y * w + x];
      if (r >= 0) { sums[r].x += x; sums[r].y += y; sums[r].n++; }
    }
    realmList.forEach((r, i) => {
      if (!sums[i].n) return;
      const cx = (sums[i].x / sums[i].n) * cellW;
      const cy = (sums[i].y / sums[i].n) * cellH - 32;
      const label = r.name.toUpperCase();
      // dynamic sizing based on realm width — long names shrink
      const realmWidth = Math.sqrt(sums[i].n) * cellW * 1.2;
      const fontSize = Math.max(16, Math.min(34, realmWidth / Math.max(label.length, 6) * 1.6));
      ctx.font = `italic ${fontSize}px "DM Serif Display", "IM Fell DW Pica", serif`;
      ctx.textAlign = 'center';
      ctx.lineWidth = 5;
      ctx.strokeStyle = palette.paper;
      ctx.strokeText(label, cx, cy, realmWidth);
      ctx.fillStyle = r.color + '90';
      ctx.fillText(label, cx, cy, realmWidth);
    });
  }

  // ── Cartouche (auto-sized to title)
  if (showCartouche && worldTitle) {
    ctx.font = 'bold 30px "DM Serif Display", "Cinzel", serif';
    const titleW = ctx.measureText(worldTitle).width;
    const cw = Math.max(360, Math.min(width - 80, titleW + 80));
    const ch = 92;
    const cxR = width / 2 - cw / 2, cyR = 26;
    // ribbon shadow
    ctx.fillStyle = palette.ink + '20';
    ctx.fillRect(cxR + 4, cyR + 4, cw, ch);
    // body
    ctx.fillStyle = palette.paperShade;
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(cxR + 18, cyR);
    ctx.lineTo(cxR + cw - 18, cyR);
    ctx.quadraticCurveTo(cxR + cw, cyR + ch / 2, cxR + cw - 18, cyR + ch);
    ctx.lineTo(cxR + 18, cyR + ch);
    ctx.quadraticCurveTo(cxR, cyR + ch / 2, cxR + 18, cyR);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // inner hairline
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cxR + 22, cyR + 6);
    ctx.lineTo(cxR + cw - 22, cyR + 6);
    ctx.lineTo(cxR + cw - 22, cyR + ch - 6);
    ctx.lineTo(cxR + 22, cyR + ch - 6);
    ctx.closePath();
    ctx.stroke();
    // title
    ctx.fillStyle = palette.text;
    ctx.font = 'bold 30px "DM Serif Display", "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText(worldTitle, cxR + cw / 2, cyR + 42, cw - 50);
    // subtitle
    ctx.font = 'italic 14px "DM Mono", serif';
    const era = pickFrom(seed + 7, ['Sun','Moon','Stars','Crow','Wolf','Stag']);
    const yr = 1000 + Math.floor(random(seed + 99) * 800);
    ctx.fillText(`drawn in the ${yr}th year of the ${era}`, cxR + cw / 2, cyR + 70, cw - 50);
  }

  // ── Compass rose (8-point star, ornate)
  if (showCompass) {
    const cx = width - 96, cy = height - 96;
    ctx.strokeStyle = palette.ink;
    ctx.fillStyle = palette.paper;
    // outer ring
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, 50, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 42, 0, Math.PI * 2); ctx.stroke();
    // 16 ticks
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const r1 = i % 4 === 0 ? 36 : 38;
      ctx.lineWidth = i % 4 === 0 ? 1.6 : 0.8;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.lineTo(cx + Math.cos(a) * 42, cy + Math.sin(a) * 42);
      ctx.stroke();
    }
    // 8-point star (large + small alternating)
    ctx.lineWidth = 1.5;
    ctx.fillStyle = palette.paper;
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? 32 : 10;
      const sx = cx + Math.cos(a) * r;
      const sy = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // accented N point
    ctx.fillStyle = palette.realmInk;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 32);
    ctx.lineTo(cx + 6, cy);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = palette.ink;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 32);
    ctx.lineTo(cx - 6, cy);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.fill();
    // center pin
    ctx.fillStyle = palette.realmInk;
    ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI * 2); ctx.fill();
    // letters
    ctx.fillStyle = palette.text;
    ctx.font = 'bold 18px "DM Serif Display", "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', cx, cy - 56);
    ctx.fillText('S', cx, cy + 70);
    ctx.fillText('E', cx + 64, cy + 6);
    ctx.fillText('W', cx - 64, cy + 6);
  }

  // ── Scale bar
  if (showScale) {
    const sx = 60, sy = height - 60, segW = 32;
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 1.6;
    ctx.fillStyle = palette.paper;
    ctx.fillRect(sx, sy, segW * 6, 9);
    ctx.strokeRect(sx, sy, segW * 6, 9);
    for (let i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        ctx.fillStyle = palette.ink;
        ctx.fillRect(sx + i * segW, sy, segW, 9);
      }
    }
    ctx.fillStyle = palette.text;
    ctx.font = '11px "DM Mono", serif';
    ctx.textAlign = 'center';
    ctx.fillText('0', sx, sy + 24);
    ctx.fillText('300', sx + segW * 3, sy + 24);
    ctx.fillText('600 leagues', sx + segW * 6, sy + 24);
  }

  // ── Legend
  if (showLegend) {
    const lx = 50, ly = 80, lw = 210, lh = 230;
    ctx.fillStyle = palette.paperShade + 'F0';
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 2;
    ctx.fillRect(lx, ly, lw, lh);
    ctx.strokeRect(lx, ly, lw, lh);
    ctx.lineWidth = 0.7;
    ctx.strokeRect(lx + 5, ly + 5, lw - 10, lh - 10);
    ctx.fillStyle = palette.text;
    ctx.font = 'bold 15px "DM Serif Display", "Cinzel", serif';
    ctx.textAlign = 'left';
    ctx.fillText('LEGENDA', lx + 14, ly + 26);
    ctx.font = '13px "DM Mono", serif';
    [
      ['◉  Capital', 50],
      ['●  City', 70],
      ['⌂  Castle', 90],
      ['☗  Tower', 110],
      ['☘  Forest', 130],
      ['⛰  Mountain', 150],
      ['❉  Ruin', 170],
      ['🜲  Standing Stone', 190],
      ['⚓  Lighthouse', 210],
    ].forEach(([t, dy]) => ctx.fillText(t, lx + 14, ly + dy));
  }

  // ── Vignette
  const vg = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.3,
    width / 2, height / 2, Math.max(width, height) * 0.7,
  );
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(20,12,5,0.30)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, width, height);
}
