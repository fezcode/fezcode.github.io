import React from 'react';
import { useAnimation } from '../../context/AnimationContext';
import '../../styles/Studio.css';

export default function StudioSurface({ children, className = '' }) {
  const { reduceMotion } = useAnimation();
  return (
    <div
      className={`std-surface ${reduceMotion ? 'std-still' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
