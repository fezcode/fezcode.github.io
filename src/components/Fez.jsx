import React from 'react';

const Fez = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="40"
    height="40"
    className="text-white"
    style={{ transform: 'rotate(-30deg)' }}
  >
    <g transform="translate(0, -2)">
      <path
        d="M 20 40 C 20 30, 80 30, 80 40 L 85 70 C 85 75, 15 75, 15 70 Z"
        fill="white"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M 50 25 Q 60 15, 70 25"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
    </g>
  </svg>
);

export default Fez;
