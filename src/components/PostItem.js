import React from 'react';
import { Link } from 'react-router-dom';

const PostItem = ({ slug }) => {
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const date = 'October 15, 2025'; // Placeholder date

  return (
    <article className="py-8 border-b border-gray-700">
      <div className="flex items-center">
        <p className="text-sm text-gray-400">{date}</p>
        <div className="ml-4 flex-grow flex items-center">
          <h2 className="text-xl font-bold">
            <Link to={`/blog/${slug}`} className="text-white hover:text-blue-400 transition-colors">
              {title}
            </Link>
          </h2>
        </div>
        <Link to={`/blog/${slug}`} className="ml-4 flex-shrink-0 text-sm font-medium text-teal-400 hover:text-teal-500 transition-colors">
          Read post &rarr;
        </Link>
      </div>
    </article>
  );
};

export default PostItem;