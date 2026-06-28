// Terrain rasterisation. Paint is stored as vector strokes on each terrain layer;
// the raster is a runtime cache rebuilt from strokes when dirty (or when the theme
// changes). Live painting and rebuild share paintStroke() so they look identical.

const MATERIAL_KEYS = {
  grass: 'grass',
  forest: 'forest',
  water: 'water',
  waterDeep: 'waterDeep',
  sand: 'sand',
  stone: 'stone',
  snow: 'snow',
  dirt: 'dirt',
  road: 'road',
};

export function materialColor(theme, material) {
  return theme.terrain[MATERIAL_KEYS[material] || 'grass'] || theme.terrain.grass;
}

// Draw one stroke. `ctx` is in world space (sheet origin = 0,0). When painting
// live, pass `fromIndex` to draw only the newly-added segment for responsiveness.
export function paintStroke(ctx, stroke, theme, fromIndex = 0) {
  const pts = stroke.pts;
  if (!pts || pts.length === 0) return;
  ctx.save();
  ctx.globalCompositeOperation = stroke.erase ? 'destination-out' : 'source-over';
  ctx.globalAlpha = stroke.erase ? 1 : stroke.opacity ?? 1;
  const color = materialColor(theme, stroke.material);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = stroke.size;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  if (pts.length === 1) {
    ctx.beginPath();
    ctx.arc(pts[0].x, pts[0].y, stroke.size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const start = Math.max(0, fromIndex - 1);
    ctx.beginPath();
    ctx.moveTo(pts[start].x, pts[start].y);
    for (let i = start + 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }
  ctx.restore();
}

export function rebuildTerrain(layer, w, h, theme) {
  let cv = layer._raster;
  if (!cv || cv.width !== w || cv.height !== h) {
    cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    layer._raster = cv;
  }
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  for (const s of layer.strokes) paintStroke(ctx, s, theme);
  layer._dirty = false;
  layer._rasterTheme = theme.id;
  return cv;
}

export function ensureTerrainRaster(layer, w, h, theme) {
  const stale =
    !layer._raster ||
    layer._raster.width !== w ||
    layer._raster.height !== h ||
    layer._dirty ||
    layer._rasterTheme !== theme.id;
  if (stale) return rebuildTerrain(layer, w, h, theme);
  return layer._raster;
}
