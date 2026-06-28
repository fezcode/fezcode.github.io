// Tool handlers. Each tool implements onDown/onMove/onUp (+ optional onDouble) and
// receives (editor, worldPoint, { sx, sy, ev }). Tools mutate the scene through the
// editor and call ed.render() during a gesture, ed.commit() when it ends (which
// records undo history + autosaves).

import {
  createStroke,
  createSprite,
  createText,
  createShape,
  addObject,
} from '../state/scene';
import { ensureTerrainRaster, paintStroke } from '../engine/terrain';
import { hitTest, objectsInRect, selectionBounds } from '../engine/picking';
import { worldToScreen } from '../engine/camera';
import { get as getSprite } from '../sprites/registry';
import { SHAPE_TYPES } from '../constants';

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export const SHAPE_META = SHAPE_TYPES.reduce((m, s) => {
  m[s.id] = s;
  return m;
}, {});

// ---------- selection transform helpers ----------
function snapshotSel(ed) {
  return ed.selectedObjects().map(({ object: o }) => ({
    o,
    x: o.x,
    y: o.y,
    scale: o.scale,
    rotation: o.rotation,
    points: o.points ? o.points.map((p) => ({ ...p })) : null,
  }));
}

function applyScale(snap, pivot, f) {
  const k = Math.max(0.04, f);
  for (const s of snap) {
    const o = s.o;
    if (o.points) {
      o.points = s.points.map((p) => ({
        x: pivot.x + (p.x - pivot.x) * k,
        y: pivot.y + (p.y - pivot.y) * k,
      }));
    } else {
      o.x = pivot.x + (s.x - pivot.x) * k;
      o.y = pivot.y + (s.y - pivot.y) * k;
      o.scale = Math.max(0.05, s.scale * k);
    }
  }
}

function applyRotate(snap, c, ang) {
  const cos = Math.cos(ang);
  const sin = Math.sin(ang);
  const rot = (x, y) => ({
    x: c.x + (x - c.x) * cos - (y - c.y) * sin,
    y: c.y + (x - c.x) * sin + (y - c.y) * cos,
  });
  for (const s of snap) {
    const o = s.o;
    if (o.points) {
      o.points = s.points.map((p) => rot(p.x, p.y));
    } else {
      const np = rot(s.x, s.y);
      o.x = np.x;
      o.y = np.y;
      o.rotation = (s.rotation || 0) + ang;
    }
  }
}

function handleScreenPositions(box, cam) {
  const tl = worldToScreen(cam, box.minX, box.minY);
  const br = worldToScreen(cam, box.maxX, box.maxY);
  const cx = (tl.x + br.x) / 2;
  return {
    nw: { x: tl.x, y: tl.y },
    ne: { x: br.x, y: tl.y },
    se: { x: br.x, y: br.y },
    sw: { x: tl.x, y: br.y },
    rot: { x: cx, y: tl.y - 28 },
  };
}

export function handleAt(ed, sx, sy) {
  const box = selectionBounds(ed.scene, ed.selection);
  if (!box) return null;
  const pos = handleScreenPositions(box, ed.scene.camera);
  for (const key of Object.keys(pos)) {
    if (Math.hypot(pos[key].x - sx, pos[key].y - sy) <= 10) return { key, box };
  }
  return null;
}

function oppositeCorner(box, key) {
  const map = {
    nw: { x: box.maxX, y: box.maxY },
    ne: { x: box.minX, y: box.maxY },
    se: { x: box.minX, y: box.minY },
    sw: { x: box.maxX, y: box.minY },
  };
  return map[key];
}

// ---------- terrain ----------
function paintLive(ed, layer, stroke, fromIndex) {
  const ctx = layer._raster.getContext('2d');
  paintStroke(ctx, stroke, ed.theme(), fromIndex);
  layer._dirty = false;
  layer._rasterTheme = ed.theme().id;
}

// ---------- shapes ----------
function makeShape(ed, type, points) {
  const s = ed.settings.shape;
  const meta = SHAPE_META[type] || {};
  const style = {
    stroke: s.stroke || undefined,
    fill: s.fillOn ? s.fill || undefined : null,
    width: s.width,
    closed: !!meta.closed,
  };
  return createShape(type, points, style);
}

export function finishPending(ed) {
  const pend = ed.pending;
  ed.pending = null;
  ed.pendingCursor = null;
  if (!pend || pend.points.length < 2) {
    ed.render();
    return;
  }
  addObject(ed.scene, makeShape(ed, pend.type, pend.points));
  ed.commit();
}

