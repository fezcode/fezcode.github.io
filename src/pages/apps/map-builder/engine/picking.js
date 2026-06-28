// Hit-testing and selection bounds. Linear scan top-to-bottom — fast enough for
// thousands of objects; a spatial index can slot in here later behind the same API.

import { get as getSprite } from '../sprites/registry';
import { rotatePoint } from './geometry';
import { shapeBounds, hitShape } from '../shapes';

export function spriteBaseSize(obj) {
  const e = getSprite(obj.spriteId);
  return e ? e.size : 64;
}

export function objectSize(obj) {
  if (obj.kind === 'sprite') {
    const s = spriteBaseSize(obj) * (obj.scale || 1);
    return { w: s, h: s };
  }
  if (obj.kind === 'text') {
    const est = obj.w || Math.max(1, (obj.text || '').length) * obj.fontSize * 0.55;
    return { w: est * (obj.scale || 1), h: obj.fontSize * 1.32 * (obj.scale || 1) };
  }
  return { w: 0, h: 0 };
}

export function objectBounds(obj) {
  if (obj.kind === 'shape') return shapeBounds(obj);
  const { w, h } = objectSize(obj);
  const hw = w / 2;
  const hh = h / 2;
  const ang = obj.rotation || 0;
  const cs = [
    [-hw, -hh],
    [hw, -hh],
    [hw, hh],
    [-hw, hh],
  ].map(([x, y]) => rotatePoint(obj.x + x, obj.y + y, obj.x, obj.y, ang));
  const xs = cs.map((p) => p.x);
  const ys = cs.map((p) => p.y);
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

export function hitObject(obj, wx, wy, tol = 4) {
  if (obj.kind === 'shape') return hitShape(obj, wx, wy, tol);
  const { w, h } = objectSize(obj);
  const local = rotatePoint(wx, wy, obj.x, obj.y, -(obj.rotation || 0));
  return Math.abs(local.x - obj.x) <= w / 2 + tol && Math.abs(local.y - obj.y) <= h / 2 + tol;
}

export function hitTest(scene, wx, wy, tol = 4) {
  for (let li = scene.layers.length - 1; li >= 0; li--) {
    const layer = scene.layers[li];
    if (layer.kind !== 'object' || !layer.visible || layer.locked) continue;
    for (let oi = layer.objects.length - 1; oi >= 0; oi--) {
      if (hitObject(layer.objects[oi], wx, wy, tol)) {
        return { layer, object: layer.objects[oi] };
      }
    }
  }
  return null;
}

function normRect(rect) {
  return {
    minX: Math.min(rect.x0, rect.x1),
    minY: Math.min(rect.y0, rect.y1),
    maxX: Math.max(rect.x0, rect.x1),
    maxY: Math.max(rect.y0, rect.y1),
  };
}

export function objectsInRect(scene, rect) {
  const r = normRect(rect);
  const out = [];
  for (const layer of scene.layers) {
    if (layer.kind !== 'object' || !layer.visible || layer.locked) continue;
    for (const o of layer.objects) {
      const b = objectBounds(o);
      const cx = (b.minX + b.maxX) / 2;
      const cy = (b.minY + b.maxY) / 2;
      if (cx >= r.minX && cx <= r.maxX && cy >= r.minY && cy <= r.maxY) out.push(o);
    }
  }
  return out;
}

export function selectionBounds(scene, ids) {
  const set = ids instanceof Set ? ids : new Set(ids);
  let box = null;
  for (const layer of scene.layers) {
    if (layer.kind !== 'object') continue;
    for (const o of layer.objects) {
      if (!set.has(o.id)) continue;
      const b = objectBounds(o);
      box = box
        ? {
            minX: Math.min(box.minX, b.minX),
            minY: Math.min(box.minY, b.minY),
            maxX: Math.max(box.maxX, b.maxX),
            maxY: Math.max(box.maxY, b.maxY),
          }
        : b;
    }
  }
  return box;
}
