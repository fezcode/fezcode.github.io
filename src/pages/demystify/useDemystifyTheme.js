import { useEffect } from 'react';
import usePersistentState from '../../hooks/usePersistentState';

/**
 * Theme registry shared by every /demystify page. The id is written to
 * <html data-demystify-theme="..."> which drives the --dm-* custom properties
 * defined in src/styles/Demystify.css.
 */
export const DEMYSTIFY_THEMES = [
  { id: '1', label: 'LIGHT' },
  { id: '2', label: 'SLATE' },
  { id: '3', label: 'DARK' },
  { id: '4', label: 'MATRIX' },
];

const DEFAULT_THEME = '3';

/**
 * Keeps the demystify palette consistent across the hub and its collections,
 * and remembers the reader's choice between visits.
 *
 * The attribute is deliberately never removed on unmount: route transitions
 * mount the next page before the previous one tears down, so a cleanup would
 * strip the attribute the incoming page just set and snap the palette back to
 * the :root default. The attribute only affects --dm-* vars, which nothing
 * outside /demystify consumes.
 */
const useDemystifyTheme = () => {
  const [theme, setTheme] = usePersistentState('demystify-theme', DEFAULT_THEME);
  const isKnown = DEMYSTIFY_THEMES.some((entry) => entry.id === theme);
  const activeTheme = isKnown ? theme : DEFAULT_THEME;

  useEffect(() => {
    document.documentElement.setAttribute('data-demystify-theme', activeTheme);
  }, [activeTheme]);

  const cycleTheme = () => {
    setTheme((current) => {
      const idx = DEMYSTIFY_THEMES.findIndex((entry) => entry.id === current);
      return DEMYSTIFY_THEMES[(idx + 1) % DEMYSTIFY_THEMES.length].id;
    });
  };

  const themeLabel = DEMYSTIFY_THEMES.find((entry) => entry.id === activeTheme)
    .label;

  return { theme: activeTheme, themeLabel, cycleTheme };
};

export default useDemystifyTheme;
