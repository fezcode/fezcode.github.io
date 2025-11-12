import React, { createContext, useContext, useState, useEffect } from 'react';

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  // Initialize state from localStorage, or default to true
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(() => {
    try {
      const storedValue = localStorage.getItem('isAnimationEnabled');
      return storedValue ? JSON.parse(storedValue) : true;
    } catch (error) {
      console.error("Error reading 'isAnimationEnabled' from localStorage", error);
      return true; // Default to true if localStorage is not accessible
    }
  });

  const [showAnimationsHomepage, setShowAnimationsHomepage] = useState(() => {
    try {
      const storedValue = localStorage.getItem('showAnimationsHomepage');
      return storedValue ? JSON.parse(storedValue) : true; // Default to true
    } catch (error) {
      console.error("Error reading 'showAnimationsHomepage' from localStorage", error);
      return true; // Default to true if localStorage is not accessible
    }
  });

  const [showAnimationsInnerPages, setShowAnimationsInnerPages] = useState(() => {
    try {
      const storedValue = localStorage.getItem('showAnimationsInnerPages');
      return storedValue ? JSON.parse(storedValue) : false; // Default to false
    } catch (error) {
      console.error("Error reading 'showAnimationsInnerPages' from localStorage", error);
      return false; // Default to false if localStorage is not accessible
    }
  });

  // Update localStorage whenever isAnimationEnabled changes
  useEffect(() => {
    try {
      localStorage.setItem('isAnimationEnabled', JSON.stringify(isAnimationEnabled));
    } catch (error) {
      console.error("Error writing 'isAnimationEnabled' to localStorage", error);
    }
  }, [isAnimationEnabled]);

  // Update localStorage whenever showAnimationsHomepage changes
  useEffect(() => {
    try {
      localStorage.setItem('showAnimationsHomepage', JSON.stringify(showAnimationsHomepage));
    } catch (error) {
      console.error("Error writing 'showAnimationsHomepage' to localStorage", error);
    }
  }, [showAnimationsHomepage]);

  // Update localStorage whenever showAnimationsInnerPages changes
  useEffect(() => {
    try {
      localStorage.setItem('showAnimationsInnerPages', JSON.stringify(showAnimationsInnerPages));
    } catch (error) {
      console.error("Error writing 'showAnimationsInnerPages' to localStorage", error);
    }
  }, [showAnimationsInnerPages]);

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
    <AnimationContext.Provider value={{ isAnimationEnabled, toggleAnimation, showAnimationsHomepage, toggleShowAnimationsHomepage, showAnimationsInnerPages, toggleShowAnimationsInnerPages }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  return useContext(AnimationContext);
};
