// Camera: pan/zoom transforms and screen<->world mapping.
// camera = { x, y, zoom } where (x,y) is the world point shown at screen (0,0).

import { clamp } from './geometry';
import { MIN_ZOOM, MAX_ZOOM } from '../constants';

export function screenToWorld(camera, sx, sy) {
  return { x: sx / camera.zoom + camera.x, y: sy / camera.zoom + camera.y };
}

export function worldToScreen(camera, wx, wy) {
  return { x: (wx - camera.x) * camera.zoom, y: (wy - camera.y) * camera.zoom };
}

export function applyCamera(ctx, camera) {
  ctx.setTransform(
    camera.zoom,
    0,
    0,
    camera.zoom,
    -camera.x * camera.zoom,
    -camera.y * camera.zoom,
  );
}

// Zoom by `factor`, keeping the world point under screen (sx,sy) fixed.
export function zoomAt(camera, sx, sy, factor) {
  const zoom = clamp(camera.zoom * factor, MIN_ZOOM, MAX_ZOOM);
  const wx = sx / camera.zoom + camera.x;
  const wy = sy / camera.zoom + camera.y;
  return { zoom, x: wx - sx / zoom, y: wy - sy / zoom };
}

export function panBy(camera, dxScreen, dyScreen) {
  return { ...camera, x: camera.x - dxScreen / camera.zoom, y: camera.y - dyScreen / camera.zoom };
}
