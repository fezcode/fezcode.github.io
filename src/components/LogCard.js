import React from 'react';
import { FaBook, FaGamepad, FaFilm, FaNewspaper, FaArrowRight, FaMusic } from 'react-icons/fa';

const categoryIcons = {
  Book: <FaBook />,
  Game: <FaGamepad />,
  Movie: <FaFilm />,
  Article: <FaNewspaper />,
  Music: <FaMusic />,
};

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
};

const LogCard = ({ log, index, totalLogs }) => {
  const { title, category, author, director, platform, source, artist, link, date, rating } = log;

  const cardStyle = categoryStyles[category] || {};

  return (
    <div
      className="bg-transparent border rounded-lg shadow-lg p-6 flex flex-col justify-between relative"
      style={cardStyle}
    >
      <div className="absolute top-2 right-2 text-gray-400 text-lg font-semibold">#{totalLogs - index}</div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="text-2xl mr-4">{categoryIcons[category]}</div>
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
        </div>
        <div className="text-sm text-gray-400 mb-4">
          {author && <div>Author: {author}</div>}
          {director && <div>Director: {director}</div>}
          {platform && <div>Platform: {platform}</div>}
          {source && <div>Source: {source}</div>}
          {artist && <div>Artist: {artist}</div>}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-yellow-400">
            {[...Array(rating)].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <div className="text-gray-400 ml-2">({rating}/5)</div>
        </div>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline flex items-center">
            Visit <FaArrowRight className="ml-2" />
          </a>
        )}
        <div className="text-sm text-blue-400">{date}</div>
      </div>
    </div>
  );
};

export default LogCard;
