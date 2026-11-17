import { describe, it, expect } from 'vitest';
import {
  BANDS,
  COLOURWAYS,
  badgeGrid,
  headingGrid,
  iconGrid,
  medallion,
  panelGrid,
  pickBySeed,
  rugGrid,
  sideBandGrid,
  withContour,
  withShadow,
} from './patterns';
import { WOOL, makeGrid, getCell, setCell, seedOf } from './engine';

const count = (g, hex) => g.cells.filter((c) => c === hex).length;

describe('bands', () => {
  it('every band fills the width it is asked for', () => {
    Object.entries(BANDS).forEach(([, band]) => {
      const g = band(97, {});
      expect(g.cols).toBe(97);
      expect(g.rows).toBeGreaterThan(0);
      expect(g.cells.every(Boolean)).toBe(true);
    });
  });

  it('the side band is eight pips wide and as tall as asked', () => {
    const g = sideBandGrid(120);
    expect(g.cols).toBe(8);
    expect(g.rows).toBe(120);
    expect(getCell(g, 0, 5)).toBe(WOOL.walnut);
    expect(getCell(g, 1, 5)).toBe(WOOL.saffron);
  });
});

describe('medallion', () => {
  it('is mirror-symmetric about its centre', () => {
    const g = makeGrid(41, 41, null);
    medallion(g, 20, 20, 12, COLOURWAYS[0]);
    for (let r = 0; r < 41; r++)
      for (let c = 0; c < 41; c++) {
        expect(getCell(g, c, r)).toBe(getCell(g, 40 - c, r));
        expect(getCell(g, c, r)).toBe(getCell(g, c, 40 - r));
      }
  });

  it('has an eye at its centre and a rim on its tips', () => {
    const way = COLOURWAYS[1];
    const g = makeGrid(31, 31, null);
    medallion(g, 15, 15, 10, way);
    expect(getCell(g, 15, 15)).toBe(way.eye);
    expect(getCell(g, 15, 5)).toBe(way.rim);
  });
});

describe('woven type', () => {
  it('a shadow adds one pip right and below, only where there was no weft', () => {
    const g = makeGrid(3, 3, null);
    setCell(g, 1, 1, WOOL.ivory);
    const s = withShadow(g);
    expect(s.cols).toBe(4);
    expect(s.rows).toBe(4);
    expect(getCell(s, 1, 1)).toBe(WOOL.ivory);
    expect(getCell(s, 2, 2)).toBe(WOOL.walnut);
    expect(count(s, WOOL.walnut)).toBe(1);
  });

  it('a contour rings every set cell', () => {
    const g = makeGrid(1, 1, WOOL.ivory);
    const c = withContour(g);
    expect(c.cols).toBe(3);
    expect(count(c, WOOL.indigo)).toBe(8);
    expect(getCell(c, 1, 1)).toBe(WOOL.ivory);
  });

  it('double gauge headings are twice as tall as the chart, plus the shadow', () => {
    const g = headingGrid({ text: 'KILIM' });
    expect(g.rows).toBe(7 * 2 + 1);
    expect(count(g, WOOL.ivory)).toBeGreaterThan(0);
  });

  it('wraps a heading to the columns it is given', () => {
    const g = headingGrid({ text: 'Recent writing from the loom', maxCols: 80 });
    expect(g.cols).toBeLessThanOrEqual(80);
    expect(g.lines).toBeGreaterThan(1);
  });

  it('weaves Turkish titles by folding to the chart', () => {
    const g = headingGrid({ text: 'Kuşbaşı Çiğ Köfte' });
    expect(count(g, WOOL.ivory)).toBeGreaterThan(40);
  });
});

describe('rugs, panels and badges', () => {
  it('a rug is framed in walnut and keeps its title inside the frame', () => {
    const g = rugGrid(220, { title: 'A mind, in motion.' });
    expect(getCell(g, 0, 0)).toBe(WOOL.walnut);
    expect(getCell(g, 219, g.rows - 1)).toBe(WOOL.walnut);
    expect(count(g, WOOL.ivory)).toBeGreaterThan(200);
  });

  it('a narrow rug drops its medallions but still weaves the title', () => {
    const g = rugGrid(72, { title: 'Logs' });
    expect(g.cols).toBe(72);
    expect(g.rows).toBeGreaterThanOrEqual(50);
  });

  it('the same seed always gives the same panel and badge', () => {
    expect(panelGrid(60, 'gobake').cells).toEqual(panelGrid(60, 'gobake').cells);
    expect(badgeGrid('ebru').cells).toEqual(badgeGrid('ebru').cells);
    expect(pickBySeed('piml', COLOURWAYS)).toBe(COLOURWAYS[seedOf('piml') % COLOURWAYS.length]);
  });

  it('icons resolve Phosphor names and fall back to a dot', () => {
    expect(iconGrid('House').cells).toEqual(iconGrid('home').cells);
    expect(iconGrid('NoSuchIconAnywhere').cols).toBe(7);
  });
});
