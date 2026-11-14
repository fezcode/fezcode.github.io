import { describe, expect, it } from 'vitest';
import {
  createSculptureGeometry,
  getSculptureFallback,
  getSculptureParameters,
  getSculpturePaths,
  normalizeSculptureWord,
} from './sculptureSeed';

describe('word-seeded sculpture identities', () => {
  it('normalizes canonical Unicode and Turkish case before choosing an identity', () => {
    expect(normalizeSculptureWord('  PÖSKÜRMEK ')).toBe('pöskürmek');
    expect(getSculptureParameters('PÖSKÜRMEK')).toEqual(
      getSculptureParameters('po\u0308sku\u0308rmek'),
    );
    expect(getSculptureParameters('İÇ SES')).toEqual(
      getSculptureParameters('iç ses'),
    );
    expect(getSculptureParameters('IŞIK')).toEqual(
      getSculptureParameters('ışık'),
    );
    expect(getSculptureParameters('pöskürmek')).not.toEqual(
      getSculptureParameters('poskurmek'),
    );
  });

  it('repeats exact parameters and fallback contours without depending on call order', () => {
    const first = getSculptureParameters('pöskürmek');
    const fallback = getSculptureFallback(first);
    ['başka', 'kelime', 'sözcük'].forEach(getSculptureParameters);
    expect(getSculptureParameters('pöskürmek')).toEqual(first);
    expect(getSculptureFallback(getSculptureParameters('pöskürmek'))).toEqual(
      fallback,
    );
    expect(
      getSculptureFallback(getSculptureParameters('tablimbo')),
    ).not.toEqual(fallback);
  });

  it('produces materially varied path families, sections, proportions and accents', () => {
    const identities = Array.from({ length: 100 }, (_, index) =>
      getSculptureParameters(`test-word-${index}`),
    );
    expect(new Set(identities.map((identity) => identity.family)).size).toBe(5);
    expect(new Set(identities.map((identity) => identity.section)).size).toBe(
      2,
    );
    expect(
      new Set(identities.map((identity) => identity.accent)).size,
    ).toBeGreaterThan(3);
    identities.forEach((identity) => {
      expect(identity.width).toBeGreaterThanOrEqual(0.15);
      expect(identity.width).toBeLessThanOrEqual(0.31);
      expect(identity.thickness).toBeGreaterThanOrEqual(0.06);
      expect(identity.thickness).toBeLessThanOrEqual(0.235);
      expect(identity.twist).not.toBe(0);
      expect(identity.pose.every(Number.isFinite)).toBe(true);
    });
  });

  it('keeps all families finite and camera-bounded, with repeatable geometry', () => {
    const representatives = new Map();
    for (let index = 0; representatives.size < 5 && index < 100; index += 1) {
      const parameters = getSculptureParameters(`bounded-${index}`);
      representatives.set(parameters.family, parameters);
    }
    expect(representatives.size).toBe(5);
    representatives.forEach((parameters) => {
      const paths = getSculpturePaths(parameters);
      expect(
        paths.every((path) =>
          path.every(
            (point) =>
              Number.isFinite(point.length()) && point.length() <= 1.300001,
          ),
        ),
      ).toBe(true);
      const first = createSculptureGeometry(parameters);
      const repeated = createSculptureGeometry(
        getSculptureParameters(parameters.identity),
      );
      expect(first.geometry.attributes.position.array).toEqual(
        repeated.geometry.attributes.position.array,
      );
      expect(
        Array.from(first.geometry.attributes.normal.array).every(
          Number.isFinite,
        ),
      ).toBe(true);
      expect(first.geometry.boundingSphere.radius).toBeLessThan(1.8);
      first.geometry.dispose();
      repeated.geometry.dispose();
    });
  });

  it('separates pöskürmek’s folded passes beyond the tube diameter', () => {
    const parameters = getSculptureParameters('pöskürmek');
    const path = getSculpturePaths(parameters, 480)[0];
    const arcs = [0];
    for (let index = 1; index <= path.length; index += 1) {
      arcs.push(
        arcs[index - 1] + path[index % path.length].distanceTo(path[index - 1]),
      );
    }
    const length = arcs[arcs.length - 1];
    const radius = parameters.width * (1 + parameters.pulse);
    let clearance = Infinity;
    for (let first = 0; first < path.length; first += 1) {
      for (let second = first + 1; second < path.length; second += 1) {
        const gap = arcs[second] - arcs[first];
        // Exclude the local tube neighborhood, not separate folded passes.
        if (Math.min(gap, length - gap) <= 2 * Math.PI * radius) continue;
        clearance = Math.min(clearance, path[first].distanceTo(path[second]));
      }
    }
    expect(parameters.family).toBe('weave');
    expect(clearance).toBeGreaterThan(radius * 2);
  });
});
