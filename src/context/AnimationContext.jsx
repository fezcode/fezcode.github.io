import React, { createContext, useContext } from 'react';
import usePersistentState from '../hooks/usePersistentState';
import {
  KEY_IS_ANIMATION_ENABLED,
  KEY_SHOW_ANIMATIONS_HOMEPAGE,
  KEY_SHOW_ANIMATIONS_INNER_PAGES,
} from '../utils/LocalStorageManager';

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [isAnimationEnabled, setIsAnimationEnabled] = usePersistentState(
    KEY_IS_ANIMATION_ENABLED,
    true,
  );

  const [showAnimationsHomepage, setShowAnimationsHomepage] =
    usePersistentState(KEY_SHOW_ANIMATIONS_HOMEPAGE, true);

  const [showAnimationsInnerPages, setShowAnimationsInnerPages] =
    usePersistentState(KEY_SHOW_ANIMATIONS_INNER_PAGES, false);

  const toggleAnimation = () => {
    setIsAnimationEnabled((prev) => !prev);
  };

  const toggleShowAnimationsHomepage = () => {
    setShowAnimationsHomepage((prev) => !prev);
  };

  const toggleShowAnimationsInnerPages = () => {
    setShowAnimationsInnerPages((prev) => !prev);
  };

  return (
    <AnimationContext.Provider
      value={{
        isAnimationEnabled,
        toggleAnimation,
        showAnimationsHomepage,
        toggleShowAnimationsHomepage,
        showAnimationsInnerPages,
        toggleShowAnimationsInnerPages,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  return useContext(AnimationContext);
};
