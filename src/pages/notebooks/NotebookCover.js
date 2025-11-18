import React, { useState } from 'react';

const NotebookCover = ({
  title,
  backgroundColor,
  fontFamily,
  textColor,
  hoverBackgroundColor,
  hoverTextColor,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const currentBackgroundColor = isHovered
    ? hoverBackgroundColor
    : backgroundColor;
  const currentTextColor = isHovered ? hoverTextColor : textColor;

  return (
    <div
      className="relative w-full pb-[141.4%] rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300"
      style={{ backgroundColor: currentBackgroundColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 p-4">
        <div className="w-full h-full border-2 border-gray-300 flex items-center justify-center p-2">
          <h2
            className={`text-xl font-bold text-center ${fontFamily}`}
            style={{ color: currentTextColor }}
          >
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default NotebookCover;
