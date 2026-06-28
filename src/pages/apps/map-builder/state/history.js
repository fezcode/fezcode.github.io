// Snapshot-based undo/redo. Because terrain is vector strokes (not a raster),
// snapshots are cheap deep clones of plain data. Camera/selection are intentionally
// excluded — panning and selecting are not undoable actions.

import { HISTORY_LIMIT } from '../constants';

function cloneObject(o) {
  return {
    ...o,
    points: o.points ? o.points.map((p) => ({ ...p })) : undefined,
    style: o.style ? { ...o.style } : undefined,
  };
}

function cloneStroke(s) {
  return { ...s, pts: s.pts.map((p) => ({ ...p })) };
}

function cloneLayer(l) {
  if (l.kind === 'object') {
    return { ...l, objects: l.objects.map(cloneObject) };
  }
  return {
    ...l,
    strokes: l.strokes.map(cloneStroke),
    _raster: null,
    _dirty: true,
  };
}

export function snapshot(scene) {
  return {
    themeId: scene.themeId,
    grid: { ...scene.grid },
    size: { ...scene.size },
    activeLayerId: scene.activeLayerId,
    meta: { ...scene.meta },
    layers: scene.layers.map(cloneLayer),
  };
}

export function restore(scene, snap) {
  scene.themeId = snap.themeId;
  scene.grid = { ...snap.grid };
  scene.size = { ...snap.size };
  scene.activeLayerId = snap.activeLayerId;
  scene.meta = { ...snap.meta };
  // clone again so the stored snapshot is never mutated by subsequent edits
  scene.layers = snap.layers.map(cloneLayer);
}

export function createHistory(scene) {
  return { stack: [snapshot(scene)], index: 0 };
}

export function record(history, scene) {
  // drop any redo branch, append new state
  history.stack = history.stack.slice(0, history.index + 1);
  history.stack.push(snapshot(scene));
  if (history.stack.length > HISTORY_LIMIT) {
    history.stack.shift();
  }
  history.index = history.stack.length - 1;
}

export function undo(history, scene) {
  if (history.index <= 0) return false;
  history.index -= 1;
  restore(scene, history.stack[history.index]);
  return true;
}

export function redo(history, scene) {
  if (history.index >= history.stack.length - 1) return false;
  history.index += 1;
  restore(scene, history.stack[history.index]);
  return true;
}

export const canUndo = (history) => history.index > 0;
export const canRedo = (history) => history.index < history.stack.length - 1;
