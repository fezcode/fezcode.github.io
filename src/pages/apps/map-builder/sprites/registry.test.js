import { describe, it, expect } from 'vitest';
import { getAll, count } from './index';

// Structural integrity of the procedural catalog. Drawing each sprite needs a real
// Canvas2D (the generator agents verified that separately); here we assert the
// registry is well-formed and large.
describe('sprite catalog', () => {
  const all = getAll();
  const CATS = ['nature', 'medieval', 'modern', 'transit', 'symbols', 'decoration'];

  it('registers 1000+ distinct entries', () => {
    expect(count()).toBeGreaterThan(1000);
  });

  it('every entry is well-formed', () => {
    for (const e of all) {
      expect(typeof e.id).toBe('string');
      expect(e.id.length).toBeGreaterThan(0);
      expect(typeof e.name).toBe('string');
      expect(typeof e.draw).toBe('function');
      expect(typeof e.size).toBe('number');
      expect(CATS).toContain(e.category);
    }
  });

  it('ids are unique', () => {
    const ids = new Set(all.map((e) => e.id));
    expect(ids.size).toBe(all.length);
  });

  it('covers every category', () => {
    for (const c of CATS) {
      expect(all.some((e) => e.category === c)).toBe(true);
    }
  });
});
