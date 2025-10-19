import React from 'react';
import colors from '../config/colors';

export const categoryStyles = {
  Book: {
    backgroundColor: colors['book-alpha-10'],
    borderColor: colors['book-alpha-50'],
  },
  Movie: {
    backgroundColor: colors['movie-alpha-10'],
    borderColor: colors['movie-alpha-50'],
  },
  Game: {
    backgroundColor: colors['game-alpha-10'],
    borderColor: colors['game-alpha-50'],
  },
  Article: {
    backgroundColor: colors['article-alpha-10'],
    borderColor: colors['article-alpha-50'],
  },
  Music: {
    backgroundColor: colors['music-alpha-10'],
    borderColor: colors['music-alpha-50'],
  },
  Series: {
    backgroundColor: colors['series-alpha-10'],
    borderColor: colors['series-alpha-50'],
  },
};

const ColorLegends = ({ onLegendClick, hiddenLegends }) => {
  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center flex-wrap justify-center space-x-4">
        {Object.keys(categoryStyles).map((category) => (
          <div key={category} className="flex items-center mb-2">
            <div
              className={`w-4 h-4 rounded-full mr-2 cursor-pointer ${
                hiddenLegends.includes(category) ? "opacity-50" : "opacity-100"
              }`}
              style={{ backgroundColor: categoryStyles[category].backgroundColor, border: `1px solid ${categoryStyles[category].borderColor}` }}
              onClick={() => onLegendClick(category)}
            ></div>
            <span
              className={`cursor-pointer text-white font-light ${
                hiddenLegends.includes(category) ? "opacity-50 line-through" : "opacity-100"
              }`}
              onClick={() => onLegendClick(category)}
            >
              {category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorLegends;
