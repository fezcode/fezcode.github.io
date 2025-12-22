import React from 'react';

const CoffeeStain = () => (
  <div className="absolute top-16 right-4 md:right-16 z-0 pointer-events-none opacity-[0.15] rotate-[15deg] mix-blend-multiply">
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id="coffee-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
        </filter>
      </defs>
      {/* Main Ring */}
      <circle
        cx="100"
        cy="100"
        r="70"
        fill="none"
        stroke="#3E2723"
        strokeWidth="8"
        filter="url(#coffee-filter)"
        opacity="0.8"
      />
      {/* Inner dark rim */}
      <circle
        cx="100"
        cy="100"
        r="68"
        fill="none"
        stroke="#281915"
        strokeWidth="1"
        filter="url(#coffee-filter)"
      />
      {/* Splatter dots */}
      <circle
        cx="180"
        cy="110"
        r="3"
        fill="#3E2723"
        filter="url(#coffee-filter)"
        opacity="0.6"
      />
      <circle
        cx="20"
        cy="140"
        r="4"
        fill="#3E2723"
        filter="url(#coffee-filter)"
        opacity="0.5"
      />
    </svg>
  </div>
);

export default CoffeeStain;
