import React from 'react';
import { Link } from 'react-router-dom';
import { version } from '../version';

const Footer = () => {
  return (
    <footer className="mt-1 sm:mt-1">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="border-t border-gray-700/50 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white">Newsletter</h3>
              <p className="mt-4 text-sm text-gray-400">Our newsletter is currently under construction. We are working hard (not really) to bring it to you soon!</p>
              <form className="mt-4 flex gap-2">
                <input type="email" placeholder="Coming soon, maybe..." className="bg-gray-800 text-white px-4 py-2 rounded-md w-full" disabled />
                <button type="submit" className="bg-primary-500 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>Subscribe</button>
              </form>
            </div>
            <div className="md:text-right">
              <h3 className="text-lg font-semibold text-white">Socials</h3>
              <div className="mt-4 flex md:justify-end gap-4">
                <a href="https://x.com/fezcoddy" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="https://github.com/fezcode" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
                <a href="https://www.linkedin.com/in/ahmed-samil-bulbul/?locale=en_US" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700/50 pt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-400">
              <Link to="/" className="hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</Link>
              <Link to="/about" className="hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>About</Link>
              <Link to="/blog" className="hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Blog</Link>
              <Link to="/projects" className="hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Projects</Link>
              <Link to="/logs" className="text-primary-400 hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Logs</Link>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} fezcode. All rights reserved. <code> v{version} </code>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;