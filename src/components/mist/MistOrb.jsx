import React from 'react';

/**
 * The Mist brand glyph — a pale orb seen through fog (a moon at dawn).
 * Layered radial gradients with a soft halo and a band of fog drifting
 * across its lower half. Breathes on a slow 7s cycle.
 */
const MistOrb = ({ size = 120, breathe = true, className = '', title }) => (
  <span
    role={title ? 'img' : undefined}
    aria-label={title}
    aria-hidden={title ? undefined : true}
    className={`relative inline-block ${className}`}
    style={{ width: size, height: size }}
  >
    <style>{`
      @keyframes mist-orb-breathe {
        0%, 100% { opacity: 0.55; transform: scale(1); }
        50% { opacity: 0.95; transform: scale(1.07); }
      }
    `}</style>
    {/* halo */}
    <span
      className="absolute inset-0 rounded-full"
      style={{
        background:
          'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(6px)',
        animation: breathe ? 'mist-orb-breathe 7s ease-in-out infinite' : 'none',
      }}
    />
    {/* body */}
    <span
      className="absolute rounded-full"
      style={{
        inset: `${Math.round(size * 0.18)}px`,
        background:
          'radial-gradient(circle at 38% 32%, #FDFEFE 0%, #E9EFED 45%, #C9D5D2 100%)',
        boxShadow:
          '0 10px 40px rgba(95,131,123,0.25), inset 0 0 18px rgba(255,255,255,0.8)',
      }}
    />
    {/* fog band drifting across */}
    <span
      className="absolute"
      style={{
        left: '-12%',
        right: '-12%',
        top: '54%',
        height: `${Math.round(size * 0.16)}px`,
        background:
          'linear-gradient(90deg, transparent 0%, rgba(238,242,241,0.95) 18%, rgba(238,242,241,0.95) 82%, transparent 100%)',
        filter: 'blur(3px)',
      }}
    />
  </span>
);

export default MistOrb;
