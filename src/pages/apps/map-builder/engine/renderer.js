// Composites the scene onto the main canvas: viewport backdrop, the paper "sheet",
// terrain rasters, then object layers (sprites via the bitmap cache, shapes and
// text drawn directly). Also provides an offscreen export render.

import { ensureTerrainRaster } from './terrain';
import { getSpriteBitmap } from './spriteCache';
import { drawShape } from '../shapes';
import { get as getSprite } from '../sprites/registry';
import { withAlpha } from '../sprites/draw';

function fontFamily(font) {
  if (font === 'mono') return 'ui-monospace, "SFMono-Regular", Menlo, monospace';
  if (font === 'sans') return 'system-ui, -apple-system, "Segoe UI", sans-serif';
  return 'Georgia, "Times New Roman", serif';
}

function drawText(ctx, o, theme) {
  ctx.save();
  ctx.translate(o.x, o.y);
  if (o.rotation) ctx.rotate(o.rotation);
  ctx.globalAlpha = o.opacity ?? 1;
  const size = o.fontSize * (o.scale || 1);
  ctx.font = `${o.italic ? 'italic ' : ''}${size}px ${fontFamily(o.font)}`;
  ctx.textAlign = o.align || 'center';
  ctx.textBaseline = 'middle';
  try {
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${o.letterSpacing || 0}px`;
  } catch (e) {
    /* not supported */
  }
  ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(2, size * 0.16);
  ctx.strokeStyle = withAlpha(theme.paper, 0.85);
  ctx.strokeText(o.text, 0, 0);
  ctx.fillStyle = o.color || theme.terrain.ink;
  ctx.fillText(o.text, 0, 0);
  ctx.restore();
}

function drawSprite(ctx, o, theme, zoom, layerOpacity) {
  const entry = getSprite(o.spriteId);
  const base = entry ? entry.size : 64;
  const worldSize = base * (o.scale || 1);
  const bmp = getSpriteBitmap(entry, theme, Math.max(8, worldSize * zoom), o.tint);
  ctx.save();
  ctx.globalAlpha = (o.opacity ?? 1) * (layerOpacity ?? 1);
  ctx.translate(o.x, o.y);
  if (o.rotation) ctx.rotate(o.rotation);
  if (o.flipX) ctx.scale(-1, 1);
  if (bmp) {
    const wpb = worldSize / bmp._bucket;
    const dw = bmp.width * wpb;
    const dh = bmp.height * wpb;
    ctx.drawImage(bmp, -dw / 2, -dh / 2, dw, dh);
  } else {
    ctx.fillStyle = 'rgba(150,150,150,0.35)';
    ctx.strokeStyle = 'rgba(80,80,80,0.6)';
    ctx.fillRect(-worldSize / 2, -worldSize / 2, worldSize, worldSize);
    ctx.strokeRect(-worldSize / 2, -worldSize / 2, worldSize, worldSize);
  }
  ctx.restore();
}

function drawObject(ctx, o, theme, zoom, layerOpacity) {
  if (o.kind === 'shape') {
    ctx.globalAlpha = layerOpacity ?? 1;
    drawShape(ctx, o, theme);
  } else if (o.kind === 'text') {
    drawText(ctx, o, theme);
  } else {
    drawSprite(ctx, o, theme, zoom, layerOpacity);
  }
}

function drawSheet(ctx, scene, theme) {
  const { width, height } = scene.size;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.28)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 14;
  ctx.fillStyle = theme.paper;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
  ctx.strokeStyle = withAlpha(theme.terrain.ink, 0.4);
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, width, height);
}

// Main viewport render. view = { cssW, cssH, dpr }.
export function render(ctx, scene, theme, view) {
  const { cssW, cssH, dpr } = view;
  const cam = scene.camera;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = theme.ui.bg;
  ctx.fillRect(0, 0, cssW, cssH);

  ctx.setTransform(
    cam.zoom * dpr,
    0,
    0,
    cam.zoom * dpr,
    -cam.x * cam.zoom * dpr,
    -cam.y * cam.zoom * dpr,
  );

  drawSheet(ctx, scene, theme);

  for (const layer of scene.layers) {
    if (!layer.visible) continue;
    const op = layer.opacity ?? 1;
    if (layer.kind === 'terrain') {
      const raster = ensureTerrainRaster(layer, scene.size.width, scene.size.height, theme);
      ctx.save();
      ctx.globalAlpha = op;
      ctx.beginPath();
      ctx.rect(0, 0, scene.size.width, scene.size.height);
      ctx.clip();
      ctx.drawImage(raster, 0, 0);
      ctx.restore();
    } else {
      for (const o of layer.objects) drawObject(ctx, o, theme, cam.zoom, op);
    }
  }

  ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// Offscreen export of the sheet region at a resolution multiplier.
export function renderToCanvas(scene, theme, scale = 1) {
  const w = scene.size.width;
  const h = scene.size.height;
  const cv = document.createElement('canvas');
  cv.width = Math.round(w * scale);
  cv.height = Math.round(h * scale);
  const ctx = cv.getContext('2d');
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.fillStyle = theme.paper;
  ctx.fillRect(0, 0, w, h);

  for (const layer of scene.layers) {
    if (!layer.visible) continue;
    const op = layer.opacity ?? 1;
    if (layer.kind === 'terrain') {
      const raster = ensureTerrainRaster(layer, w, h, theme);
      ctx.save();
      ctx.globalAlpha = op;
      ctx.beginPath();
      ctx.rect(0, 0, w, h);
      ctx.clip();
      ctx.drawImage(raster, 0, 0);
      ctx.restore();
    } else {
      for (const o of layer.objects) drawObject(ctx, o, theme, scale, op);
    }
  }
  ctx.globalAlpha = 1;
  return cv;
}
