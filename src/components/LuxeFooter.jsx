import React from 'react';
import { Link } from 'react-router-dom';
import { version } from '../version';
import { useAboutData } from '../hooks/useAboutData';
import { Command } from '@phosphor-icons/react';

const LuxeFooter = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const aboutData = useAboutData();

  return (
    <footer className="bg-[#F5F5F0] border-t border-[#1A1A1A]/5 mt-auto text-[#1A1A1A]">
      <div className="mx-auto max-w-[1800px] px-6 py-20 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">

          {/* Brand Column */}
          <div className="md:col-span-4 space-y-8">
            <Link to="/" onClick={scrollToTop} className="inline-block">
              <span className="font-playfairDisplay text-4xl italic font-medium text-[#1A1A1A]">
                Fezcodex.
              </span>
            </Link>
            <p className="font-outfit text-sm text-[#1A1A1A]/60 leading-relaxed max-w-sm">
              {aboutData.profile.tagline || 'A digital garden of experimental code, architectural thoughts, and creative explorations.'}
            </p>

            <div className="pt-8 flex flex-col gap-2 font-outfit text-xs text-[#1A1A1A]/40 uppercase tracking-widest">
               <span>v{version} — {new Date().getFullYear()}</span>
               <span>Built with Precision</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-4">
             <h4 className="font-outfit text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/40 mb-8">Directory</h4>
             <ul className="space-y-4">
                {[
                  { label: 'Journal', to: '/blog' },
                  { label: 'Projects', to: '/projects' },
                  { label: 'About', to: '/about' },
                  { label: 'Logbook', to: '/logs' },
                  { label: 'System', to: '/settings' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} onClick={scrollToTop} className="font-playfairDisplay text-xl text-[#1A1A1A]/80 hover:text-[#1A1A1A] hover:italic transition-all">
                      {link.label}
                    </Link>
                  </li>
                ))}
             </ul>
          </div>

          {/* Connect Column */}
          <div className="md:col-span-4">
             <h4 className="font-outfit text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/40 mb-8">Connect</h4>
             <div className="flex flex-wrap gap-4 mb-12">
                {aboutData.profile.links.filter(l => l.id !== 'email' && l.id !== 'website').map((link, i) => (
                   <a
                     key={i}
                     href={link.url}
                     target="_blank"
                     rel="noreferrer"
                     className="font-outfit text-sm text-[#1A1A1A] border-b border-[#1A1A1A]/20 hover:border-[#1A1A1A] pb-1 transition-colors"
                   >
                      {link.label}
                   </a>
                ))}
             </div>

             <div className="p-6 border border-[#1A1A1A]/5 bg-white rounded-sm">
                 <div className="flex items-center gap-3 mb-2 text-[#1A1A1A]/60">
                    <Command size={16} />
                    <span className="font-outfit text-[10px] uppercase tracking-widest">Quick Actions</span>
                 </div>
                 <p className="font-outfit text-xs text-[#1A1A1A]/40">
                    Press <kbd className="font-mono bg-[#1A1A1A]/5 px-1 rounded">Cmd + K</kbd> to open command palette.
                 </p>
             </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default LuxeFooter;
