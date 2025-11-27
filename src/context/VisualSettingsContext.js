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

  const toggleInvert = () => setIsInverted(prev => !prev);
  const toggleRetro = () => setIsRetro(prev => !prev);
  const toggleParty = () => setIsParty(prev => !prev);

  return (<VisualSettingsContext.Provider value={{
      isInverted, toggleInvert, isRetro, toggleRetro, isParty, toggleParty
    }}>
      {children}
    </VisualSettingsContext.Provider>);
};
