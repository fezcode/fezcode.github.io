// The editor controller. Holds mutable session state (scene, history, selection,
// active tool, per-tool settings) and exposes pointer/keyboard entry points the
// React page wires to DOM events. Keeps React lean: the page renders from snapshots
// of this controller and asks it to redraw via requestRender/requestSync callbacks.

import { screenToWorld, zoomAt } from './engine/camera';
import { snapPoint } from './engine/grid';
import { getTheme } from './themes';
import {
  record,
  undo as histUndo,
  redo as histRedo,
  canUndo,
  canRedo,
} from './state/history';
import { saveLocal } from './state/serialize';
import {
  uid,
  firstTerrainLayer,
  createTerrainLayer,
  getActiveLayer,
  removeObjects,
} from './state/scene';
import { TOOL_HANDLERS, finishPending } from './tools';
import { TOOLS } from './constants';

function translateObject(o, dx, dy) {
  if (o.points) {
    for (const p of o.points) {
      p.x += dx;
      p.y += dy;
    }
  } else {
    o.x += dx;
    o.y += dy;
  }
}

function cloneForDup(o) {
  const c = JSON.parse(JSON.stringify(o));
  c.id = uid(o.kind ? o.kind[0] : 'o');
  return c;
}

function markTerrainDirtyAll(scene) {
  for (const l of scene.layers) if (l.kind === 'terrain') l._dirty = true;
}

const isTypingTarget = (t) =>
  t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);

