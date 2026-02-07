import React, { createContext, useState } from 'react';
import usePersistentState from '../hooks/usePersistentState';

export const DndContext = createContext();

export const DndProvider = ({ children }) => {
  const [bgImageName, setBgImageName] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState([]); // Add breadcrumbs state
  const [language, setLanguage] = usePersistentState('dnd-language', 'en'); // Add language state

  // Effect Settings (User requested 5 specific ones)
  const [isLightningEnabled, setIsLightningEnabled] = usePersistentState(
    'dnd-lightning-enabled',
    true,
  );
  const [isLootDiscoveryEnabled, setIsLootDiscoveryEnabled] =
    usePersistentState('dnd-loot-enabled', true);
  const [isFireOverlayEnabled, setIsFireOverlayEnabled] = usePersistentState(
    'dnd-fire-overlay-enabled',
    true,
  );
  const [isFireParticlesEnabled, setIsFireParticlesEnabled] =
    usePersistentState('dnd-fire-particles-enabled', true);
  const [isViewportFrameEnabled, setIsViewportFrameEnabled] =
    usePersistentState('dnd-viewport-frame-enabled', true);

  const toggleLightning = () => setIsLightningEnabled(!isLightningEnabled);
  const toggleLootDiscovery = () =>
    setIsLootDiscoveryEnabled(!isLootDiscoveryEnabled);
  const toggleFireOverlay = () =>
    setIsFireOverlayEnabled(!isFireOverlayEnabled);
  const toggleFireParticles = () =>
    setIsFireParticlesEnabled(!isFireParticlesEnabled);
  const toggleViewportFrame = () =>
    setIsViewportFrameEnabled(!isViewportFrameEnabled);

  return (
    <DndContext.Provider
      value={{
        bgImageName,
        setBgImageName,
        breadcrumbs,
        setBreadcrumbs,
        language,
        setLanguage,
        isLightningEnabled,
        toggleLightning,
        isLootDiscoveryEnabled,
        toggleLootDiscovery,
        isFireOverlayEnabled,
        toggleFireOverlay,
        isFireParticlesEnabled,
        toggleFireParticles,
        isViewportFrameEnabled,
        toggleViewportFrame,
      }}
    >
      {children}
    </DndContext.Provider>
  );
};
