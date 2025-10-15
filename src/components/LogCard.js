import { BookOpen, FilmStrip, GameController, Article, MusicNote, Television, ArrowRight } from '@phosphor-icons/react';

const categoryIcons = {
  Book: <BookOpen />,
  Movie: <FilmStrip />,
  Game: <GameController />,
  Article: <Article />,
  Music: <MusicNote />,
  Series: <Television />,
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
  Series: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderColor: 'rgba(236, 72, 153, 0.5)',
  },
};

const LogCard = ({ log, index, totalLogs }) => {
  const { title, category, author, director, platform, source, artist, year, creator, link, date, rating } = log;

  const cardStyle = categoryStyles[category] || {};

  return (
    <div
      className="group bg-transparent border rounded-lg shadow-lg p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl overflow-hidden"
      style={cardStyle}
    >
      <div className="absolute top-2 right-2 text-gray-400 text-lg font-semibold">#{totalLogs - index}</div>
      <div
        className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 ease-in-out"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '10px 10px' }}
      ></div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="text-2xl mr-4">{categoryIcons[category]}</div>
            <h2 className={`text-xl font-normal group-hover:text-${category.toLowerCase()}`}>{title}</h2>
          </div>
        </div>
        <div className="text-sm text-gray-400 mb-4">
          {author && <div>Author: {author}</div>}
          {director && <div>Director: {director}</div>}
          {platform && <div>Platform: {platform}</div>}
          {source && <div>Source: {source}</div>}
          {artist && <div>Artist: {artist}</div>}
          {year && <div>Year: {year}</div>}
          {creator && <div>Creator: {creator}</div>}
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
            Visit <ArrowRight className="ml-2" />
          </a>
        )}
        <div className="text-sm text-blue-400">{date}</div>
      </div>
    </div>
  );
};

export default LogCard;
