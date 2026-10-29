import { describe, expect, it } from 'vitest';
import {
  BUNDLED_FEATURE_FLAGS,
  defaultThemeFor,
  parseFeatureFlags,
} from './featureFlags';

const flag = {
  id: 'knit-default',
  type: 'default-theme',
  theme: 'knit',
  from: '2026-10-29T00:00:00+03:00',
  to: '2026-12-31T23:59:59.999+03:00',
  isActive: true,
};

describe('scheduled default theme', () => {
  it('includes both Istanbul calendar boundaries and expires immediately after', () => {
    const from = Date.parse(flag.from);
    const to = Date.parse(flag.to);
    expect(defaultThemeFor([flag], from - 1)).toBe('brutalist');
    expect(defaultThemeFor([flag], from)).toBe('knit');
    expect(defaultThemeFor([flag], to)).toBe('knit');
    expect(defaultThemeFor([flag], to + 1)).toBe('brutalist');
  });

  it('falls back for disabled, invalid, reversed, and unrelated flags', () => {
    const now = Date.parse('2026-11-12T12:00:00+03:00');
    for (const change of [
      { isActive: false },
      { theme: 'unknown' },
      { type: 'another-feature' },
      { from: 'invalid' },
      { to: 'invalid' },
      { from: flag.to, to: flag.from },
    ]) {
      expect(defaultThemeFor([{ ...flag, ...change }], now)).toBe('brutalist');
    }
  });

  it('loads the actual PIML campaign and tolerates missing configuration', () => {
    expect(BUNDLED_FEATURE_FLAGS).toEqual([flag]);
    expect(defaultThemeFor(parseFeatureFlags(''), Date.parse(flag.from))).toBe(
      'brutalist',
    );
    expect(defaultThemeFor(parseFeatureFlags('(unrelated) true'))).toBe(
      'brutalist',
    );
  });
});
