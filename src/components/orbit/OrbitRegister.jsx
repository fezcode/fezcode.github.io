import React from 'react';
import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import useOrbitPalette from './useOrbitPalette';

const OrbitRegister = ({ className = '' }) => {
  const { register, registerLabel, cycleRegister } = useOrbitPalette();
  return (
    <button
      type="button"
      className={`orb-btn ${className}`}
      onClick={cycleRegister}
      aria-label={`Change appearance, currently ${registerLabel}`}
    >
      {register === 'day' ? <SunIcon size={17} /> : <MoonIcon size={17} />}
      <span>{registerLabel}</span>
    </button>
  );
};

export default OrbitRegister;
