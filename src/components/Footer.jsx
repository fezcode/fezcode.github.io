import React from 'react';
import { Link } from 'react-router-dom';
import { version } from '../version';
import {
  TwitterLogo,
  GithubLogo,
  LinkedinLogo,
  Command,
  Terminal,
} from '@phosphor-icons/react';

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#050505] border-t-2 border-white/10 mt-auto selection:bg-white selection:text-black">
      <div className="mx-auto max-w-[1600px] px-6 py-12 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          {/* Column 1: Brand & Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex flex-col gap-4">
              <Link to="/" onClick={scrollToTop} className="group inline-block">
                <span className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white">
                  fez<span className="text-emerald-500">codex</span>
                </span>
              </Link>
              <p className="max-w-md text-gray-400 font-mono text-xs leading-relaxed uppercase tracking-widest">
                {'//'} A digital garden of experimental code, architectural
                thoughts, and creative explorations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-white/10 p-4 bg-white/[0.02]">
                <h4 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Site Info
                </h4>
                <div className="space-y-1 font-mono text-[10px] uppercase tracking-widest">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version:</span>
                    <span className="text-white">v{version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year:</span>
                    <span className="text-white">
                      {new Date().getFullYear()}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-500 font-black">
                    <span>Status:</span>
                    <span>Live</span>
                  </div>
                </div>
              </div>

              <div className="border border-white/10 p-4 bg-white/[0.02] flex flex-col justify-center gap-3">
                <div className="flex items-center gap-2 text-white">
                  <Command size={16} className="text-emerald-500" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
                    Quick Menu
                  </span>
                </div>
                <div className="font-mono text-[10px] text-gray-500 uppercase leading-relaxed">
                  Press{' '}
                  <kbd className="bg-white text-black px-1 font-black">Alt</kbd>{' '}
                  + <kbd className="bg-white text-black px-1 font-black">K</kbd>{' '}
                  for commands.
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:col-span-4">
            <h3 className="font-mono text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
              <Terminal size={16} className="text-emerald-500" />
              Navigation
            </h3>

            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-widest">
              {[
                { label: 'Home', to: '/' },
                { label: 'About', to: '/about' },
                { label: 'Blog', to: '/blog' },
                { label: 'Projects', to: '/projects' },
                { label: 'Logs', to: '/logs' },
                { label: 'Vocab', to: '/vocab' },
                { label: 'Apps', to: '/apps' },
                { label: 'Timeline', to: '/timeline' },
                { label: 'Manuals', to: '/commands' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={scrollToTop}
                    className="text-gray-500 hover:text-white flex items-center gap-2 transition-colors group"
                  >
                    <span className="text-emerald-500 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/rss.xml"
                  target="_blank"
                  className="text-gray-500 hover:text-white flex items-center gap-2"
                >
                  <span className="text-emerald-500">→</span> RSS Feed
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div className="lg:col-span-3">
            <h3 className="font-mono text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-8">
              Connect
            </h3>

            <div className="flex gap-3 mb-8">
              <SocialIcon href="https://x.com/fezcoddy" icon={TwitterLogo} />
              <SocialIcon href="https://github.com/fezcode" icon={GithubLogo} />
              <SocialIcon
                href="https://www.linkedin.com/in/ahmed-samil-bulbul/"
                icon={LinkedinLogo}
              />
            </div>

            <div className="space-y-3 border-t border-white/10 pt-6">
              <p className="font-mono text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                Newsletter
              </p>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  placeholder="Coming soon..."
                  className="w-full bg-white text-black font-mono text-[9px] uppercase tracking-widest py-2 px-3 border-none focus:ring-0 placeholder-black/40 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} Fezcode // Built with React &
            Tailwind
          </p>
          <p className="text-white font-bold">Thanks for visiting</p>
        </div>
      </div>
    </footer>
  );
};
const SocialIcon = ({ href, icon: Icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="w-12 h-12 border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all group"
  >
    <Icon size={24} weight="bold" />
  </a>
);

export default Footer;
