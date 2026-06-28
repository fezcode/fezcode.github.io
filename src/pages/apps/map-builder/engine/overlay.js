// The overlay canvas: everything that is UI rather than artwork — grid, selection
// outlines + transform handles, marquee, in-progress pen/freehand/shape previews,
// and the terrain brush cursor. Drawn on a separate canvas above the main render.

import { worldToScreen } from './camera';
import { selectionBounds, objectBounds } from './picking';
import { withAlpha } from '../sprites/draw';

function drawGrid(ctx, scene, theme, view) {
  const g = scene.grid;
  if (!g.visible) return;
  const cam = scene.camera;
  const left = cam.x;
  const top = cam.y;
  const right = cam.x + view.cssW / cam.zoom;
  const bottom = cam.y + view.cssH / cam.zoom;
  const size = g.size;
  if ((right - left) / size > 400) return; // too dense, skip
  ctx.strokeStyle = withAlpha(theme.terrain.ink, 0.12);
  ctx.lineWidth = 1 / cam.zoom;
  if (g.type === 'hex') {
    ctx.fillStyle = withAlpha(theme.terrain.ink, 0.18);
    const r = size / 2;
    const w = Math.sqrt(3) * r;
    const h = 1.5 * r;
    for (let row = Math.floor(top / h) - 1; row < bottom / h + 1; row++) {
      const off = (((row % 2) + 2) % 2) * (w / 2);
      for (let col = Math.floor(left / w) - 1; col < right / w + 1; col++) {
        const cx = col * w + off;
        const cy = row * h;
        ctx.beginPath();
        ctx.arc(cx, cy, 1.4 / cam.zoom, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    return;
  }
  ctx.beginPath();
  for (let x = Math.floor(left / size) * size; x < right; x += size) {
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
  }
  for (let y = Math.floor(top / size) * size; y < bottom; y += size) {
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
  }
  ctx.stroke();
}

function drawSelection(ctx, ed, theme) {
  const cam = ed.scene.camera;
  const spot = theme.ui.spot;
  ctx.save();
  ctx.strokeStyle = withAlpha(spot, 0.8);
  ctx.lineWidth = 1.5 / cam.zoom;
  ctx.setLineDash([4 / cam.zoom, 3 / cam.zoom]);
  for (const { object: o } of ed.selectedObjects()) {
    const b = objectBounds(o);
    ctx.strokeRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);
  }
  ctx.restore();
}

function drawPending(ctx, ed, theme) {
  const cam = ed.scene.camera;
  const spot = theme.ui.spot;
  if (ed.pending && ed.pending.points.length) {
    const pts = ed.pending.points;
    ctx.save();
    ctx.strokeStyle = spot;
    ctx.lineWidth = 1.5 / cam.zoom;
    ctx.setLineDash([6 / cam.zoom, 4 / cam.zoom]);
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    if (ed.pendingCursor) ctx.lineTo(ed.pendingCursor.x, ed.pendingCursor.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = theme.paper;
    for (const p of pts) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4 / cam.zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }
  const d = ed.drag;
  if (d && d.kind === 'freehand') {
    ctx.save();
    ctx.strokeStyle = spot;
    ctx.lineWidth = 2 / cam.zoom;
    ctx.beginPath();
    ctx.moveTo(d.pts[0].x, d.pts[0].y);
    for (let i = 1; i < d.pts.length; i++) ctx.lineTo(d.pts[i].x, d.pts[i].y);
    ctx.stroke();
    ctx.restore();
  }
  if (d && d.kind === 'shapeDrag') {
    ctx.save();
    ctx.strokeStyle = spot;
    ctx.lineWidth = 1.5 / cam.zoom;
    ctx.setLineDash([6 / cam.zoom, 4 / cam.zoom]);
    const x = Math.min(d.x0, d.x1);
    const y = Math.min(d.y0, d.y1);
    const w = Math.abs(d.x1 - d.x0);
    const h = Math.abs(d.y1 - d.y0);
    if (d.type === 'ellipse') {
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (d.type === 'line' || d.type === 'arrow') {
      ctx.beginPath();
      ctx.moveTo(d.x0, d.y0);
      ctx.lineTo(d.x1, d.y1);
      ctx.stroke();
    } else {
      ctx.strokeRect(x, y, w, h);
    }
    ctx.restore();
  }
  if (d && d.kind === 'marquee') {
    ctx.save();
    ctx.fillStyle = withAlpha(spot, 0.12);
    ctx.strokeStyle = withAlpha(spot, 0.8);
    ctx.lineWidth = 1 / cam.zoom;
    const x = Math.min(d.x0, d.x1);
    const y = Math.min(d.y0, d.y1);
    ctx.fillRect(x, y, Math.abs(d.x1 - d.x0), Math.abs(d.y1 - d.y0));
    ctx.strokeRect(x, y, Math.abs(d.x1 - d.x0), Math.abs(d.y1 - d.y0));
    ctx.restore();
  }
}

function drawBrushCursor(ctx, ed, theme) {
  if (ed.tool !== 'terrain' || !ed.cursorWorld) return;
  const cam = ed.scene.camera;
  ctx.save();
  ctx.strokeStyle = withAlpha(theme.terrain.ink, 0.7);
  ctx.lineWidth = 1 / cam.zoom;
  ctx.beginPath();
  ctx.arc(ed.cursorWorld.x, ed.cursorWorld.y, ed.settings.brush.size / 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawHandles(ctx, ed, theme, view) {
  const box = selectionBounds(ed.scene, ed.selection);
  if (!box) return;
  const cam = ed.scene.camera;
  const tl = worldToScreen(cam, box.minX, box.minY);
  const br = worldToScreen(cam, box.maxX, box.maxY);
  const cx = (tl.x + br.x) / 2;
  const handles = [
    { x: tl.x, y: tl.y },
    { x: br.x, y: tl.y },
    { x: br.x, y: br.y },
    { x: tl.x, y: br.y },
  ];
  ctx.save();
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  // rotate handle stem
  ctx.strokeStyle = withAlpha(theme.ui.spot, 0.8);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx, tl.y);
  ctx.lineTo(cx, tl.y - 28);
  ctx.stroke();
  const rot = { x: cx, y: tl.y - 28 };
  ctx.fillStyle = theme.ui.spot;
  ctx.beginPath();
  ctx.arc(rot.x, rot.y, 5, 0, Math.PI * 2);
  ctx.fill();
  // corner squares
  ctx.fillStyle = theme.paper;
  ctx.strokeStyle = theme.ui.spot;
  ctx.lineWidth = 1.5;
  for (const hd of handles) {
    ctx.beginPath();
    ctx.rect(hd.x - 4.5, hd.y - 4.5, 9, 9);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

export function drawOverlay(ctx, ed, view) {
  const scene = ed.scene;
  const theme = ed.theme();
  const cam = scene.camera;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.setTransform(
    cam.zoom * view.dpr,
    0,
    0,
    cam.zoom * view.dpr,
    -cam.x * cam.zoom * view.dpr,
    -cam.y * cam.zoom * view.dpr,
  );
  drawGrid(ctx, scene, theme, view);
  drawBrushCursor(ctx, ed, theme);
  if (ed.selection.size) drawSelection(ctx, ed, theme);
  drawPending(ctx, ed, theme);
  if (ed.selection.size) drawHandles(ctx, ed, theme, view);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
