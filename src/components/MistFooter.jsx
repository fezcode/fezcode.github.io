import React from 'react';
import { Link } from 'react-router-dom';
import { version } from '../version';
import { useAboutData } from '../hooks/useAboutData';
import { MistOrb, MistHorizon } from './mist';

/**
 * Mist theme footer — a colophon written at the threshold of sleep.
 * Four columns mirroring the Terracotta layout, restyled as fog:
 *   [orb · tagline]   [directory]   [connect]   [meta]
 * Every rule is a horizon; every label is a whisper.
 */
const MistFooter = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const aboutData = useAboutData();
  const year = new Date().getFullYear();

  const DIRECTORY = [
    { label: 'Archive', to: '/projects' },
    { label: 'Field Notes', to: '/blog' },
    { label: 'Instruments', to: '/apps' },
    { label: 'Catalogue', to: '/logs' },
    { label: 'Glossary', to: '/vocab' },
    { label: 'About', to: '/about' },
    { label: 'Settings', to: '/settings' },
  ];

  return (
    <footer
      className="relative bg-[#EEF2F1] text-[#3C4845] mt-auto selection:bg-[#8FA8BC]/30"
      style={{
        backgroundImage:
          'radial-gradient(640px 360px at 50% 0%, #E5EBE9 0%, transparent 65%)',
      }}
    >
      <MistHorizon />
      <div className="mx-auto max-w-[1280px] px-6 md:px-14 pt-20 pb-12">
        {/* top strip — mono metadata line */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#5C6B67] pb-4">
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block w-[6px] h-[6px] rounded-full bg-[#8FA8BC] shadow-[0_0_8px_rgba(143,168,188,0.8)]"
            />
            colophon · v{version}
          </span>
          <span className="text-center opacity-60">
            half-remembered, half-imagined
          </span>
          <span className="text-right opacity-70">kept while waking</span>
        </div>
        <MistHorizon />

        {/* main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 pt-14">
          {/* brand */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <Link
              to="/"
              onClick={scrollToTop}
              className="flex items-center gap-3 group"
            >
              <MistOrb size={34} />
              <span className="font-instr-serif text-[34px] text-[#3C4845] leading-none group-hover:text-[#5F837B] transition-colors duration-[250ms]">
                Fezcodex
                <span aria-hidden="true" className="text-[#8FA8BC]">
                  .
                </span>
              </span>
            </Link>
            <p className="font-instr-serif italic text-[17px] leading-[1.5] text-[#5C6B67] max-w-[32ch]">
              {aboutData.profile.tagline ||
                'A drifting codex of experimental software, field notes, and small instruments — the fog keeps the rest.'}
            </p>

            <div className="pt-3 flex flex-wrap gap-x-5 gap-y-1.5 font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#8A9894]">
              <span>v{version}</span>
              <span>·</span>
              <span>{year}</span>
              <span>·</span>
              <span>mist</span>
            </div>
          </div>

          {/* directory */}
          <div className="md:col-span-4">
            <h5 className="font-ibm-plex-mono text-[9.5px] tracking-[0.24em] lowercase text-[#5F837B] mb-2 pb-3">
              directory
            </h5>
            <MistHorizon className="mb-3" />
            <ol className="list-none p-0">
              {DIRECTORY.map((link, i) => (
                <li
                  key={link.to}
                  className="grid grid-cols-[28px_1fr] items-baseline py-2.5"
                >
                  <span
                    aria-hidden="true"
                    className="font-ibm-plex-mono text-[10px] tracking-[0.14em] text-[#8FA8BC]"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Link
                    to={link.to}
                    onClick={scrollToTop}
                    className="font-instr-serif text-[18px] text-[#3C4845] hover:text-[#5F837B] hover:italic transition-colors duration-[250ms]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          {/* connect + meta */}
          <div className="md:col-span-4 flex flex-col gap-10">
            <div>
              <h5 className="font-ibm-plex-mono text-[9.5px] tracking-[0.24em] lowercase text-[#5F837B] mb-2 pb-3">
                connect
              </h5>
              <MistHorizon className="mb-3" />
              <div className="flex flex-col gap-2">
                {(aboutData.profile.links || [])
                  .filter((l) => l.id !== 'email' && l.id !== 'website')
                  .map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-baseline justify-between gap-4 py-2"
                    >
                      <span className="font-instr-serif text-[18px] text-[#3C4845] group-hover:text-[#5F837B] group-hover:italic transition-colors duration-[250ms]">
                        {link.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="font-ibm-plex-mono text-[10px] tracking-[0.18em] lowercase text-[#8A9894] group-hover:text-[#5F837B] transition-colors duration-[250ms]"
                      >
                        ↗
                      </span>
                    </a>
                  ))}
              </div>
            </div>

            <div>
              <h5 className="font-ibm-plex-mono text-[9.5px] tracking-[0.24em] lowercase text-[#5F837B] mb-2 pb-3">
                meta
              </h5>
              <MistHorizon className="mb-3" />
              <div className="space-y-3 font-ibm-plex-mono text-[11px] leading-[1.7] text-[#5C6B67]">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="opacity-60 tracking-[0.14em] lowercase text-[10px]">
                    shortcut
                  </span>
                  <span className="inline-flex gap-1">
                    <kbd className="px-1.5 py-0.5 rounded-md bg-white/40 backdrop-blur-sm shadow-[0_4px_14px_rgba(60,72,69,0.08)]">
                      ⌘
                    </kbd>
                    <kbd className="px-1.5 py-0.5 rounded-md bg-white/40 backdrop-blur-sm shadow-[0_4px_14px_rgba(60,72,69,0.08)]">
                      k
                    </kbd>
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="opacity-60 tracking-[0.14em] lowercase text-[10px]">
                    kernel
                  </span>
                  <span>v{version}</span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="opacity-60 tracking-[0.14em] lowercase text-[10px]">
                    type
                  </span>
                  <span>instrument serif · ibm plex mono</span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="opacity-60 tracking-[0.14em] lowercase text-[10px]">
                    palette
                  </span>
                  <span className="inline-flex gap-1">
                    {['#EEF2F1', '#3C4845', '#5F837B', '#8FA8BC', '#DFE5E3'].map(
                      (c) => (
                        <i
                          key={c}
                          aria-label={c}
                          className="rounded-full shadow-[0_2px_8px_rgba(60,72,69,0.14)]"
                          style={{
                            width: 14,
                            height: 14,
                            background: c,
                            display: 'inline-block',
                          }}
                        />
                      ),
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom rule */}
        <MistHorizon className="mt-16" />
        <div className="pt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase text-[#8A9894]">
          <span>© {year} · fezcode / ahmed samil bulbul</span>
          <span className="opacity-80">
            mist · visibility: low — proceed gently
          </span>
        </div>
      </div>
    </footer>
  );
};

export default MistFooter;
