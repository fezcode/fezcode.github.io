import React from 'react';
import { Link } from 'react-router-dom';

const PostItem = ({ slug }) => {
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const date = 'October 15, 2025'; // Placeholder date

  return (
    <Link to={`/blog/${slug}`} className="block p-8 my-4 border border-gray-700/50 rounded-lg shadow-lg cursor-pointer hover:bg-gray-800/30 transition-colors">
      <article>
        <div className="flex items-center">
          <p className="text-sm text-gray-400">{date}</p>
          <div className="ml-4 flex-grow flex items-center">
            <h2 className="text-xl font-semibold text-white hover:text-primary-400 transition-colors">
              {title}
            </h2>
          </div>
          <span className="ml-4 flex-shrink-0 text-sm font-medium text-primary-400 hover:text-primary-500 transition-colors">
            Read post &rarr;
          </span>
        </div>
      </article>
    </Link>
  );
};

export default PostItem;