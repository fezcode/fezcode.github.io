import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const noop = () => {};
export const WordupActivityContext = createContext({
  paused: false,
  acquirePause: () => noop,
});

export function WordupActivityProvider({ children, paused = false }) {
  const [leases, setLeases] = useState(() => new Set());
  const acquirePause = useCallback(() => {
    const lease = {};
    let released = false;
    setLeases((current) => new Set(current).add(lease));
    return () => {
      if (released) return;
      released = true;
      setLeases((current) => {
        if (!current.has(lease)) return current;
        const next = new Set(current);
        next.delete(lease);
        return next;
      });
    };
  }, []);
  const value = useMemo(
    () => ({ paused: Boolean(paused || leases.size), acquirePause }),
    [paused, leases, acquirePause],
  );
  return (
    <WordupActivityContext.Provider value={value}>
      {children}
    </WordupActivityContext.Provider>
  );
}

export const useWordupActivity = () => useContext(WordupActivityContext);
