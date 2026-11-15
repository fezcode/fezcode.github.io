import React, { createContext, useCallback, useContext, useState } from 'react';

const SidePanelContext = createContext();

export const useSidePanel = () => {
  return useContext(SidePanelContext);
};

export const SidePanelProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [panelContent, setPanelContent] = useState(null);
  const [panelTitle, setPanelTitle] = useState('');
  const [panelWidth, setPanelWidth] = useState(450);

  // Stable identities: effects that open the panel (the /vocab/:term route)
  // list these as dependencies and would otherwise re-run on every render.
  const openSidePanel = useCallback((title, content, width = 450) => {
    setPanelTitle(title);
    setPanelContent(content);
    setPanelWidth(width);
    setIsOpen(true);
  }, []);

  const closeSidePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <SidePanelContext.Provider
      value={{
        isOpen,
        panelTitle,
        panelContent,
        panelWidth,
        setPanelWidth,
        openSidePanel,
        closeSidePanel,
      }}
    >
      {children}
    </SidePanelContext.Provider>
  );
};
