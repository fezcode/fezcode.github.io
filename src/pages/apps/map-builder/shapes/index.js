// Vector shape rendering + bounds + hit-testing. Shapes store their points in
// world coordinates; "smart" shapes (road/river/rail/wall/zone/coast) pull colours
// from the active theme but honour explicit style overrides.

import { darken, withAlpha } from '../sprites/draw';
import {
  pointInPolygon,
  distToPolyline,
  polylineBBox,
} from '../engine/geometry';

// Catmull-Rom -> bezier smoothing for organic coastlines, rivers, roads.
export function buildSmoothPath(ctx, pts, closed) {
  ctx.beginPath();
  if (pts.length === 1) {
    ctx.moveTo(pts[0].x, pts[0].y);
    return;
  }
  if (pts.length === 2) {
    ctx.moveTo(pts[0].x, pts[0].y);
    ctx.lineTo(pts[1].x, pts[1].y);
    return;
  }
  const p = pts;
  const n = p.length;
  ctx.moveTo(p[0].x, p[0].y);
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const a = closed ? p[(i - 1 + n) % n] : p[Math.max(0, i - 1)];
    const b = p[i % n];
    const c = p[(i + 1) % n];
    const d = closed ? p[(i + 2) % n] : p[Math.min(n - 1, i + 2)];
    ctx.bezierCurveTo(
      b.x + (c.x - a.x) / 6,
      b.y + (c.y - a.y) / 6,
      c.x - (d.x - b.x) / 6,
      c.y - (d.y - b.y) / 6,
      c.x,
      c.y,
    );
  }
  if (closed) ctx.closePath();
}

function polyPath(ctx, pts) {
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
}

function corners2(pts) {
  const a = pts[0];
  const b = pts[pts.length - 1];
  return [
    { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y) },
    { x: Math.max(a.x, b.x), y: Math.max(a.y, b.y) },
  ];
}

function drawArrow(ctx, a, b, color, width) {
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const head = Math.max(12, width * 3);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(b.x, b.y);
  ctx.lineTo(b.x - Math.cos(ang - 0.4) * head, b.y - Math.sin(ang - 0.4) * head);
  ctx.lineTo(b.x - Math.cos(ang + 0.4) * head, b.y - Math.sin(ang + 0.4) * head);
  ctx.closePath();
  ctx.fill();
}

function drawSleepers(ctx, pts, width, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, width * 0.35);
  const step = Math.max(8, width * 1.6);
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const segLen = Math.hypot(b.x - a.x, b.y - a.y);
    const nx = -(b.y - a.y) / (segLen || 1);
    const ny = (b.x - a.x) / (segLen || 1);
    for (let d = 0; d < segLen; d += step) {
      const t = d / (segLen || 1);
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      ctx.beginPath();
      ctx.moveTo(x + nx * width, y + ny * width);
      ctx.lineTo(x - nx * width, y - ny * width);
      ctx.stroke();
    }
  }
}

