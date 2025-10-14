import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to My Blog</h1>
      <p className="text-lg mb-8">
        This is my personal blog where I share my thoughts on web development, technology, and more.
      </p>
      <Link to="/blog" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Go to Blog
      </Link>
    </div>
  );
};

export default HomePage;