export function createEditor({ scene, history, requestRender, requestSync, toast }) {
  const ed = {
    scene,
    history,
    selection: new Set(),
    tool: TOOLS.SELECT,
    spaceDown: false,
    pending: null,
    pendingCursor: null,
    drag: null,
    cursorWorld: null,
    settings: {
      brush: { material: 'grass', size: 60, opacity: 1, hardness: 0.8, erase: false },
      shape: { type: 'coast', stroke: null, fill: null, width: 6, fillOn: true },
      stamp: {
        spriteId: null,
        scale: 1,
        rotation: 0,
        jitter: 0.25,
        scatter: false,
        density: 0.6,
        tint: null,
        flipX: false,
        randomRotate: false,
      },
      text: { value: 'New Label', font: 'serif', fontSize: 30, color: null, italic: true },
    },
    _autosaveTimer: null,
    requestRender,
    requestSync,
    toast,
  };

  ed.theme = () => getTheme(scene.themeId);
  ed.worldFromScreen = (sx, sy) => screenToWorld(scene.camera, sx, sy);
  ed.snap = (x, y) => snapPoint(scene.grid, x, y);
  ed.render = () => requestRender();
  ed.sync = () => requestSync();
  ed.touch = () => {
    requestRender();
    requestSync();
  };

  ed.autosave = () => {
    if (ed._autosaveTimer) clearTimeout(ed._autosaveTimer);
    ed._autosaveTimer = setTimeout(() => saveLocal(scene), 600);
  };
  ed.commit = () => {
    scene.meta.updatedAt = Date.now();
    record(history, scene);
    ed.autosave();
    requestRender();
    requestSync();
  };

  ed.setTool = (tool) => {
    if (ed.pending) ed.cancelPending();
    ed.tool = tool;
    ed.drag = null;
    ed.touch();
  };
  ed.cancelPending = () => {
    ed.pending = null;
    ed.pendingCursor = null;
    ed.drag = null;
    ed.render();
  };
  ed.finishPending = () => finishPending(ed);

  ed.activeTerrain = () => {
    const a = getActiveLayer(scene);
    if (a && a.kind === 'terrain') return a;
    let t = firstTerrainLayer(scene);
    if (!t) {
      t = createTerrainLayer('Terrain');
      scene.layers.unshift(t);
    }
    return t;
  };

  // ----- selection -----
  ed.clearSelection = () => {
    if (ed.selection.size) {
      ed.selection.clear();
      ed.touch();
    }
  };
  ed.select = (ids, additive = false) => {
    if (!additive) ed.selection.clear();
    (Array.isArray(ids) ? ids : [ids]).forEach((id) => ed.selection.add(id));
    ed.touch();
  };
  ed.selectAll = () => {
    ed.selection.clear();
    for (const l of scene.layers) {
      if (l.kind === 'object' && l.visible && !l.locked) {
        for (const o of l.objects) ed.selection.add(o.id);
      }
    }
    ed.touch();
  };
  ed.selectedObjects = () => {
    const out = [];
    for (const l of scene.layers) {
      if (l.kind !== 'object') continue;
      for (const o of l.objects) if (ed.selection.has(o.id)) out.push({ layer: l, object: o });
    }
    return out;
  };

  ed.translateSelection = (dx, dy) => {
    for (const { object: o } of ed.selectedObjects()) translateObject(o, dx, dy);
  };
  ed.deleteSelection = () => {
    if (!ed.selection.size) return;
    removeObjects(scene, [...ed.selection]);
    ed.selection.clear();
    ed.commit();
  };
  ed.duplicateSelection = () => {
    const sel = ed.selectedObjects();
    if (!sel.length) return;
    const ids = [];
    for (const { layer, object } of sel) {
      const copy = cloneForDup(object);
      translateObject(copy, 26, 26);
      layer.objects.push(copy);
      ids.push(copy.id);
    }
    ed.selection = new Set(ids);
    ed.commit();
  };
  ed.nudge = (dx, dy) => {
    if (!ed.selection.size) return;
    ed.translateSelection(dx, dy);
    ed.commit();
  };
  ed.zorder = (dir) => {
    if (!ed.selection.size) return;
    for (const { layer, object } of ed.selectedObjects()) {
      const arr = layer.objects;
      const i = arr.indexOf(object);
      if (i < 0) continue;
      arr.splice(i, 1);
      if (dir === 'front') arr.push(object);
      else if (dir === 'back') arr.unshift(object);
      else if (dir === 'forward') arr.splice(Math.min(arr.length, i + 1), 0, object);
      else arr.splice(Math.max(0, i - 1), 0, object);
    }
    ed.commit();
  };
  ed.updateSelected = (patch) => {
    let n = 0;
    for (const { object: o } of ed.selectedObjects()) {
      Object.assign(o, patch);
      if (patch.style) o.style = { ...o.style, ...patch.style };
      n += 1;
    }
    if (n) ed.commit();
  };

  // ----- camera -----
  ed.zoomAtScreen = (sx, sy, factor) => {
    scene.camera = zoomAt(scene.camera, sx, sy, factor);
    ed.touch();
  };
  ed.setZoom = (zoom, cssW, cssH) => {
    const cx = cssW / 2;
    const cy = cssH / 2;
    scene.camera = zoomAt(scene.camera, cx, cy, zoom / scene.camera.zoom);
    ed.touch();
  };
  ed.fit = (cssW, cssH, pad = 80) => {
    const { width, height } = scene.size;
    const zoom = Math.min((cssW - pad * 2) / width, (cssH - pad * 2) / height);
    scene.camera = {
      zoom,
      x: width / 2 - cssW / 2 / zoom,
      y: height / 2 - cssH / 2 / zoom,
    };
    ed.touch();
  };

  // ----- pointer dispatch -----
  ed.onPointerDown = (sx, sy, ev) => {
    if (ed.spaceDown || ev.button === 1) {
      ed.drag = { kind: 'pan', sx, sy, cam: { ...scene.camera } };
      return;
    }
    if (ev.button === 2) return;
    const h = TOOL_HANDLERS[ed.tool] || TOOL_HANDLERS.select;
    if (h.onDown) h.onDown(ed, ed.worldFromScreen(sx, sy), { sx, sy, ev });
  };
  ed.onPointerMove = (sx, sy, ev) => {
    ed.cursorWorld = ed.worldFromScreen(sx, sy);
    if (ed.drag && ed.drag.kind === 'pan') {
      const d = ed.drag;
      scene.camera = {
        ...d.cam,
        x: d.cam.x - (sx - d.sx) / d.cam.zoom,
        y: d.cam.y - (sy - d.sy) / d.cam.zoom,
      };
      ed.render();
      return;
    }
    const h = TOOL_HANDLERS[ed.tool] || TOOL_HANDLERS.select;
    if (h.onMove) h.onMove(ed, ed.cursorWorld, { sx, sy, ev });
    else if (ed.tool === TOOLS.terrain || ed.tool === TOOLS.stamp) ed.render();
  };
  ed.onPointerUp = (sx, sy, ev) => {
    if (ed.drag && ed.drag.kind === 'pan') {
      ed.drag = null;
      return;
    }
    const h = TOOL_HANDLERS[ed.tool] || TOOL_HANDLERS.select;
    if (h.onUp) h.onUp(ed, ed.worldFromScreen(sx, sy), { sx, sy, ev });
  };
  ed.onDoubleClick = (sx, sy, ev) => {
    const h = TOOL_HANDLERS[ed.tool];
    if (h && h.onDouble) h.onDouble(ed, ed.worldFromScreen(sx, sy), { sx, sy, ev });
  };
  ed.onWheel = (sx, sy, deltaY) => {
    ed.zoomAtScreen(sx, sy, deltaY < 0 ? 1.12 : 1 / 1.12);
  };

  // ----- undo/redo -----
  ed.undo = () => {
    if (histUndo(history, scene)) {
      ed.selection.clear();
      markTerrainDirtyAll(scene);
      ed.autosave();
      ed.touch();
    }
  };
  ed.redo = () => {
    if (histRedo(history, scene)) {
      ed.selection.clear();
      markTerrainDirtyAll(scene);
      ed.autosave();
      ed.touch();
    }
  };
  ed.canUndo = () => canUndo(history);
  ed.canRedo = () => canRedo(history);

  // ----- keyboard -----
  ed.onKeyDown = (ev) => {
    if (isTypingTarget(ev.target)) return;
    const mod = ev.ctrlKey || ev.metaKey;
    const k = ev.key;
    if (mod && (k === 'z' || k === 'Z')) {
      ev.preventDefault();
      if (ev.shiftKey) ed.redo();
      else ed.undo();
      return;
    }
    if (mod && (k === 'y' || k === 'Y')) {
      ev.preventDefault();
      ed.redo();
      return;
    }
    if (mod && (k === 'd' || k === 'D')) {
      ev.preventDefault();
      ed.duplicateSelection();
      return;
    }
    if (mod && (k === 'a' || k === 'A')) {
      ev.preventDefault();
      ed.selectAll();
      return;
    }
    if (k === 'Delete' || k === 'Backspace') {
      ev.preventDefault();
      ed.deleteSelection();
      return;
    }
    if (k === 'Escape') {
      if (ed.pending) ed.cancelPending();
      else ed.clearSelection();
      return;
    }
    if (k === 'Enter') {
      if (ed.pending) ed.finishPending();
      return;
    }
    if (k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp' || k === 'ArrowDown') {
      if (!ed.selection.size) return;
      ev.preventDefault();
      const step = ev.shiftKey ? 10 : 1;
      const dx = (k === 'ArrowRight' ? 1 : k === 'ArrowLeft' ? -1 : 0) * step;
      const dy = (k === 'ArrowDown' ? 1 : k === 'ArrowUp' ? -1 : 0) * step;
      ed.nudge(dx, dy);
      return;
    }
    const shortcuts = {
      v: TOOLS.SELECT,
      h: TOOLS.PAN,
      b: TOOLS.TERRAIN,
      p: TOOLS.SHAPE,
      s: TOOLS.STAMP,
      t: TOOLS.TEXT,
      i: TOOLS.EYEDROPPER,
    };
    if (!mod && shortcuts[k]) ed.setTool(shortcuts[k]);
  };

  return ed;
}
