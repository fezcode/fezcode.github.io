import React from 'react';
import { Link } from 'react-router-dom';
import { version } from '../version';
import {
  TwitterLogo,
  GithubLogo,
  LinkedinLogo,
  PaperPlaneRight,
  Command,
} from '@phosphor-icons/react';
import Fez from './Fez';

const Footer = () => {
  return (
    <footer className="mt-auto bg-gray-950 border-t border-gray-800/50 relative overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Column 1: Brand & Tech Info */}
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2 group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Fez className="w-8 h-8 text-primary-500 transition-transform group-hover:rotate-12" />
              <span className="text-xl font-bold tracking-tight text-white font-arvo">
                fez<span className="text-primary-400">codex</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              A digital garden of code, thoughts, and interactive experiments.
            </p>
            <div className="pt-4 flex flex-col gap-2 text-xs text-gray-500 font-mono">
              <p className="flex items-center gap-2">
                <Command size={16} className="text-primary-500" />
                <span>
                  Press{' '}
                  <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700 text-gray-300">
                    Alt
                  </kbd>{' '}
                  +{' '}
                  <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700 text-gray-300">
                    K
                  </kbd>{' '}
                  for commands
                </span>
              </p>
              <p>
                v{version} // {new Date().getFullYear()}
              </p>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase font-mono mb-4">
              Navigation
            </h3>
            <ul className="grid grid-cols-2 gap-3 text-sm text-gray-400">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary-400 transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary-400 transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-primary-400 transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="hover:text-primary-400 transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/logs"
                  className="hover:text-primary-400 transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                >
                  Logs
                </Link>
              </li>
              <li>
                <Link
                  to="/apps"
                  className="hover:text-primary-400 transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                >
                  Apps
                </Link>
              </li>
              <li>
                <Link
                  to="/timeline"
                  className="hover:text-primary-400 transition-colors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                >
                  Timeline
                </Link>
              </li>
              <li>
                <Link
                  to="/rss.xml"
                  target="_blank"
                  className="hover:text-primary-400 transition-colors"
                >
                  RSS
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase font-mono mb-4">
              Connect
            </h3>
            <div className="flex gap-4 mb-6">
              <a
                href="https://x.com/fezcoddy"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white transition-colors hover:bg-gray-800 p-2 rounded-lg"
              >
                <TwitterLogo size={24} weight="fill" />
              </a>
              <a
                href="https://github.com/fezcode"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white transition-colors hover:bg-gray-800 p-2 rounded-lg"
              >
                <GithubLogo size={24} weight="fill" />
              </a>
              <a
                href="https://www.linkedin.com/in/ahmed-samil-bulbul/?locale=en_US"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-white transition-colors hover:bg-gray-800 p-2 rounded-lg"
              >
                <LinkedinLogo size={24} weight="fill" />
              </a>
            </div>

            {/* Fake Newsletter */}
            <div className="relative">
              <input
                type="text"
                disabled
                placeholder="Newsletter coming soon..."
                className="w-full bg-gray-900/50 border border-gray-800 rounded-lg py-2.5 pl-4 pr-10 text-sm text-gray-500 cursor-not-allowed"
              />
              <PaperPlaneRight
                size={16}
                className="absolute right-3 top-3 text-gray-600"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800/50 text-center md:text-left">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} fezcode. Built with React,
            Tailwind, and caffeine.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
