import React, { createContext, useContext, useState } from 'react';

const SidePanelContext = createContext();

export const useSidePanel = () => {
  return useContext(SidePanelContext);
};

export const SidePanelProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [panelContent, setPanelContent] = useState(null);
  const [panelTitle, setPanelTitle] = useState('');

  const openSidePanel = (title, content) => {
    setPanelTitle(title);
    setPanelContent(content);
    setIsOpen(true);
  };

  const closeSidePanel = () => {
    setIsOpen(false);
    // Optional: clear content after animation, but keeping it simple for now
  };

  return (
    <SidePanelContext.Provider
      value={{
        isOpen,
        panelTitle,
        panelContent,
        openSidePanel,
        closeSidePanel,
      }}
    >
      {children}
    </SidePanelContext.Provider>
  );
};
