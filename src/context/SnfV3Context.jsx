import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import usePersistentState from '../hooks/usePersistentState';

/**
 * SnfV3Context — "The Reading Room".
 * A warm, tactile (refined-skeuomorphic) bookstore for From Serfs and Frauds.
 * Minimal reading preferences, in the spirit of early iBooks.
 */
export const SnfV3Context = createContext(null);

export const SNF3_DEFAULTS = {
  theme: 'day', // day | sepia | night  (paper tone while reading)
  size: 'md', // sm | md | lg
  typeface: 'serif', // serif (Lora) | sans (system)
};

export const SnfV3Provider = ({ children }) => {
  const [prefs, setPrefs] = usePersistentState('snf3-prefs', SNF3_DEFAULTS);
  const settings = useMemo(() => ({ ...SNF3_DEFAULTS, ...prefs }), [prefs]);

  const setPref = useCallback(
    (key, value) => setPrefs((p) => ({ ...SNF3_DEFAULTS, ...p, [key]: value })),
    [setPrefs],
  );

  const [language, setLanguage] = usePersistentState('snf3-language', 'en');
  const scrollRef = useRef(null);

  const value = useMemo(
    () => ({ settings, setPref, language, setLanguage, scrollRef }),
    [settings, setPref, language, setLanguage],
  );

  return (
    <SnfV3Context.Provider value={value}>{children}</SnfV3Context.Provider>
  );
};

export const useSnfV3 = () => {
  const ctx = useContext(SnfV3Context);
  if (!ctx) throw new Error('useSnfV3 must be used within a SnfV3Provider');
  return ctx;
};

export default SnfV3Provider;
