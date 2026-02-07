import React, { createContext, useContext } from 'react';
import usePersistentState from '../hooks/usePersistentState';

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  // We use the existing key but invert the logic mentally or rename it.
  // Let's use a new key for clarity: reduceMotion
  const [reduceMotion, setReduceMotion] = usePersistentState(
    'reduceMotion',
    false,
  );

  const toggleReduceMotion = () => {
    setReduceMotion((prev) => !prev);
  };

  return (
    <AnimationContext.Provider
      value={{
        reduceMotion,
        toggleReduceMotion,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  return useContext(AnimationContext);
};
