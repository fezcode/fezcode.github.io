import React from 'react';
import { Link } from 'react-router-dom';
import colors from '../config/colors';
import {
  BookOpen,
  FilmStrip,
  GameController,
  Article,
  MusicNote,
  Television,
  ForkKnife,
  Globe,
  Star,
  Wrench,
} from '@phosphor-icons/react';

const categoryIcons = {
  Book: <BookOpen />,
  Movie: <FilmStrip />,
  Game: <GameController />,
  Article: <Article />,
  Music: <MusicNote />,
  Series: <Television />,
  Food: <ForkKnife />,
  Websites: <Globe />,
  Tools: <Wrench />,
};

const categoryStyles = {
  Book: {
    backgroundColor: colors['book-alpha-10'],
    borderColor: colors['book-alpha-50'],
    textColor: colors.book,
  },
  Movie: {
    backgroundColor: colors['movie-alpha-10'],
    borderColor: colors['movie-alpha-50'],
    textColor: colors.movie,
  },
  Game: {
    backgroundColor: colors['game-alpha-10'],
    borderColor: colors['game-alpha-50'],
    textColor: colors.game,
  },
  Article: {
    backgroundColor: colors['article-alpha-10'],
    borderColor: colors['article-alpha-50'],
    textColor: colors.article,
  },
  Music: {
    backgroundColor: colors['music-alpha-10'],
    borderColor: colors['music-alpha-50'],
    textColor: colors.music,
  },
  Series: {
    backgroundColor: colors['series-alpha-10'],
    borderColor: colors['series-alpha-50'],
    textColor: colors.series,
  },
  Food: {
    backgroundColor: colors['food-alpha-10'],
    borderColor: colors['food-alpha-50'],
    textColor: colors.food,
  },
  Websites: {
    backgroundColor: colors['websites-alpha-10'],
    borderColor: colors['websites-alpha-50'],
    textColor: colors.websites,
  },
  Tools: {
    backgroundColor: colors['tools-alpha-10'],
    borderColor: colors['tools-alpha-50'],
    textColor: colors.tools,
  },
};

const LogCard = ({ log, index, totalLogs }) => {
  const {
    title,
    category,
    author,
    director,
    platform,
    source,
    artist,
    year,
    creator,
    date,
    rating,
    slug,
    updated,
  } = log;

  const cardStyle = categoryStyles[category] || {};
  const detailTextColor = colors[category.toLowerCase() + '-light'];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(
          <Star key={i} size={16} weight="fill" className="text-yellow-400" />,
        );
      } else {
        stars.push(
          <Star key={i} size={16} weight="fill" className="text-gray-500" />,
        );
      }
    }
    return <div className="flex ml-1 mt-1">{stars}</div>;
  };

  return (
    <Link to={`/logs/${slug}`} className="block">
      <div
        className="group bg-transparent border rounded-lg shadow-lg p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl overflow-hidden h-full"
        style={cardStyle}
      >
        <div className="absolute top-3 right-3 text-lg font-semibold px-2 py-1 rounded-md border overflow-hidden whitespace-nowrap" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', color: cardStyle.textColor, borderColor: cardStyle.borderColor }}>
          #{totalLogs - index}
        </div>
        <div
          className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 ease-in-out"
          style={{
            backgroundImage:
              'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '10px 10px',
          }}
        ></div>
        <div>
          <div className="flex items-center justify-between mb-4 pr-10">
            <div className="flex items-center">
              <div className="text-2xl mr-4" style={{ color: detailTextColor }}>{categoryIcons[category]}</div>
              <h2
                className={`text-xl font-normal`}
                style={{ color: cardStyle.textColor }}
              >
                {title}
              </h2>
            </div>
          </div>
          <div className="text-sm mb-4" style={{ color: detailTextColor }}>
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
              {renderStars(rating)}
            </div>
            <div className="text-gray-400 ml-2">({rating}/5)</div>
          </div>
          <div>
            {updated && (
              <div className="text-xs text-rose-300 text-right">
                (U): {updated}
              </div>
            )}
            <div className="text-sm text-blue-400 text-right">{date}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LogCard;
