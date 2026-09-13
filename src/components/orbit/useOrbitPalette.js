import { useCallback, useEffect, useSyncExternalStore } from 'react';
import * as storage from '../../utils/LocalStorageManager';

export const ORBIT_REGISTERS = [
  { id: 'day', label: 'Daylight' },
  { id: 'night', label: 'Night' },
];
export const ORBIT_PALETTE_KEY = 'orbit-palette';

const snapshot = () => {
  const value = storage.get(ORBIT_PALETTE_KEY, 'day');
  return ORBIT_REGISTERS.some(({ id }) => id === value) ? value : 'day';
};

const subscribe = (notify) => {
  const onWrite = (event) => {
    if (!event.detail || event.detail.key === ORBIT_PALETTE_KEY) notify();
  };
  window.addEventListener('fezcodex-storage', onWrite);
  window.addEventListener('storage', onWrite);
  return () => {
    window.removeEventListener('fezcodex-storage', onWrite);
    window.removeEventListener('storage', onWrite);
  };
};

// The navbar, settings and overlays share one snapshot, including same-tab writes.
const useOrbitPalette = () => {
  const register = useSyncExternalStore(subscribe, snapshot, () => 'day');
  const setRegister = useCallback((next) => {
    const value = typeof next === 'function' ? next(snapshot()) : next;
    if (ORBIT_REGISTERS.some(({ id }) => id === value))
      storage.set(ORBIT_PALETTE_KEY, value);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.orbitRegister = register;
  }, [register]);
  return {
    register,
    registerLabel: ORBIT_REGISTERS.find(({ id }) => id === register).label,
    setRegister,
    cycleRegister: () => setRegister(register === 'day' ? 'night' : 'day'),
  };
};

export default useOrbitPalette;
