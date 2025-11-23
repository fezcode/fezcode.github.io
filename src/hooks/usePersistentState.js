import { useState, useEffect } from 'react';
import * as LocalStorageManager from '../utils/LocalStorageManager';

/**
 * A custom hook that uses useState and persists the state to localStorage.
 *
 * @param {string} key The key to use in localStorage.
 * @param {*} defaultValue The default value to use if nothing is in localStorage.
 * @returns A stateful value, and a function to update it.
 */
const usePersistentState = (key, defaultValue) => {
  const [state, setState] = useState(() =>
    LocalStorageManager.get(key, defaultValue),
  );

  useEffect(() => {
    LocalStorageManager.set(key, state);
  }, [key, state]);

  return [state, setState];
};

export default usePersistentState;
