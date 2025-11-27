import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import { useAnimation } from '../context/AnimationContext'; // Import useAnimation

const PostItem = ({
  slug,
  title,
  date,
  updatedDate,
  category,
  series,
  seriesIndex,
  isSeries,
  authors, // Change to authors array
}) => {
  const {
    isAnimationEnabled,
    showAnimationsHomepage,
    showAnimationsInnerPages,
  } = useAnimation(); // Use the animation context
  const location = useLocation(); // Get current location

  // Format the date to a shorter format: Month Day, Year
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Format the updated date if it exists
  const formattedUpdatedDate = updatedDate
    ? new Date(updatedDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const categoryBadgeColorStyle = {
    backgroundColor:
      category === 'dev'
        ? 'var(--color-dev-badge)'
        : category === 'series'
          ? 'var(--color-series-badge)'
          : category === 'd&d'
            ? 'var(--color-dnd-badge)'
            : category === 'gist'
              ? 'var(--color-gist-badge)'
              : category === 'feat'
                ? 'var(--color-feat-badge)'
                : 'var(--color-rant-badge)',
  };

  const postBackgroundColorClass =
    category === 'dev'
      ? 'bg-dev-card-bg'
      : category === 'series'
        ? 'bg-series-card-bg'
        : category === 'd&d'
          ? 'bg-dnd-card-bg'
          : category === 'gist'
            ? 'bg-gist-card-bg'
            : category === 'feat'
              ? 'bg-feat-card-bg'
              : 'bg-rant-card-bg';

  const postHoverBackgroundColorClass =
    category === 'dev'
      ? 'hover:bg-dev-card-bg-hover'
      : category === 'series'
        ? 'hover:bg-series-card-bg-hover'
        : category === 'd&d'
          ? 'hover:bg-dnd-card-bg-hover'
          : category === 'gist'
            ? 'hover:bg-gist-card-bg-hover'
            : category === 'feat'
              ? 'hover:bg-feat-card-bg-hover'
              : 'hover:bg-rant-card-bg-hover';

  const postTitleHoverColorClass =
    category === 'dev'
      ? 'group-hover:text-[var(--title-hover-dev)]'
      : category === 'series'
        ? 'group-hover:text-[var(--title-hover-series)]'
        : category === 'd&d'
          ? 'group-hover:text-[var(--title-hover-dnd)]'
          : category === 'gist'
            ? 'group-hover:text-[var(--title-hover-gist)]'
            : category === 'feat'
              ? 'group-hover:text-[var(--title-hover-feat)]'
              : 'group-hover:text-[var(--title-hover-rant)]';

  const categoryBadgeFontColorStyle =
    category === 'gist' || category === 'gist' ? 'text-black' : 'text-white'
  ;

  const shouldAnimate =
    isAnimationEnabled &&
    ((location.pathname === '/' && showAnimationsHomepage) ||
      (location.pathname !== '/' && showAnimationsInnerPages));

  return (
    <Link
      to={`/blog/${slug}`}
      className={`block p-8 my-4 border border-gray-700/50 rounded-lg shadow-lg cursor-pointer transition-colors group relative overflow-hidden ${postBackgroundColorClass} ${postHoverBackgroundColorClass} ${shouldAnimate ? 'animated-grid-bg' : ''}`}
    >
      <article>
        <div className="flex items-center">
          <p className="text-sm text-gray-400 w-28 flex-shrink-0">
            {formattedDate}
            {authors && authors.length > 0 && <span className="block text-xs text-gray-500">by {authors[0]}</span>}
          </p>
          <div className="ml-4 flex-grow flex items-center">
            {category && (
              <span
                className={`mr-2 px-2 py-1 font-arvo text-xs ${categoryBadgeFontColorStyle} rounded-md hidden sm:inline-block w-16 text-center`}
                style={categoryBadgeColorStyle}
              >
                {category}
              </span>
            )}
            {series && isSeries === undefined && (
              <span className="mr-2 px-2 py-1 text-xs font-medium text-blue-400 bg-blue-400/10 rounded-full">
                {series} - Part {seriesIndex}
              </span>
            )}
            <h2
              className={`text-lg font-mono text-white ${postTitleHoverColorClass} group-hover:underline transition-colors`}
            >
              {title}
            </h2>
          </div>
          {formattedUpdatedDate && updatedDate !== date && (
            <span className="hidden sm:inline-block ml-4 px-2 py-1 text-xs font-medium text-orange-400 bg-orange-400/10 rounded-full">
              Update: {formattedUpdatedDate}
            </span>
          )}
          <span
            className={`ml-4 flex-shrink-0 text-sm font-medium text-primary-400 ${postTitleHoverColorClass} group-hover:underline transition-colors`}
          >
            <span className="hidden sm:inline">
              {isSeries ? 'View Series' : 'Read post'}
            </span>{' '}
            &rarr;
          </span>
        </div>
      </article>
    </Link>
  );
};

export default PostItem;
