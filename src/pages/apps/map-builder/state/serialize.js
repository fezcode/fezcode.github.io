// Scene <-> JSON. Terrain is stroke-based, so serialization is small and lossless;
// the raster is rebuilt from strokes on load. Also handles localStorage autosave
// and file import/export.

import { AUTOSAVE_KEY } from '../constants';
import { createScene, uid } from './scene';

export function serializeScene(scene) {
  return {
    v: 1,
    meta: { ...scene.meta },
    camera: { ...scene.camera },
    grid: { ...scene.grid },
    themeId: scene.themeId,
    size: { ...scene.size },
    activeLayerId: scene.activeLayerId,
    layers: scene.layers.map((l) => {
      const base = {
        id: l.id,
        name: l.name,
        kind: l.kind,
        visible: l.visible,
        locked: l.locked,
        opacity: l.opacity,
      };
      if (l.kind === 'object') {
        base.objects = l.objects;
      } else {
        base.strokes = l.strokes;
      }
      return base;
    }),
  };
}

export function deserializeScene(json) {
  if (!json || !Array.isArray(json.layers)) return createScene();
  const scene = createScene();
  scene.meta = { ...scene.meta, ...(json.meta || {}) };
  scene.camera = json.camera || scene.camera;
  scene.grid = { ...scene.grid, ...(json.grid || {}) };
  scene.themeId = json.themeId || scene.themeId;
  scene.size = { ...scene.size, ...(json.size || {}) };
  scene.layers = json.layers.map((l) => {
    if (l.kind === 'terrain') {
      return {
        id: l.id || uid('L'),
        name: l.name || 'Terrain',
        kind: 'terrain',
        visible: l.visible !== false,
        locked: !!l.locked,
        opacity: l.opacity ?? 1,
        strokes: Array.isArray(l.strokes) ? l.strokes : [],
        _raster: null,
        _dirty: true,
      };
    }
    return {
      id: l.id || uid('L'),
      name: l.name || 'Layer',
      kind: 'object',
      visible: l.visible !== false,
      locked: !!l.locked,
      opacity: l.opacity ?? 1,
      objects: Array.isArray(l.objects) ? l.objects : [],
    };
  });
  if (!scene.layers.some((l) => l.id === json.activeLayerId)) {
    const obj = scene.layers.find((l) => l.kind === 'object');
    scene.activeLayerId = obj ? obj.id : scene.layers[0]?.id;
  } else {
    scene.activeLayerId = json.activeLayerId;
  }
  return scene;
}

export function saveLocal(scene) {
  try {
    const data = serializeScene(scene);
    data.meta.updatedAt = Date.now();
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    return false;
  }
}

export function loadLocal() {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    return deserializeScene(JSON.parse(raw));
  } catch (e) {
    return null;
  }
}

export function clearLocal() {
  try {
    localStorage.removeItem(AUTOSAVE_KEY);
  } catch (e) {
    /* ignore */
  }
}

export function exportJSON(scene) {
  return JSON.stringify(serializeScene(scene), null, 2);
}

export function importJSON(text) {
  return deserializeScene(JSON.parse(text));
}
