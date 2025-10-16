import React from 'react';
import { Link } from 'react-router-dom';

const PostItem = ({ slug, title, date, updatedDate, category }) => {

  // Format the date to a shorter format: Month Day, Year
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Format the updated date if it exists
  const formattedUpdatedDate = updatedDate ? new Date(updatedDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) : null;

  const categoryBadgeColorStyle = { backgroundColor: category === 'dev' ? 'var(--color-dev-badge)' : 'var(--color-takes-badge)' };
  const postBackgroundColorStyle = {
    backgroundColor: category === 'dev' ? 'var(--color-dev-card-bg)' : 'var(--color-takes-card-bg)',
    '--hover-bg': category === 'dev' ? 'var(--color-dev-card-bg-hover)' : 'var(--color-takes-card-bg-hover)',
  };

  return (
    <Link to={`/blog/${slug}`} className={`block p-8 my-4 border border-gray-700/50 rounded-lg shadow-lg cursor-pointer transition-colors group`} style={postBackgroundColorStyle}>
      <article>
        <div className="flex items-center">
          <p className="text-sm text-gray-400">{formattedDate}</p>
          <div className="ml-4 flex-grow flex items-center">
            {category && (
              <span className={`mr-2 px-2 py-1 text-xs font-medium text-white rounded-md hidden sm:inline-block w-16 text-center`} style={categoryBadgeColorStyle}>
                {category}
              </span>
            )}
            <h2 className="text-xl font-semibold text-white group-hover:text-primary-400 transition-colors">
              {title}
            </h2>
          </div>
          {formattedUpdatedDate && updatedDate !== date && (
            <span className="hidden sm:inline-block ml-4 px-2 py-1 text-xs font-medium text-orange-400 bg-orange-400/10 rounded-full">Updated: {formattedUpdatedDate}</span>
          )}
          <span className="ml-4 flex-shrink-0 text-sm font-medium text-primary-400 hover:text-primary-500 transition-colors">
            <span className="hidden sm:inline">Read post</span> &rarr;
          </span>
        </div>
      </article>
    </Link>
  );
};

export default PostItem;