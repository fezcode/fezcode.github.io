// The document model. A Scene is a stack of Layers (bottom-first). Terrain layers
// store paint as vector brush *strokes* (the raster is a runtime-derived cache),
// which keeps undo snapshots and save files tiny. Object layers hold sprites,
// shapes, and text.

import { GRID_DEFAULT } from '../constants';
import { DEFAULT_THEME } from '../themes';

let _counter = 1;
export function uid(prefix = 'o') {
  _counter += 1;
  const rnd = Math.floor(Math.random() * 1679616).toString(36);
  return `${prefix}${_counter.toString(36)}${rnd}`;
}

export function createObjectLayer(name = 'Layer') {
  return {
    id: uid('L'),
    name,
    kind: 'object',
    visible: true,
    locked: false,
    opacity: 1,
    objects: [],
  };
}

export function createTerrainLayer(name = 'Terrain') {
  return {
    id: uid('L'),
    name,
    kind: 'terrain',
    visible: true,
    locked: false,
    opacity: 1,
    strokes: [],
    _raster: null, // runtime cache, never serialized
    _dirty: true,
  };
}

export function createScene() {
  const terrain = createTerrainLayer('Terrain');
  const ink = createObjectLayer('Ink');
  return {
    v: 1,
    meta: { title: 'Untitled Map', createdAt: Date.now(), updatedAt: Date.now() },
    camera: { x: 0, y: 0, zoom: 1 },
    grid: { type: 'square', size: GRID_DEFAULT, visible: false, snap: false },
    themeId: DEFAULT_THEME,
    size: { mode: 'fixed', width: 2400, height: 1500 },
    layers: [terrain, ink],
    activeLayerId: ink.id,
  };
}

// ---- object factories ----
export function createSprite(spriteId, x, y, opts = {}) {
  return {
    id: uid('s'),
    kind: 'sprite',
    spriteId,
    x,
    y,
    scale: opts.scale ?? 1,
    rotation: opts.rotation ?? 0,
    opacity: opts.opacity ?? 1,
    flipX: opts.flipX ?? false,
    tint: opts.tint ?? null,
    w: opts.w,
    h: opts.h,
  };
}

export function createShape(shapeType, points, style = {}) {
  return {
    id: uid('p'),
    kind: 'shape',
    shapeType,
    points: points.map((p) => ({ x: p.x, y: p.y })),
    closed: !!style.closed,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    opacity: style.opacity ?? 1,
    style: {
      stroke: style.stroke ?? '#2c2418',
      fill: style.fill ?? null,
      width: style.width ?? 4,
      dash: style.dash ?? null,
      pattern: style.pattern ?? null,
    },
  };
}

export function createText(text, x, y, opts = {}) {
  return {
    id: uid('t'),
    kind: 'text',
    text,
    x,
    y,
    scale: 1,
    rotation: opts.rotation ?? 0,
    opacity: 1,
    font: opts.font ?? 'serif',
    fontSize: opts.fontSize ?? 28,
    color: opts.color ?? '#2c2418',
    align: opts.align ?? 'center',
    italic: opts.italic ?? true,
    letterSpacing: opts.letterSpacing ?? 1,
    w: opts.w,
    h: opts.h,
  };
}

export function createStroke(material, opts = {}) {
  return {
    material,
    size: opts.size ?? 60,
    opacity: opts.opacity ?? 1,
    hardness: opts.hardness ?? 0.7,
    erase: opts.erase ?? false,
    pts: [],
  };
}

// ---- accessors / mutators ----
export const getLayer = (scene, id) => scene.layers.find((l) => l.id === id);
export const getActiveLayer = (scene) => getLayer(scene, scene.activeLayerId);

export function findObject(scene, objId) {
  for (const l of scene.layers) {
    if (l.kind !== 'object') continue;
    const o = l.objects.find((x) => x.id === objId);
    if (o) return { layer: l, object: o };
  }
  return null;
}

export function addObject(scene, obj, layerId = scene.activeLayerId) {
  let layer = getLayer(scene, layerId);
  if (!layer || layer.kind !== 'object') layer = scene.layers.find((l) => l.kind === 'object');
  if (!layer) {
    layer = createObjectLayer('Ink');
    scene.layers.push(layer);
    scene.activeLayerId = layer.id;
  }
  layer.objects.push(obj);
  return obj;
}

export function removeObjects(scene, ids) {
  const set = new Set(ids);
  for (const l of scene.layers) {
    if (l.kind === 'object') l.objects = l.objects.filter((o) => !set.has(o.id));
  }
}

export function firstObjectLayerId(scene) {
  const l = scene.layers.find((x) => x.kind === 'object');
  return l ? l.id : null;
}

export function firstTerrainLayer(scene) {
  return scene.layers.find((x) => x.kind === 'terrain');
}
