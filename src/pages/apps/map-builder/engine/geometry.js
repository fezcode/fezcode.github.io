// Pure geometry helpers — no DOM, fully unit-testable.

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

// Rotate point (px,py) around (cx,cy) by `ang` radians.
export function rotatePoint(px, py, cx, cy, ang) {
  const s = Math.sin(ang);
  const c = Math.cos(ang);
  const dx = px - cx;
  const dy = py - cy;
  return { x: cx + dx * c - dy * s, y: cy + dx * s + dy * c };
}

// World-space axis-aligned bounding box of a box-shaped object.
export function objectAABB(obj, baseSize) {
  const w = (obj.w || baseSize) * (obj.scale || 1);
  const h = (obj.h || baseSize) * (obj.scale || 1);
  const hw = w / 2;
  const hh = h / 2;
  const ang = obj.rotation || 0;
  const corners = [
    [-hw, -hh],
    [hw, -hh],
    [hw, hh],
    [-hw, hh],
  ].map(([x, y]) => rotatePoint(obj.x + x, obj.y + y, obj.x, obj.y, ang));
  const xs = corners.map((p) => p.x);
  const ys = corners.map((p) => p.y);
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  };
}

export function pointInAABB(px, py, b) {
  return px >= b.minX && px <= b.maxX && py >= b.minY && py <= b.maxY;
}

// Hit-test a point against a (possibly rotated) box object.
export function pointInObject(px, py, obj, baseSize) {
  const ang = -(obj.rotation || 0);
  const local = rotatePoint(px, py, obj.x, obj.y, ang);
  const w = (obj.w || baseSize) * (obj.scale || 1);
  const h = (obj.h || baseSize) * (obj.scale || 1);
  return Math.abs(local.x - obj.x) <= w / 2 && Math.abs(local.y - obj.y) <= h / 2;
}

export function pointInPolygon(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i].x;
    const yi = pts[i].y;
    const xj = pts[j].x;
    const yj = pts[j].y;
    const intersect =
      (yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function distToSegment(px, py, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((px - a.x) * dx + (py - a.y) * dy) / len2;
  t = clamp(t, 0, 1);
  return Math.hypot(px - (a.x + t * dx), py - (a.y + t * dy));
}

export function distToPolyline(px, py, pts) {
  if (pts.length === 1) return dist(px, py, pts[0].x, pts[0].y);
  let min = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    min = Math.min(min, distToSegment(px, py, pts[i], pts[i + 1]));
  }
  return min;
}

export function polylineBBox(pts, pad = 0) {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  return {
    minX: Math.min(...xs) - pad,
    minY: Math.min(...ys) - pad,
    maxX: Math.max(...xs) + pad,
    maxY: Math.max(...ys) + pad,
  };
}

export function bboxUnion(a, b) {
  if (!a) return b;
  if (!b) return a;
  return {
    minX: Math.min(a.minX, b.minX),
    minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX),
    maxY: Math.max(a.maxY, b.maxY),
  };
}
