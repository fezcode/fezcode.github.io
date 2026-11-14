import { createComposition, DEFAULT_SETTINGS, FORMATS } from './coralBloom';

describe('Coral Bloom composition', () => {
  test.each(['coral-140', 'a different seed', ''])(
    'reproduces the same artwork for seed %j',
    (seed) => {
      const settings = { ...DEFAULT_SETTINGS, seed };
      const original = createComposition(settings);
      createComposition({ ...settings, seed: 'unrelated composition' });
      expect(createComposition(settings)).toEqual(original);
    },
  );

  test('different seeds change the arrangement', () => {
    expect(
      createComposition({ ...DEFAULT_SETTINGS, seed: 'reef-a' }),
    ).not.toEqual(createComposition({ ...DEFAULT_SETTINGS, seed: 'reef-b' }));
  });

  test.each(FORMATS)(
    '$name preview and export preserve the same layout',
    (format) => {
      const settings = { ...DEFAULT_SETTINGS, format: format.id };
      const preview = {
        width: Math.round(format.width * 0.6),
        height: Math.round(format.height * 0.6),
      };
      expect(
        createComposition(settings, preview.height / preview.width),
      ).toEqual(createComposition(settings, format.height / format.width));
    },
  );

  test.each(FORMATS)(
    '$name supports every combination of slider limits',
    (format) => {
      const limits = {
        density: [15, 100],
        curl: [0, 100],
        ribs: [18, 60],
        relief: [0, 100],
        grain: [0, 50],
      };
      const combinations = Object.entries(limits).reduce(
        (settings, [key, values]) =>
          settings.flatMap((current) =>
            values.map((value) => ({ ...current, [key]: value })),
          ),
        [{ ...DEFAULT_SETTINGS, format: format.id }],
      );

      for (const settings of combinations) {
        const fans = createComposition(settings, format.height / format.width);
        expect(fans.length).toBeGreaterThan(0);
        for (const fan of fans) {
          expect(Object.values(fan).every(Number.isFinite)).toBe(true);
          expect(fan.length).toBeGreaterThan(0);
          expect(Number.isInteger(fan.ribs) && fan.ribs >= 2).toBe(true);
          expect(fan.spread).toBeGreaterThan(0);
          expect(fan.spread).toBeLessThan(Math.PI * 2);
          expect(fan.shade).toBeGreaterThan(0);
          expect(fan.shade).toBeLessThanOrEqual(1);
        }
      }
    },
  );
});
