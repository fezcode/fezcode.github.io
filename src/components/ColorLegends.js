import React from 'react';

const categoryStyles = {
  Book: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  Movie: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  Game: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.5)',
  },
  Article: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderColor: 'rgba(249, 115, 22, 0.5)',
  },
  Music: {
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  Series: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderColor: 'rgba(236, 72, 153, 0.5)',
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
              className={`cursor-pointer ${
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
