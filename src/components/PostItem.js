import React from 'react';
import { Link } from 'react-router-dom';

const PostItem = ({ slug, title, date, updatedDate }) => {

  // Format the date from YYYY-MM-DD to 'Month Day, Year'
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Format the updated date if it exists
  const formattedUpdatedDate = updatedDate ? new Date(updatedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : null;

  return (
    <Link to={`/blog/${slug}`} className="block p-8 my-4 border border-gray-700/50 rounded-lg shadow-lg cursor-pointer hover:bg-gray-800/30 transition-colors">
      <article>
        <div className="flex items-center">
          <p className="text-sm text-gray-400">{formattedDate}</p>
          <div className="ml-4 flex-grow flex items-center">
            <h2 className="text-xl font-semibold text-white hover:text-primary-400 transition-colors">
              {title}
            </h2>
          </div>
          {formattedUpdatedDate && updatedDate !== date && (
            <span className="hidden sm:inline-block ml-4 px-2 py-1 text-xs font-medium text-blue-400 bg-blue-400/10 rounded-full">Updated: {formattedUpdatedDate}</span>
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