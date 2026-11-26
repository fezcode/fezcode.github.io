import React from 'react';
import { useAnimation } from '../../context/AnimationContext';
import '../../styles/Studio.css';
import './StudioLoading.css';

export default function StudioLoading() {
  const { reduceMotion = false } = useAnimation() || {};

  return (
    <div
      className={`std-root std-loading${reduceMotion ? ' std-still' : ''}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="std-loading-shapes" aria-hidden="true">
        <span className="std-loading-shape std-loading-circle" />
        <span className="std-loading-shape std-loading-square" />
        <span className="std-loading-shape std-loading-dot" />
      </div>
      <p className="std-loading-title">Opening the studio…</p>
      <p className="std-loading-brand" aria-hidden="true">
        fezcodex
      </p>
    </div>
  );
}
