import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';

const NotFoundPage = () => {
  return (
    <div className="text-center mt-20 mb-20">
      <h1 className="text-9xl font-bold text-gray-400">404</h1>
      <p className="text-2xl md:text-3xl font-light mb-8 text-white">
        {' '}
        {/* Added text-white class */}
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg"
      >
        {' '}
        {/* Changed styling and text */}
        <ArrowLeftIcon size={24} /> Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
