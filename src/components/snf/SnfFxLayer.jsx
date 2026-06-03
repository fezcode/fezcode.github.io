import React from 'react';
import { useSnf } from '../../context/SnfContext';

/**
 * Renders the enabled CRT/used-future overlays inside the screen.
 * Each effect is an independent, pointer-events-none layer gated by settings.
 * (Reduced motion is handled in CSS via the root data-attribute.)
 */
const SnfFxLayer = () => {
  const { settings, prefersReducedMotion } = useSnf();
  return (
    <>
      {settings.scanlines && <div className="snf-fx snf-scanlines" />}
      {settings.scanlines && !prefersReducedMotion && (
        <div className="snf-fx">
          <div className="snf-rollbar" />
        </div>
      )}
      {settings.grain && <div className="snf-fx snf-grain" />}
      {settings.flicker && <div className="snf-fx snf-flicker" />}
      {settings.vignette && <div className="snf-fx snf-vignette" />}
    </>
  );
};

export default SnfFxLayer;