export function drawShape(ctx, obj, theme) {
  const st = obj.style || {};
  const pts = obj.points;
  if (!pts || pts.length === 0) return;
  const ink = theme.terrain.ink;
  ctx.save();
  ctx.translate(obj.x || 0, obj.y || 0);
  ctx.globalAlpha = obj.opacity ?? 1;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  switch (obj.shapeType) {
    case 'coast': {
      buildSmoothPath(ctx, pts, true);
      ctx.fillStyle = st.fill || theme.terrain.grass;
      ctx.fill();
      ctx.lineWidth = (st.width || 4) + 2;
      ctx.strokeStyle = withAlpha(theme.terrain.waterDeep, 0.5);
      ctx.stroke();
      buildSmoothPath(ctx, pts, true);
      ctx.lineWidth = st.width || 4;
      ctx.strokeStyle = st.stroke || ink;
      ctx.stroke();
      break;
    }
    case 'river': {
      buildSmoothPath(ctx, pts, false);
      ctx.strokeStyle = darken(theme.terrain.water, 0.18);
      ctx.lineWidth = (st.width || 12) + 4;
      ctx.stroke();
      buildSmoothPath(ctx, pts, false);
      ctx.strokeStyle = st.stroke || theme.terrain.water;
      ctx.lineWidth = st.width || 12;
      ctx.stroke();
      break;
    }
    case 'road': {
      const w = st.width || 14;
      buildSmoothPath(ctx, pts, false);
      ctx.strokeStyle = ink;
      ctx.lineWidth = w + 5;
      ctx.stroke();
      buildSmoothPath(ctx, pts, false);
      ctx.strokeStyle = st.fill || theme.terrain.road;
      ctx.lineWidth = w;
      ctx.stroke();
      buildSmoothPath(ctx, pts, false);
      ctx.strokeStyle = theme.terrain.roadLine;
      ctx.lineWidth = Math.max(1, w * 0.1);
      ctx.setLineDash([w, w * 0.8]);
      ctx.stroke();
      ctx.setLineDash([]);
      break;
    }
    case 'rail': {
      buildSmoothPath(ctx, pts, false);
      ctx.strokeStyle = st.stroke || theme.terrain.rail;
      ctx.lineWidth = st.width || 6;
      ctx.stroke();
      drawSleepers(ctx, pts, (st.width || 6) * 0.9, darken(theme.terrain.rail, 0.25));
      break;
    }
    case 'wall': {
      buildSmoothPath(ctx, pts, obj.closed);
      ctx.strokeStyle = st.stroke || darken(theme.sprite.stone, 0.4);
      ctx.lineWidth = (st.width || 12) + 3;
      ctx.stroke();
      buildSmoothPath(ctx, pts, obj.closed);
      ctx.strokeStyle = theme.sprite.stone;
      ctx.lineWidth = st.width || 12;
      ctx.stroke();
      break;
    }
    case 'zone': {
      buildSmoothPath(ctx, pts, true);
      ctx.fillStyle = withAlpha(st.fill || theme.sprite.accent, 0.16);
      ctx.fill();
      ctx.strokeStyle = st.stroke || theme.sprite.accent;
      ctx.lineWidth = st.width || 3;
      ctx.setLineDash([12, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
      break;
    }
    case 'contour': {
      buildSmoothPath(ctx, pts, obj.closed);
      ctx.strokeStyle = st.stroke || withAlpha(ink, 0.55);
      ctx.lineWidth = st.width || 2;
      ctx.setLineDash([3, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      break;
    }
    case 'polygon': {
      polyPath(ctx, pts);
      if (st.fill) {
        ctx.fillStyle = st.fill;
        ctx.fill();
      }
      ctx.strokeStyle = st.stroke || ink;
      ctx.lineWidth = st.width || 4;
      ctx.stroke();
      break;
    }
    case 'rect': {
      const [a, b] = corners2(pts);
      if (st.fill) {
        ctx.fillStyle = st.fill;
        ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
      }
      ctx.strokeStyle = st.stroke || ink;
      ctx.lineWidth = st.width || 4;
      ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
      break;
    }
    case 'ellipse': {
      const [a, b] = corners2(pts);
      const cx = (a.x + b.x) / 2;
      const cy = (a.y + b.y) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.abs(b.x - a.x) / 2, Math.abs(b.y - a.y) / 2, 0, 0, Math.PI * 2);
      if (st.fill) {
        ctx.fillStyle = st.fill;
        ctx.fill();
      }
      ctx.strokeStyle = st.stroke || ink;
      ctx.lineWidth = st.width || 4;
      ctx.stroke();
      break;
    }
    case 'line': {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.strokeStyle = st.stroke || ink;
      ctx.lineWidth = st.width || 4;
      if (st.dash) ctx.setLineDash(st.dash);
      ctx.stroke();
      ctx.setLineDash([]);
      break;
    }
    case 'arrow': {
      drawArrow(ctx, pts[0], pts[pts.length - 1], st.stroke || ink, st.width || 4);
      break;
    }
    case 'freehand':
    default: {
      buildSmoothPath(ctx, pts, obj.closed);
      if (obj.closed && st.fill) {
        ctx.fillStyle = st.fill;
        ctx.fill();
      }
      ctx.strokeStyle = st.stroke || ink;
      ctx.lineWidth = st.width || 3;
      if (st.dash) ctx.setLineDash(st.dash);
      ctx.stroke();
      ctx.setLineDash([]);
      break;
    }
  }
  ctx.restore();
}

const CLOSED_TYPES = new Set(['coast', 'zone', 'polygon', 'rect', 'ellipse']);

export function shapeBounds(obj) {
  const st = obj.style || {};
  const pad = (st.width || 4) / 2 + 6;
  let box;
  if (obj.shapeType === 'rect' || obj.shapeType === 'ellipse') {
    const [a, b] = corners2(obj.points);
    box = { minX: a.x, minY: a.y, maxX: b.x, maxY: b.y };
    box.minX -= pad;
    box.minY -= pad;
    box.maxX += pad;
    box.maxY += pad;
  } else {
    box = polylineBBox(obj.points, pad);
  }
  const ox = obj.x || 0;
  const oy = obj.y || 0;
  return { minX: box.minX + ox, minY: box.minY + oy, maxX: box.maxX + ox, maxY: box.maxY + oy };
}

export function hitShape(obj, wx, wy, tol = 6) {
  const x = wx - (obj.x || 0);
  const y = wy - (obj.y || 0);
  const st = obj.style || {};
  const reach = (st.width || 4) / 2 + tol;
  if (obj.shapeType === 'rect') {
    const [a, b] = corners2(obj.points);
    const inside = x >= a.x && x <= b.x && y >= a.y && y <= b.y;
    if (st.fill && inside) return true;
    const nearEdge =
      (Math.abs(x - a.x) < reach || Math.abs(x - b.x) < reach) && y >= a.y - reach && y <= b.y + reach;
    const nearEdgeH =
      (Math.abs(y - a.y) < reach || Math.abs(y - b.y) < reach) && x >= a.x - reach && x <= b.x + reach;
    return nearEdge || nearEdgeH;
  }
  if (obj.shapeType === 'ellipse') {
    const [a, b] = corners2(obj.points);
    const cx = (a.x + b.x) / 2;
    const cy = (a.y + b.y) / 2;
    const rx = Math.abs(b.x - a.x) / 2 || 1;
    const ry = Math.abs(b.y - a.y) / 2 || 1;
    const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
    return st.fill ? d <= 1.1 : Math.abs(d - 1) < 0.25;
  }
  if (CLOSED_TYPES.has(obj.shapeType) && st.fill && pointInPolygon(x, y, obj.points)) {
    return true;
  }
  if ((obj.shapeType === 'zone' || obj.shapeType === 'coast') && pointInPolygon(x, y, obj.points)) {
    return true;
  }
  return distToPolyline(x, y, obj.points) <= reach;
}
