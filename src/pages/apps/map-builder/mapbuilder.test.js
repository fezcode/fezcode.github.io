import { describe, it, expect } from 'vitest';
import {
  createScene,
  createSprite,
  createStroke,
  addObject,
  firstTerrainLayer,
} from './state/scene';
import { serializeScene, deserializeScene } from './state/serialize';
import { createHistory, record, undo, redo, canUndo } from './state/history';
import { screenToWorld, worldToScreen, zoomAt } from './engine/camera';
import { snapSquare, snapPoint } from './engine/grid';
import { pointInPolygon, distToSegment, rotatePoint, clamp } from './engine/geometry';

describe('serialize', () => {
  it('round-trips sprites and terrain strokes', () => {
    const s = createScene();
    addObject(s, createSprite('nature.tree.oak.1', 100, 120, { scale: 2, rotation: 0.5 }));
    const terrain = firstTerrainLayer(s);
    const stroke = createStroke('water', { size: 40 });
    stroke.pts.push({ x: 10, y: 10 }, { x: 20, y: 30 });
    terrain.strokes.push(stroke);

    const json = JSON.parse(JSON.stringify(serializeScene(s)));
    const s2 = deserializeScene(json);

    expect(s2.layers.length).toBe(s.layers.length);
    const objs = s2.layers.find((l) => l.kind === 'object').objects;
    expect(objs[0].spriteId).toBe('nature.tree.oak.1');
    expect(objs[0].scale).toBe(2);
    const t2 = s2.layers.find((l) => l.kind === 'terrain');
    expect(t2.strokes[0].pts.length).toBe(2);
    expect(t2.strokes[0].material).toBe('water');
  });
});

describe('history', () => {
  it('undo/redo an object insertion', () => {
    const s = createScene();
    const h = createHistory(s);
    const objLayer = () => s.layers.find((l) => l.kind === 'object');
    addObject(s, createSprite('x', 0, 0));
    record(h, s);
    expect(objLayer().objects.length).toBe(1);
    expect(canUndo(h)).toBe(true);
    undo(h, s);
    expect(s.layers.find((l) => l.kind === 'object').objects.length).toBe(0);
    redo(h, s);
    expect(s.layers.find((l) => l.kind === 'object').objects.length).toBe(1);
  });
});

describe('camera', () => {
  it('screen<->world round trips', () => {
    const cam = { x: 50, y: 30, zoom: 2 };
    const w = screenToWorld(cam, 100, 80);
    const sc = worldToScreen(cam, w.x, w.y);
    expect(sc.x).toBeCloseTo(100);
    expect(sc.y).toBeCloseTo(80);
  });
  it('zoomAt keeps the anchor point fixed', () => {
    const cam = { x: 50, y: 30, zoom: 2 };
    const before = screenToWorld(cam, 120, 90);
    const z = zoomAt(cam, 120, 90, 1.5);
    const after = screenToWorld(z, 120, 90);
    expect(after.x).toBeCloseTo(before.x);
    expect(after.y).toBeCloseTo(before.y);
  });
});

describe('grid', () => {
  it('snaps to the nearest square', () => {
    expect(snapSquare(53, 0, 48)).toEqual({ x: 48, y: 0 });
    expect(snapSquare(72, 72, 48)).toEqual({ x: 96, y: 96 });
  });
  it('snapPoint is identity when snapping is off', () => {
    expect(snapPoint({ snap: false }, 13, 27)).toEqual({ x: 13, y: 27 });
  });
});

describe('geometry', () => {
  it('clamp bounds values', () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 3)).toBe(0);
  });
  it('pointInPolygon for a square', () => {
    const sq = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ];
    expect(pointInPolygon(5, 5, sq)).toBe(true);
    expect(pointInPolygon(15, 5, sq)).toBe(false);
  });
  it('distToSegment measures perpendicular distance', () => {
    expect(distToSegment(5, 5, { x: 0, y: 0 }, { x: 10, y: 0 })).toBeCloseTo(5);
  });
  it('rotatePoint rotates 90 degrees', () => {
    const p = rotatePoint(1, 0, 0, 0, Math.PI / 2);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(1);
  });
});
