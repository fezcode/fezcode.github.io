import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  set as setLocalStorageItem,
  get as getLocalStorageItem,
} from '../utils/LocalStorageManager';
import { KEY_HOMEPAGE_SECTION_ORDER } from '../utils/LocalStorageManager';

const HomepageOrderContext = createContext();

const defaultSectionOrder = ['projects', 'blogposts']; // Default: Pinned Projects first, then Latest Blogposts

export const HomepageOrderProvider = ({ children }) => {
  const [sectionOrder, setSectionOrder] = useState(() => {
    return getLocalStorageItem(KEY_HOMEPAGE_SECTION_ORDER, defaultSectionOrder);
  });

  useEffect(() => {
    setLocalStorageItem(KEY_HOMEPAGE_SECTION_ORDER, sectionOrder);
  }, [sectionOrder]);

  const toggleSectionOrder = () => {
    setSectionOrder((prevOrder) => {
      // If current is default, switch to reversed, else switch to default
      if (
        prevOrder[0] === defaultSectionOrder[0] &&
        prevOrder[1] === defaultSectionOrder[1]
      ) {
        return ['blogposts', 'projects']; // Reversed order
      } else {
        return defaultSectionOrder; // Default order
      }
    });
  };

  const resetSectionOrder = () => {
    setSectionOrder(defaultSectionOrder);
  };

  return (
    <HomepageOrderContext.Provider
      value={{
        sectionOrder,
        toggleSectionOrder,
        resetSectionOrder,
      }}
    >
      {children}
    </HomepageOrderContext.Provider>
  );
};

export const useHomepageOrder = () => useContext(HomepageOrderContext);
