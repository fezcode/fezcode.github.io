// src/utils/readingTime.js

export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200; // Average reading speed
  const words = text.split(/\s+/).filter((word) => word !== '').length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};
