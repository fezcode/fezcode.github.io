import React, { memo } from 'react';

// Drawn as small printing devices: squared terminals, open counters and one
// consistent ink weight. Each mark borrows a letterform from its medium.
const SYMBOLS = {
  game: <path d="M19 7L16 4H8L4 8V16L8 20H16L20 16V12H12" />,
  movie: <path d="M3 20V4L12 13L21 4V20M3 8H6M18 8H21M3 16H6M18 16H21" />,
  music: <path d="M6 18V7L19 4V16M6 11L19 8M3 18H7M16 16H20" />,
  book: <path d="M5 3V21M5 4H14L18 8L14 12H5M5 12H15L20 16L15 20H5" />,
  series: <path d="M20 4H4V12H20V20H4" />,
  article: <path d="M3 20L12 4L21 20M7 14H17M9 20H15" />,
  food: <path d="M5 21V4H20M5 12H17M12 4V8M19 4V8" />,
  video: <path d="M3 4L12 20L21 4M7 4L12 13L17 4" />,
  quote: <path d="M4 4H10V11H4V4M10 11L6 19M14 4H20V11H14V4M20 11L16 19" />,
  tools: <path d="M3 5H21M12 5V21M4 5V9M20 5V9" />,
  websites: <path d="M3 4L7 20L12 11L17 20L21 4" />,
  event: <path d="M18 4H5V20H18M5 12H15M18 3V7M18 17V21" />,
};

export const CategoryImprint = memo(function CategoryImprint({
  category,
  label,
}) {
  const fullLabel = label || category || 'Article';
  const visibleLabel =
    category === 'websites' ? 'web' : fullLabel.toLowerCase();

  return (
    <span className="dc-spine-category">
      <span className="dc-category-imprint" aria-hidden="true">
        <svg
          className="dc-category-symbol"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="square"
          strokeLinejoin="miter"
          aria-hidden="true"
          focusable="false"
        >
          {SYMBOLS[category] || SYMBOLS.article}
        </svg>
        <span className="dc-category-name">{visibleLabel}</span>
      </span>
      <span className="sr-only">{fullLabel}</span>
    </span>
  );
});

export default CategoryImprint;
