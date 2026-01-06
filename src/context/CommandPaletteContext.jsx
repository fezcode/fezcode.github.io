import React, { createContext, useState, useContext, useEffect } from 'react';

const CommandPaletteContext = createContext();

export const useCommandPalette = () => {
  return useContext(CommandPaletteContext);
};

export const CommandPaletteProvider = ({ children }) => {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [triggerCommand, setTriggerCommand] = useState(
    () => (id) => console.warn(`Command trigger not initialized for ${id}`),
  );

  const openPalette = () => setIsPaletteOpen(true);
  const closePalette = () => setIsPaletteOpen(false);
  const togglePalette = () => setIsPaletteOpen((prev) => !prev);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isKPressed = event.key === 'k' || event.key === 'K';
      if (
        (event.altKey && isKPressed) ||
        (event.ctrlKey && isKPressed) ||
        (event.metaKey && isKPressed)
      ) {
        event.preventDefault();
        togglePalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <CommandPaletteContext.Provider
      value={{
        isPaletteOpen,
        setIsPaletteOpen,
        openPalette,
        closePalette,
        togglePalette,
        triggerCommand,
        setTriggerCommand,
      }}
    >
      {children}
    </CommandPaletteContext.Provider>
  );
};
