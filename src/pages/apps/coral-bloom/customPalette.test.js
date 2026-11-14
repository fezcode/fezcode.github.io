import {
  createComposition,
  DEFAULT_SETTINGS,
  FORMATS,
  PALETTES,
  resolvePalette,
} from './coralBloom';

const CUSTOM_COLORS = {
  pigment: '#1aA',
  tip: '#DDEEff',
  fold: '#8080ff',
  background: '#123',
};

describe('Coral Bloom custom colors', () => {
  test.each(PALETTES)(
    'preserves the $name preset without overrides',
    (preset) => {
      expect(
        resolvePalette({ ...DEFAULT_SETTINGS, palette: preset.id }),
      ).toEqual(preset);
    },
  );

  test('normalizes each editable color and keeps roots in the fold color family', () => {
    expect(
      resolvePalette({ ...DEFAULT_SETTINGS, colors: CUSTOM_COLORS }),
    ).toMatchObject({
      pigment: '#11aaaa',
      tip: '#ddeeff',
      fold: '#8080ff',
      background: '#112233',
      shadow: '#3a3a73',
    });
  });

  test('invalid values and unrelated keys cannot replace preset colors or metadata', () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      colors: {
        pigment: 'red',
        tip: '#1234',
        fold: '#gggggg',
        background: null,
        shadow: '#ffffff',
        id: 'unrecognized',
        name: 'replaced',
      },
    };
    expect(resolvePalette(settings)).toEqual(PALETTES[0]);
    expect(resolvePalette({ ...settings, palette: 'missing-preset' })).toEqual(
      PALETTES[0],
    );
  });

  test('editing a petal color leaves the preset fold and root colors intact', () => {
    const palette = resolvePalette({
      ...DEFAULT_SETTINGS,
      palette: 'kelp',
      colors: { pigment: '#ffffff' },
    });
    expect(palette.pigment).toBe('#ffffff');
    expect(palette.fold).toBe(PALETTES[2].fold);
    expect(palette.shadow).toBe(PALETTES[2].shadow);
  });

  test('resolving custom colors does not mutate settings or reusable presets', () => {
    const presetsBefore = JSON.parse(JSON.stringify(PALETTES));
    const settings = Object.freeze({
      ...DEFAULT_SETTINGS,
      colors: Object.freeze({ ...CUSTOM_COLORS }),
    });
    resolvePalette(settings);
    expect(settings.colors).toEqual(CUSTOM_COLORS);
    expect(PALETTES).toEqual(presetsBefore);
    expect(resolvePalette(DEFAULT_SETTINGS)).toEqual(PALETTES[0]);
  });

  test.each(FORMATS)(
    '$name keeps custom colors and the same seeded layout for preview and export',
    (format) => {
      const original = { ...DEFAULT_SETTINGS, format: format.id };
      const customized = { ...original, colors: CUSTOM_COLORS };
      const aspect = format.height / format.width;
      expect(createComposition(customized, aspect)).toEqual(
        createComposition(original, aspect),
      );
      expect(resolvePalette(customized)).toEqual(
        resolvePalette({ ...DEFAULT_SETTINGS, colors: CUSTOM_COLORS }),
      );
    },
  );
});
