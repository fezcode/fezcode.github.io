import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import usePersistentState from '../hooks/usePersistentState';

/**
 * SnfContext — state + configuration for the "/snf" Black Ragnarok Archive Terminal.
 *
 * The whole experience is diegetic: a decommissioned intelligence terminal.
 * Per the project requirement, *everything* is configurable — every visual
 * effect, the CRT colour, the reading typography and the ambient audio are
 * persisted user settings living in this single context.
 */
export const SnfContext = createContext(null);

export const CRT_THEMES = ['amber', 'green', 'blue', 'white'];

// One object holds every persisted setting so the Config page + reset are trivial.
export const SNF_DEFAULTS = {
  // ---- Display ----------------------------------------------------------
  crt: 'amber', // amber | green | blue | white
  scanlines: true,
  scanlineIntensity: 'med', // low | med | high
  flicker: true,
  glow: true, // phosphor bloom on text/borders
  aberration: false, // chromatic RGB split (off by default — can distract)
  curvature: true, // barrel/vignette CRT framing
  grain: true, // film grime overlay
  vignette: true,
  shake: false, // camera/screen shake (off by default)
  shakeIntensity: 'med', // low | med | high

  // ---- Text -------------------------------------------------------------
  readingFont: 'document', // document (serif) | terminal (mono)
  decrypt: true, // typewriter / decrypt text reveals
  textSize: 'md', // sm | md | lg
  // ---- Audio ------------------------------------------------------------
  audio: false, // master ambient switch (never autoplays)
  audioTrack: 'hum', // hum | rain | static
  volume: 0.35, // 0..1
  beeps: false, // UI interaction blips
  // ---- System -----------------------------------------------------------
  boot: true, // play boot/decrypt sequence
  reducedMotion: false, // manual override (system pref also respected)
};

const STORAGE_KEY = 'snf-settings-v1';

export const SnfProvider = ({ children }) => {
  const [stored, setStored] = usePersistentState(STORAGE_KEY, SNF_DEFAULTS);

  // Always merge with defaults so new settings appear for returning users.
  const settings = useMemo(() => ({ ...SNF_DEFAULTS, ...stored }), [stored]);

  const setSetting = useCallback(
    (key, value) =>
      setStored((prev) => ({ ...SNF_DEFAULTS, ...prev, [key]: value })),
    [setStored],
  );

  const toggle = useCallback(
    (key) =>
      setStored((prev) => {
        const base = { ...SNF_DEFAULTS, ...prev };
        return { ...base, [key]: !base[key] };
      }),
    [setStored],
  );

  const resetSettings = useCallback(() => setStored(SNF_DEFAULTS), [setStored]);

  // Diegetic navigation breadcrumbs (set per page).
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // The internally-scrolling <main> element (the terminal viewport scrolls,
  // not the window) — shared so pages can track reading progress.
  const scrollRef = useRef(null);

  // Language toggle (independent of the medieval /stories view).
  const [language, setLanguage] = usePersistentState('snf-language', 'en');

  // Whether the boot sequence has already played this session.
  const [hasBooted, setHasBooted] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.sessionStorage.getItem('snf-booted') === '1';
    } catch {
      return false;
    }
  });
  const markBooted = useCallback(() => {
    setHasBooted(true);
    try {
      window.sessionStorage.setItem('snf-booted', '1');
    } catch {
      /* ignore */
    }
  }, []);

  // System reduced-motion preference.
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReducedMotion(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const prefersReducedMotion = settings.reducedMotion || systemReducedMotion;

  const value = useMemo(
    () => ({
      settings,
      setSetting,
      toggle,
      resetSettings,
      breadcrumbs,
      setBreadcrumbs,
      scrollRef,
      language,
      setLanguage,
      hasBooted,
      markBooted,
      prefersReducedMotion,
    }),
    [
      settings,
      setSetting,
      toggle,
      resetSettings,
      breadcrumbs,
      scrollRef,
      language,
      setLanguage,
      hasBooted,
      markBooted,
      prefersReducedMotion,
    ],
  );

  return <SnfContext.Provider value={value}>{children}</SnfContext.Provider>;
};

export const useSnf = () => {
  const ctx = useContext(SnfContext);
  if (!ctx) {
    throw new Error('useSnf must be used within a SnfProvider');
  }
  return ctx;
};

export default SnfProvider;
