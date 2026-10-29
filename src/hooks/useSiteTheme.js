import { useCallback, useEffect, useState } from 'react';
import * as LocalStorageManager from '../utils/LocalStorageManager';
import {
  BUNDLED_FEATURE_FLAGS,
  defaultThemeFor,
  parseFeatureFlags,
  readSavedTheme,
  readUrlTheme,
} from '../utils/featureFlags';
import { isSiteTheme } from '../utils/siteThemes';

// A campaign supplies a default, not an explicit user preference. Only the
// public setter persists; fetching flags and crossing a date boundary do not.
const useSiteTheme = () => {
  const [preference, setPreference] = useState(
    () => readUrlTheme() || readSavedTheme(),
  );
  const [flags, setFlags] = useState(BUNDLED_FEATURE_FLAGS);
  const [now, setNow] = useState(Date.now);
  const theme = preference || defaultThemeFor(flags, now);

  const setTheme = useCallback((value) => {
    if (!isSiteTheme(value)) return;
    LocalStorageManager.set('fezcodex-theme', value);
    setPreference(value);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/feature-flag.piml', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Feature flags unavailable');
        return response.text();
      })
      .then((text) => {
        if (!controller.signal.aborted) {
          setFlags(parseFeatureFlags(text));
          setNow(Date.now());
        }
      })
      .catch(() => {
        // The bundled copy supports offline use and the first render.
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const update = () => setNow(Date.now());
    const nextBoundary = flags
      .flatMap((flag) => [Date.parse(flag.from), Date.parse(flag.to) + 1])
      .filter((time) => Number.isFinite(time) && time > now)
      .sort((a, b) => a - b)[0];
    // Long campaigns exceed the browser's signed 32-bit timeout range.
    const timeout = nextBoundary
      ? setTimeout(update, Math.min(nextBoundary - now, 2147483647))
      : null;
    window.addEventListener('focus', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('focus', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, [flags, now]);

  useEffect(() => {
    document.documentElement.dataset.fezcodexTheme = theme;
    window.dispatchEvent(
      new CustomEvent('fezcodex-theme-change', { detail: { theme } }),
    );
  }, [theme]);

  return [theme, setTheme];
};

export default useSiteTheme;
