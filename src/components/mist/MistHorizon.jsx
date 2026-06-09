import React from 'react';

/**
 * Horizon rule — Mist never draws a hard line. Every divider is a horizon:
 * darkest at the middle, dissolving to nothing at both ends.
 */
const MistHorizon = ({ className = '', tint = 'rgba(60,72,69,0.25)' }) => (
  <div
    aria-hidden="true"
    className={`h-px w-full ${className}`}
    style={{
      background: `linear-gradient(90deg, transparent, ${tint}, transparent)`,
    }}
  />
);

export default MistHorizon;
