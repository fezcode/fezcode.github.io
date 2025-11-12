import React, { useEffect, useState } from 'react';

const Dot = ({ id, size, color, initialX, initialY, animationDuration, onAnimationEnd }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onAnimationEnd(id);
    }, animationDuration * 1000); // Convert seconds to milliseconds

    return () => clearTimeout(timer);
  }, [animationDuration, id, onAnimationEnd]);

  if (!isVisible) {
    return null;
  }

  const dotStyle = {
    position: 'absolute',
    left: `${initialX}px`,
    top: `${initialY}px`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
    opacity: 0.7,
    animation: `moveAndFade ${animationDuration}s linear forwards`,
    zIndex: 0, // Ensure dots are behind content
  };

  // Define keyframes dynamically or ensure they are globally available
  // For now, we'll assume keyframes are defined in index.css or similar
  // This is a placeholder for the actual CSS animation
  return (
    <div style={dotStyle} />
  );
};

export default Dot;
