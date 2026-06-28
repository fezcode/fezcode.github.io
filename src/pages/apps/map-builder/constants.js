// Map Builder — shared constants.

export const TOOLS = {
  SELECT: 'select',
  PAN: 'pan',
  TERRAIN: 'terrain',
  SHAPE: 'shape',
  STAMP: 'stamp',
  TEXT: 'text',
  EYEDROPPER: 'eyedropper',
};

export const CATEGORIES = [
  { id: 'nature', label: 'Nature' },
  { id: 'medieval', label: 'Medieval' },
  { id: 'modern', label: 'Modern' },
  { id: 'transit', label: 'Transit' },
  { id: 'symbols', label: 'Symbols' },
  { id: 'decoration', label: 'Decoration' },
];

export const SHAPE_TYPES = [
  { id: 'coast', label: 'Coast / Land', spline: true },
  { id: 'river', label: 'River', spline: true },
  { id: 'road', label: 'Road', spline: true },
  { id: 'rail', label: 'Railway', spline: true },
  { id: 'wall', label: 'Wall', spline: true },
  { id: 'zone', label: 'Zone / District', spline: true, closed: true },
  { id: 'contour', label: 'Contour', spline: true },
  { id: 'polygon', label: 'Polygon', closed: true },
  { id: 'rect', label: 'Rectangle', drag: true },
  { id: 'ellipse', label: 'Ellipse', drag: true },
  { id: 'line', label: 'Line', drag: true },
  { id: 'arrow', label: 'Arrow', drag: true },
  { id: 'freehand', label: 'Freehand', freehand: true },
];

export const TERRAIN_MATERIALS = [
  { id: 'grass', label: 'Grass' },
  { id: 'forest', label: 'Forest floor' },
  { id: 'water', label: 'Water' },
  { id: 'waterDeep', label: 'Deep water' },
  { id: 'sand', label: 'Sand' },
  { id: 'stone', label: 'Stone' },
  { id: 'snow', label: 'Snow' },
  { id: 'dirt', label: 'Dirt' },
  { id: 'road', label: 'Paving' },
];

export const DEFAULT_SPRITE_SIZE = 64;
export const SPRITE_PAD = 10; // bitmap padding so shadows/outlines aren't clipped
export const MIN_ZOOM = 0.06;
export const MAX_ZOOM = 14;
export const HISTORY_LIMIT = 40;
export const GRID_DEFAULT = 48;
export const AUTOSAVE_KEY = 'fez.mapbuilder.autosave.v1';
