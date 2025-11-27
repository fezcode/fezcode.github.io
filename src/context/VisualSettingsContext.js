import React, {createContext, useContext, useEffect} from 'react';
import usePersistentState from '../hooks/usePersistentState';

const VisualSettingsContext = createContext();

export const useVisualSettings = () => {
  return useContext(VisualSettingsContext);
};

export const VisualSettingsProvider = ({children}) => {
  const [isInverted, setIsInverted] = usePersistentState('is-inverted', false);
  const [isRetro, setIsRetro] = usePersistentState('is-retro', false);
  const [isParty, setIsParty] = usePersistentState('is-party', false);
  const [isMirror, setIsMirror] = usePersistentState('is-mirror', false);
  const [isNoir, setIsNoir] = usePersistentState('is-noir', false);
  const [isTerminal, setIsTerminal] = usePersistentState('is-terminal', false);
  const [isBlueprint, setIsBlueprint] = usePersistentState('is-blueprint', false);
  const [isSepia, setIsSepia] = usePersistentState('is-sepia', false);

  useEffect(() => {
    if (isInverted) {
      document.body.classList.add('invert-mode');
    } else {
      document.body.classList.remove('invert-mode');
    }
  }, [isInverted]);

  useEffect(() => {
    if (isRetro) {
      document.documentElement.classList.add('retro-mode');
    } else {
      document.documentElement.classList.remove('retro-mode');
    }
  }, [isRetro]);

  useEffect(() => {
    if (isParty) {
      document.body.classList.add('party-mode');
    } else {
      document.body.classList.remove('party-mode');
    }
  }, [isParty]);

  useEffect(() => {
    if (isMirror) {
      document.documentElement.classList.add('mirror-mode');
    } else {
      document.documentElement.classList.remove('mirror-mode');
    }
  }, [isMirror]);

  useEffect(() => {
    if (isNoir) {
      document.body.classList.add('noir-mode');
    } else {
      document.body.classList.remove('noir-mode');
    }
  }, [isNoir]);

  useEffect(() => {
    if (isTerminal) {
      document.body.classList.add('terminal-mode');
    } else {
      document.body.classList.remove('terminal-mode');
    }
  }, [isTerminal]);

  useEffect(() => {
    if (isBlueprint) {
      document.body.classList.add('blueprint-mode');
    } else {
      document.body.classList.remove('blueprint-mode');
    }
  }, [isBlueprint]);

  useEffect(() => {
    if (isSepia) {
      document.body.classList.add('sepia-mode');
    } else {
      document.body.classList.remove('sepia-mode');
    }
  }, [isSepia]);

  const toggleInvert = () => setIsInverted(prev => !prev);
  const toggleRetro = () => setIsRetro(prev => !prev);
  const toggleParty = () => setIsParty(prev => !prev);
  const toggleMirror = () => setIsMirror(prev => !prev);
  const toggleNoir = () => setIsNoir(prev => !prev);
  const toggleTerminal = () => setIsTerminal(prev => !prev);
  const toggleBlueprint = () => setIsBlueprint(prev => !prev);
  const toggleSepia = () => setIsSepia(prev => !prev);

  return (
    <VisualSettingsContext.Provider value={{
      isInverted, toggleInvert,
      isRetro, toggleRetro,
      isParty, toggleParty,
      isMirror, toggleMirror,
      isNoir, toggleNoir,
      isTerminal, toggleTerminal,
      isBlueprint, toggleBlueprint,
      isSepia, toggleSepia
    }}>
      {children}
    </VisualSettingsContext.Provider>);
};
