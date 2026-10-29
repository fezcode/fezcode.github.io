import piml from 'piml';
// Vite resolves public assets from the site root. `url` opts into its public
// asset resolver; `raw` loads that same file's contents for the first render.
import bundledFlags from '/feature-flag.piml?url&raw';
import { isSiteTheme } from './siteThemes';
import * as LocalStorageManager from './LocalStorageManager';

export const FALLBACK_THEME = 'brutalist';

export const parseFeatureFlags = (text) => {
  try {
    const parsed = piml.parse(text);
    const flags = parsed.featureFlags?.flag || parsed.featureFlags || [];
    return (Array.isArray(flags) ? flags : [flags]).filter(
      (flag) => flag && typeof flag === 'object',
    );
  } catch {
    return [];
  }
};

export const BUNDLED_FEATURE_FLAGS = parseFeatureFlags(bundledFlags);

// The range is inclusive. Explicit offsets in PIML keep the campaign's dates
// independent of a visitor's local timezone.
export const defaultThemeFor = (flags, now = Date.now()) => {
  const timestamp = Number(now);
  const match = flags.find((flag) => {
    const from = Date.parse(flag.from);
    const to = Date.parse(flag.to);
    return (
      flag.type === 'default-theme' &&
      String(flag.isActive).toLowerCase() === 'true' &&
      isSiteTheme(flag.theme) &&
      Number.isFinite(from) &&
      Number.isFinite(to) &&
      from <= to &&
      timestamp >= from &&
      timestamp <= to
    );
  });
  return match?.theme || FALLBACK_THEME;
};

export const readSavedTheme = () => {
  const theme = LocalStorageManager.get('fezcodex-theme', null);
  return isSiteTheme(theme) ? theme : null;
};

export const readUrlTheme = () => {
  if (typeof window === 'undefined') return null;
  const theme = new URLSearchParams(window.location.search).get('fezTheme');
  return isSiteTheme(theme) ? theme : null;
};

// Components above VisualSettingsProvider (notably Toast) use the published
// active value without turning a temporary campaign default into a preference.
export const readActiveTheme = () => {
  const active =
    typeof document === 'undefined'
      ? null
      : document.documentElement.dataset.fezcodexTheme;
  return (
    readUrlTheme() ||
    (isSiteTheme(active) ? active : null) ||
    readSavedTheme() ||
    defaultThemeFor(BUNDLED_FEATURE_FLAGS)
  );
};
