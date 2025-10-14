import React from 'react';

const Logo = () => {
  return (
    <svg
      className="h-8 w-8 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v16h16V4H4zm0 8h16M4 12h16"
      />
    </svg>
  );
};

export default Logo;