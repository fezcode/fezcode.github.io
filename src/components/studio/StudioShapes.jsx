import React from 'react';

export default function StudioShapes({ variant = 'orbit' }) {
  return (
    <svg
      className={`std-shapes std-shapes-${variant}`}
      viewBox="0 0 600 400"
      fill="none"
      aria-hidden="true"
    >
      <g className="std-shapes-turn">
        <ellipse cx="300" cy="200" rx="240" ry="120" />
        <ellipse
          cx="300"
          cy="200"
          rx="190"
          ry="165"
          transform="rotate(-30 300 200)"
        />
        <circle cx="520" cy="155" r="18" className="std-shape-solid" />
      </g>
      <rect
        x="85"
        y="240"
        width="72"
        height="72"
        rx="24"
        className="std-shape-block"
        transform="rotate(-16 121 276)"
      />
    </svg>
  );
}
