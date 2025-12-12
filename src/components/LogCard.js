import React from 'react';
import { Link } from 'react-router-dom';
import colors from '../config/colors';
import {
  BookOpenIcon,
  FilmStripIcon,
  GameControllerIcon,
  ArticleIcon,
  MusicNoteIcon,
  TelevisionIcon,
  ForkKnifeIcon,
  GlobeIcon,
  StarIcon,
  WrenchIcon,
  CalendarBlankIcon,
} from '@phosphor-icons/react';

const categoryIcons = {
  Book: <BookOpenIcon weight="duotone" />,
  Movie: <FilmStripIcon weight="duotone" />,
  Game: <GameControllerIcon weight="duotone" />,
  Article: <ArticleIcon weight="duotone" />,
  Music: <MusicNoteIcon weight="duotone" />,
  Series: <TelevisionIcon weight="duotone" />,
  Food: <ForkKnifeIcon weight="duotone" />,
  Websites: <GlobeIcon weight="duotone" />,
  Tools: <WrenchIcon weight="duotone" />,
  Event: <CalendarBlankIcon weight="duotone" />,
};

const categoryColors = {
  Book: colors.book,
  Movie: colors.movie,
  Game: colors.game,
  Article: colors.article,
  Music: colors.music,
  Series: colors.series,
  Food: colors.food,
  Websites: colors.websites,
  Tools: colors.tools,
  Event: colors.event,
};

const LogCard = ({ log, index, totalLogs }) => {
  const {
    title,
    category,
    author,
    by,
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
    album,
    releaseDate,
  } = log;

  const accentColor = categoryColors[category] || colors.primary[400];
  const Icon = categoryIcons[category] || <ArticleIcon />;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          size={14}
          weight="fill"
          className={i < rating ? '' : 'opacity-30'}
          style={{ color: i < rating ? accentColor : '#9ca3af' }}
        />,
      );
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  // Metadata helper to avoid rendering empty fields
  const MetadataItem = ({ label, value }) =>
    value ? (
      <div
        className="flex items-center gap-1 text-xs text-gray-300 px-2 py-1 rounded-md border border-gray-500/50"
        style={{ backgroundColor: `${accentColor}20` }}
      >
        <span className="font-semibold text-gray-400">{label}:</span>
        <span className="truncate max-w-[150px]">{value}</span>
      </div>
    ) : null;

  return (
    <Link
      to={`/logs/${log.category.toLowerCase()}/${slug}`}
      className="block h-full group"
    >
      <div
        className="relative h-full border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gray-700 flex flex-col"
        style={{ backgroundColor: `${accentColor}30` }}
      >
        {/* Left Border Accent */}
        <div
          className="absolute top-0 bottom-0 left-0 w-1 transition-all duration-300 group-hover:w-1.5"
          style={{ backgroundColor: accentColor }}
        />
        {/* Dotted Background */}
        <div
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, ${accentColor} 1px, transparent 1px)`,
            backgroundSize: '15px 15px', // Adjust size for desired density
          }}
        ></div>

        <div className="p-5 flex flex-col h-full ml-1">
          {' '}
          {/* ml-1 to account for border */}
          {/* Header: Icon, Index */}
          <div className="flex justify-between items-start mb-3">
            <div
              className="p-2 rounded-lg  text-white"
              style={{
                color: accentColor,
                backgroundColor: `${accentColor}30`,
              }}
            >
              <span className="text-2xl">{Icon}</span>
            </div>
            <span className="text-xs font-mono text-gray-400 group-hover:text-gray-400 transition-colors">
              #{totalLogs - index}
            </span>
          </div>
          {/* Title */}
          <h3 className="font-mono text-lg font-bold text-gray-100 mb-2 leading-snug group-hover:text-white transition-colors">
            {title}
          </h3>
          {/* Metadata Grid */}
          <div className="flex flex-wrap gap-2 mb-4">
            <MetadataItem
              label="By"
              value={by || author || artist || creator || director}
            />
            <MetadataItem label="On" value={platform || source} />
            <MetadataItem
              label="Year"
              value={year || (releaseDate ? releaseDate.split('-')[0] : null)}
            />
            {album && <MetadataItem label="Album" value={album} />}
          </div>
          {/* Spacer */}
          <div className="flex-grow" />
          {/* Footer: Rating & Date */}
          <div
            className={`flex items-end justify-between mt-4 pt-4 border-t`}
            style={{ borderColor: `${accentColor}50` }}
          >
            <div className="flex flex-col gap-1">
              {renderStars(rating)}
              {rating > 0 && (
                <span className="text-xs text-gray-400 font-mono">
                  ({rating}/5)
                </span>
              )}
            </div>

            <div className="text-right flex flex-col items-end">
              {updated && (
                <span className="text-[10px] text-rose-400 font-mono mb-0.5">
                  Updated
                </span>
              )}
              <div className="flex items-center gap-1 text-xs text-gray-400 font-mono">
                <CalendarBlankIcon size={12} />
                {date}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LogCard;
