import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-16 sm:mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="border-t border-gray-700/50 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white">Newsletter</h3>
              <p className="mt-4 text-sm text-gray-400">Subscribe to our newsletter to get the latest updates straight to your inbox.</p>
              <form className="mt-4 flex gap-2">
                <input type="email" placeholder="Enter your email" className="bg-gray-800 text-white px-4 py-2 rounded-md w-full" />
                <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Subscribe</button>
              </form>
            </div>
            <div className="md:text-right">
              <h3 className="text-lg font-semibold text-white">Follow Us</h3>
              <div className="mt-4 flex md:justify-end gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700/50 pt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} My Awesome Blog. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;