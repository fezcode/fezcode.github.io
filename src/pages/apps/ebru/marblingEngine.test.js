import {
  hexToRgb,
  sampleBilinear,
  tineDisplacement,
  MarblingTray,
} from './marblingEngine';

// build a w×h solid-color RGBA buffer
const solid = (w, h, [r, g, b]) => {
  const buf = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < buf.length; i += 4) {
    buf[i] = r;
    buf[i + 1] = g;
    buf[i + 2] = b;
    buf[i + 3] = 255;
  }
  return buf;
};

const pixel = (tray, x, y) => {
  const i = (y * tray.BW + x) * 4;
  return [tray.buf[i], tray.buf[i + 1], tray.buf[i + 2]];
};

describe('hexToRgb', () => {
  test('parses a hex color', () => {
    expect(hexToRgb('#1F4E6B')).toEqual([31, 78, 107]);
    expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
    expect(hexToRgb('#FFFFFF')).toEqual([255, 255, 255]);
  });
});

describe('sampleBilinear', () => {
  test('returns the exact pixel at integer coordinates', () => {
    const buf = new Uint8ClampedArray([
      10, 20, 30, 255, 40, 50, 60, 255, // row 0: (0,0) (1,0)
      70, 80, 90, 255, 100, 110, 120, 255, // row 1: (0,1) (1,1)
    ]);
    expect(sampleBilinear(buf, 2, 2, 0, 0).slice(0, 3)).toEqual([10, 20, 30]);
    expect(sampleBilinear(buf, 2, 2, 1, 1).slice(0, 3)).toEqual([100, 110, 120]);
  });

  test('averages four neighbours at the center', () => {
    const buf = new Uint8ClampedArray([
      0, 0, 0, 255, 100, 0, 0, 255,
      0, 0, 0, 255, 100, 0, 0, 255,
    ]);
    // center of a 2x2 where right column is 100 -> red 50
    expect(sampleBilinear(buf, 2, 2, 0.5, 0.5)[0]).toBeCloseTo(50, 5);
  });

  test('edge-clamps out-of-bounds coordinates', () => {
    const buf = solid(2, 2, [12, 34, 56]);
    expect(sampleBilinear(buf, 2, 2, -5, -5).slice(0, 3)).toEqual([12, 34, 56]);
    expect(sampleBilinear(buf, 2, 2, 99, 99).slice(0, 3)).toEqual([12, 34, 56]);
  });
});

describe('tineDisplacement', () => {
  test('a point on the stroke is dragged by ~the full stroke length along u', () => {
    // stroke A=(0,0) dir +x, len 10; point on the stroke line, perp 0, along in range
    const [dx, dy] = tineDisplacement(5, 0, 0, 0, 1, 0, 10, 1, 0, 16);
    expect(dx).toBeCloseTo(10, 6);
    expect(dy).toBeCloseTo(0, 6);
  });

  test('displacement decays with perpendicular distance', () => {
    const near = tineDisplacement(5, 4, 0, 0, 1, 0, 10, 1, 0, 16)[0];
    const far = tineDisplacement(5, 80, 0, 0, 1, 0, 10, 1, 0, 16)[0];
    expect(near).toBeGreaterThan(far);
    expect(far).toBeLessThan(0.2);
    expect(near).toBeGreaterThan(0);
  });

  test('a comb drags paint that lies on an outer tine', () => {
    // stroke +y; teeth along x at (i-mid)*spacing. With tines=9, spacing=18,
    // tooth i=8 sits at x = (8-4)*18 = 72.
    const [, dy] = tineDisplacement(72, 5, 0, 0, 0, 1, 10, 9, 18, 9);
    expect(dy).toBeGreaterThan(8); // dragged ~full length along +y
  });
});

describe('MarblingTray', () => {
  test('starts filled with water and reports empty', () => {
    const tray = new MarblingTray({ width: 40, height: 40, water: '#ECE3CD' });
    expect(tray.isEmpty).toBe(true);
    expect(pixel(tray, 20, 20)).toEqual(hexToRgb('#ECE3CD'));
  });

  test('drop paints its disk and is no longer empty', () => {
    const tray = new MarblingTray({ width: 80, height: 80, water: '#ECE3CD' });
    tray.drop({ x: 40, y: 40 }, 12, '#1F4E6B');
    expect(tray.isEmpty).toBe(false);
    expect(pixel(tray, 40, 40)).toEqual(hexToRgb('#1F4E6B')); // center is ink
  });

  test('a second concentric drop pushes the first colour outward into a ring', () => {
    const tray = new MarblingTray({ width: 120, height: 120, water: '#ECE3CD' });
    const c = { x: 60, y: 60 };
    tray.drop(c, 20, '#B23A2A'); // red disk r=20
    tray.drop(c, 15, '#1F4E6B'); // blue disk r=15 pushes red out to ~sqrt(20²+15²)=25
    // at radius 22 we should now see red (pushed-out ring), not blue, not water
    const red = hexToRgb('#B23A2A');
    const got = pixel(tray, 60 + 22, 60);
    expect(Math.abs(got[0] - red[0])).toBeLessThan(40);
    expect(got[0]).toBeGreaterThan(got[2]); // reddish, not blue
  });

  test('a stroke actually moves paint', () => {
    const tray = new MarblingTray({ width: 120, height: 120, water: '#ECE3CD' });
    tray.drop({ x: 60, y: 60 }, 18, '#1F4E6B');
    const before = pixel(tray, 60, 30); // above the drop, still water
    tray.beginStroke();
    tray.stroke({ x: 60, y: 55 }, { x: 60, y: 35 }, { kind: 'needle' });
    tray.endStroke();
    const after = pixel(tray, 60, 30);
    expect(after).not.toEqual(before); // ink dragged upward into formerly-water area
  });

  test('undo restores the previous state; clear resets to water', () => {
    const tray = new MarblingTray({ width: 60, height: 60, water: '#ECE3CD' });
    const water = hexToRgb('#ECE3CD');
    tray.drop({ x: 30, y: 30 }, 10, '#1F4E6B');
    expect(tray.isEmpty).toBe(false);
    expect(tray.undo()).toBe(true);
    expect(tray.isEmpty).toBe(true);
    expect(pixel(tray, 30, 30)).toEqual(water);
    tray.drop({ x: 30, y: 30 }, 10, '#1F4E6B');
    tray.clear();
    expect(tray.isEmpty).toBe(true);
    expect(pixel(tray, 30, 30)).toEqual(water);
    expect(tray.undo()).toBe(false);
  });

  test('undo depth is bounded', () => {
    const tray = new MarblingTray({ width: 30, height: 30, undoDepth: 3 });
    for (let i = 0; i < 6; i++) tray.drop({ x: 15, y: 15 }, 4, '#1F4E6B');
    expect(tray.history.length).toBeLessThanOrEqual(3);
  });
});