// ---------- stamp ----------
function placeStamp(ed, w) {
  const st = ed.settings.stamp;
  const base = getSprite(st.spriteId);
  const sz = base ? base.size : 64;
  const p = ed.snap(w.x, w.y);
  const jpx = st.scatter ? st.jitter * sz : 0;
  const x = p.x + (Math.random() * 2 - 1) * jpx;
  const y = p.y + (Math.random() * 2 - 1) * jpx;
  const rotation = st.randomRotate ? Math.random() * Math.PI * 2 : st.rotation || 0;
  const scale = st.scatter ? st.scale * (0.8 + Math.random() * 0.45) : st.scale;
  addObject(
    ed.scene,
    createSprite(st.spriteId, x, y, { scale, rotation, tint: st.tint, flipX: st.flipX }),
  );
  ed._stampLast = { x: w.x, y: w.y };
}

// ---------- handlers ----------
export const TOOL_HANDLERS = {
  select: {
    cursor: 'default',
    onDown(ed, w, { sx, sy, ev }) {
      const h = handleAt(ed, sx, sy);
      if (h) {
        const box = h.box;
        const center = { x: (box.minX + box.maxX) / 2, y: (box.minY + box.maxY) / 2 };
        if (h.key === 'rot') {
          ed.drag = {
            kind: 'rotate',
            center,
            start: Math.atan2(w.y - center.y, w.x - center.x),
            snap: snapshotSel(ed),
          };
        } else {
          const pivot = oppositeCorner(box, h.key);
          ed.drag = {
            kind: 'scale',
            pivot,
            startDist: dist(pivot, w) || 1,
            snap: snapshotSel(ed),
          };
        }
        return;
      }
      const tol = 5 / ed.scene.camera.zoom;
      const hit = hitTest(ed.scene, w.x, w.y, tol);
      if (hit) {
        if (ev.shiftKey) {
          if (ed.selection.has(hit.object.id)) ed.selection.delete(hit.object.id);
          else ed.selection.add(hit.object.id);
          ed.touch();
        } else if (!ed.selection.has(hit.object.id)) {
          ed.selection = new Set([hit.object.id]);
          ed.touch();
        }
        ed.drag = { kind: 'move', last: { ...w }, moved: false };
      } else {
        if (!ev.shiftKey) ed.selection.clear();
        ed.drag = { kind: 'marquee', x0: w.x, y0: w.y, x1: w.x, y1: w.y };
        ed.touch();
      }
    },
    onMove(ed, w) {
      const d = ed.drag;
      if (!d) return;
      if (d.kind === 'move') {
        ed.translateSelection(w.x - d.last.x, w.y - d.last.y);
        d.last = { ...w };
        d.moved = true;
        ed.render();
      } else if (d.kind === 'marquee') {
        d.x1 = w.x;
        d.y1 = w.y;
        ed.render();
      } else if (d.kind === 'scale') {
        applyScale(d.snap, d.pivot, (dist(d.pivot, w) || 1) / d.startDist);
        ed.render();
      } else if (d.kind === 'rotate') {
        applyRotate(d.snap, d.center, Math.atan2(w.y - d.center.y, w.x - d.center.x) - d.start);
        ed.render();
      }
    },
    onUp(ed) {
      const d = ed.drag;
      ed.drag = null;
      if (!d) return;
      if (d.kind === 'marquee') {
        const found = objectsInRect(ed.scene, d);
        if (found.length) ed.select(found.map((o) => o.id), true);
        ed.touch();
      } else if ((d.kind === 'move' && d.moved) || d.kind === 'scale' || d.kind === 'rotate') {
        ed.commit();
      }
    },
  },

  pan: {
    cursor: 'grab',
    onDown(ed, w, { sx, sy }) {
      ed.drag = { kind: 'toolpan', sx, sy, cam: { ...ed.scene.camera } };
    },
    onMove(ed, w, { sx, sy }) {
      const d = ed.drag;
      if (!d || d.kind !== 'toolpan') return;
      ed.scene.camera = {
        ...d.cam,
        x: d.cam.x - (sx - d.sx) / d.cam.zoom,
        y: d.cam.y - (sy - d.sy) / d.cam.zoom,
      };
      ed.render();
    },
    onUp(ed) {
      ed.drag = null;
    },
  },

  terrain: {
    cursor: 'crosshair',
    onDown(ed, w) {
      const layer = ed.activeTerrain();
      ensureTerrainRaster(layer, ed.scene.size.width, ed.scene.size.height, ed.theme());
      const b = ed.settings.brush;
      const stroke = createStroke(b.material, {
        size: b.size,
        opacity: b.opacity,
        hardness: b.hardness,
        erase: b.erase,
      });
      stroke.pts.push({ x: w.x, y: w.y });
      layer.strokes.push(stroke);
      ed._terrainStroke = { layer, stroke };
      paintLive(ed, layer, stroke, 0);
      ed.render();
    },
    onMove(ed, w) {
      const ts = ed._terrainStroke;
      if (!ts) return;
      const last = ts.stroke.pts[ts.stroke.pts.length - 1];
      if (Math.hypot(w.x - last.x, w.y - last.y) < 2) return;
      ts.stroke.pts.push({ x: w.x, y: w.y });
      paintLive(ed, ts.layer, ts.stroke, ts.stroke.pts.length - 1);
      ed.render();
    },
    onUp(ed) {
      if (!ed._terrainStroke) return;
      ed._terrainStroke = null;
      ed.commit();
    },
  },

  shape: {
    cursor: 'crosshair',
    onDown(ed, w) {
      const type = ed.settings.shape.type;
      const meta = SHAPE_META[type] || {};
      const p = ed.snap(w.x, w.y);
      if (meta.drag) {
        ed.drag = { kind: 'shapeDrag', type, x0: p.x, y0: p.y, x1: p.x, y1: p.y };
      } else if (meta.freehand) {
        ed.drag = { kind: 'freehand', pts: [{ x: w.x, y: w.y }] };
      } else {
        if (!ed.pending || ed.pending.type !== type) ed.pending = { type, points: [] };
        const first = ed.pending.points[0];
        if (
          meta.closed &&
          first &&
          ed.pending.points.length >= 3 &&
          dist(p, first) < 12 / ed.scene.camera.zoom
        ) {
          finishPending(ed);
          return;
        }
        ed.pending.points.push({ x: p.x, y: p.y });
        ed.render();
      }
    },
    onMove(ed, w) {
      const d = ed.drag;
      if (d && d.kind === 'shapeDrag') {
        const p = ed.snap(w.x, w.y);
        d.x1 = p.x;
        d.y1 = p.y;
        ed.render();
      } else if (d && d.kind === 'freehand') {
        const last = d.pts[d.pts.length - 1];
        if (Math.hypot(w.x - last.x, w.y - last.y) > 3) {
          d.pts.push({ x: w.x, y: w.y });
          ed.render();
        }
      } else if (ed.pending) {
        ed.pendingCursor = { x: w.x, y: w.y };
        ed.render();
      }
    },
    onUp(ed) {
      const d = ed.drag;
      if (d && d.kind === 'shapeDrag') {
        ed.drag = null;
        if (Math.hypot(d.x1 - d.x0, d.y1 - d.y0) < 3) return;
        addObject(
          ed.scene,
          makeShape(ed, d.type, [
            { x: d.x0, y: d.y0 },
            { x: d.x1, y: d.y1 },
          ]),
        );
        ed.commit();
      } else if (d && d.kind === 'freehand') {
        ed.drag = null;
        if (d.pts.length >= 2) {
          addObject(ed.scene, makeShape(ed, 'freehand', d.pts));
          ed.commit();
        }
      }
    },
    onDouble(ed) {
      if (ed.pending) finishPending(ed);
    },
  },

  stamp: {
    cursor: 'copy',
    onDown(ed, w) {
      const st = ed.settings.stamp;
      if (!st.spriteId) {
        if (ed.toast) ed.toast('Pick a sprite from the Library panel first.');
        return;
      }
      ed._stamping = true;
      ed._stampLast = null;
      placeStamp(ed, w);
      ed.render();
    },
    onMove(ed, w) {
      if (!ed._stamping || !ed.settings.stamp.scatter) return;
      const st = ed.settings.stamp;
      const base = getSprite(st.spriteId);
      const sz = (base ? base.size : 64) * st.scale;
      const spacing = Math.max(6, sz * (1.15 - Math.min(0.95, st.density) * 0.85));
      if (ed._stampLast && dist(w, ed._stampLast) < spacing) return;
      placeStamp(ed, w);
      ed.render();
    },
    onUp(ed) {
      if (!ed._stamping) return;
      ed._stamping = false;
      ed.commit();
    },
  },

  text: {
    cursor: 'text',
    onDown(ed, w) {
      const t = ed.settings.text;
      const p = ed.snap(w.x, w.y);
      const o = createText(t.value || 'Label', p.x, p.y, {
        font: t.font,
        fontSize: t.fontSize,
        color: t.color || ed.theme().terrain.ink,
        italic: t.italic,
      });
      addObject(ed.scene, o);
      ed.selection = new Set([o.id]);
      ed.commit();
    },
  },

  eyedropper: {
    cursor: 'crosshair',
    onDown(ed, w) {
      const hit = hitTest(ed.scene, w.x, w.y, 5 / ed.scene.camera.zoom);
      if (!hit) return;
      const o = hit.object;
      if (o.kind === 'sprite') {
        Object.assign(ed.settings.stamp, { spriteId: o.spriteId, tint: o.tint, scale: o.scale });
        if (ed.toast) ed.toast('Sampled sprite into Stamp tool.');
      } else if (o.kind === 'shape') {
        Object.assign(ed.settings.shape, {
          type: o.shapeType,
          stroke: o.style.stroke || null,
          fill: o.style.fill || null,
          width: o.style.width,
        });
        if (ed.toast) ed.toast('Sampled shape style.');
      } else if (o.kind === 'text') {
        Object.assign(ed.settings.text, {
          value: o.text,
          font: o.font,
          fontSize: o.fontSize,
          color: o.color,
          italic: o.italic,
        });
      }
      ed.sync();
    },
  },
};
