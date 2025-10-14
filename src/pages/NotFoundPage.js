import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="text-center">
      <h1 className="text-9xl font-bold text-gray-400">404</h1>
      <p className="text-2xl md:text-3xl font-light mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;