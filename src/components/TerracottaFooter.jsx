import React from 'react';
import { Link } from 'react-router-dom';
import { version } from '../version';
import { useAboutData } from '../hooks/useAboutData';
import { TerracottaMark } from './terracotta';

/**
 * Terracotta theme footer — a page-wide editorial colophon.
 * Four columns mirroring the Plumb brand footer, plus a brand strip at the top.
 *   [wordmark · tagline]   [directory]   [connect]   [meta]
 */
const TerracottaFooter = () => {
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
    <footer className="relative bg-[#F3ECE0] text-[#1A1613] mt-auto border-t border-[#1A161320]">
      <div className="mx-auto max-w-[1280px] px-6 md:px-14 pt-20 pb-12">
        {/* top strip — mono metadata line */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase text-[#2E2620] pb-4 border-b border-[#1A161320]">
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block w-[6px] h-[6px] rounded-full bg-[#C96442]"
            />
            Colophon · v{version}
          </span>
          <span className="text-center opacity-60">
            Hold the line. Drop. Read true.
          </span>
          <span className="text-right opacity-70">File 001 — of 001</span>
        </div>

        {/* main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 pt-14">
          {/* brand */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <Link
              to="/"
              onClick={scrollToTop}
              className="flex items-baseline gap-3 group"
            >
              <TerracottaMark size={22} color="#C96442" />
              <span
                className="font-fraunces text-[34px] tracking-[-0.03em] text-[#1A1613] leading-none"
                style={{
                  fontVariationSettings:
                    '"opsz" 48, "SOFT" 30, "WONK" 1, "wght" 480',
                }}
              >
                Fezcodex
                <span
                  aria-hidden="true"
                  className="text-[#C96442]"
                  style={{ fontVariationSettings: '"wght" 800' }}
                >
                  .
                </span>
              </span>
            </Link>
            <p
              className="font-fraunces italic text-[16px] leading-[1.5] text-[#2E2620] max-w-[32ch]"
              style={{
                fontVariationSettings:
                  '"opsz" 18, "SOFT" 100, "WONK" 0, "wght" 380',
              }}
            >
              {aboutData.profile.tagline ||
                'A weighted codex of experimental software, field notes, and small honest instruments.'}
            </p>

            <div className="pt-3 flex flex-wrap gap-x-5 gap-y-1.5 font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase text-[#2E2620]/60">
              <span>v{version}</span>
              <span>·</span>
              <span>{year}</span>
              <span>·</span>
              <span>terracotta</span>
            </div>
          </div>

          {/* directory */}
          <div className="md:col-span-4">
            <h5 className="font-ibm-plex-mono text-[9.5px] tracking-[0.24em] uppercase text-[#9E4A2F] mb-5 pb-3 border-b border-[#1A161320]">
              Directory
            </h5>
            <ol
              className="list-none p-0"
              style={{ counterReset: 'dir' }}
            >
              {DIRECTORY.map((link) => (
                <li
                  key={link.to}
                  className="grid grid-cols-[28px_1fr] items-baseline py-2.5 border-b border-dashed border-[#1A161320]"
                  style={{ counterIncrement: 'dir' }}
                >
                  <span
                    aria-hidden="true"
                    className="font-ibm-plex-mono text-[10px] tracking-[0.14em] text-[#9E4A2F]/85"
                  >
                    <span className="before:content-[counter(dir,decimal-leading-zero)]" />
                  </span>
                  <Link
                    to={link.to}
                    onClick={scrollToTop}
                    className="font-fraunces text-[17px] text-[#1A1613] hover:text-[#9E4A2F] hover:italic transition-colors"
                    style={{
                      fontVariationSettings: '"opsz" 18, "wght" 420',
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ol>
            {/* counter CSS */}
            <style>{`
              .terracotta-footer-dir li span::before {
                content: counter(dir, decimal-leading-zero);
              }
            `}</style>
          </div>

          {/* connect + meta */}
          <div className="md:col-span-4 flex flex-col gap-10">
            <div>
              <h5 className="font-ibm-plex-mono text-[9.5px] tracking-[0.24em] uppercase text-[#9E4A2F] mb-5 pb-3 border-b border-[#1A161320]">
                Connect
              </h5>
              <div className="flex flex-col gap-2">
                {(aboutData.profile.links || [])
                  .filter((l) => l.id !== 'email' && l.id !== 'website')
                  .map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-baseline justify-between gap-4 py-2 border-b border-dashed border-[#1A161320]"
                    >
                      <span
                        className="font-fraunces text-[17px] text-[#1A1613] group-hover:text-[#9E4A2F] group-hover:italic transition-colors"
                        style={{
                          fontVariationSettings: '"opsz" 18, "wght" 420',
                        }}
                      >
                        {link.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="font-ibm-plex-mono text-[10px] tracking-[0.18em] uppercase text-[#2E2620]/50 group-hover:text-[#9E4A2F] transition-colors"
                      >
                        ↗
                      </span>
                    </a>
                  ))}
              </div>
            </div>

            <div>
              <h5 className="font-ibm-plex-mono text-[9.5px] tracking-[0.24em] uppercase text-[#9E4A2F] mb-5 pb-3 border-b border-[#1A161320]">
                Meta
              </h5>
              <div className="space-y-3 font-ibm-plex-mono text-[11px] leading-[1.7] text-[#2E2620]/85">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="opacity-60 tracking-[0.14em] uppercase text-[10px]">
                    Shortcut
                  </span>
                  <span className="inline-flex gap-1">
                    <kbd className="px-1.5 py-0.5 border border-[#1A161320] rounded-[2px]">
                      ⌘
                    </kbd>
                    <kbd className="px-1.5 py-0.5 border border-[#1A161320] rounded-[2px]">
                      K
                    </kbd>
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="opacity-60 tracking-[0.14em] uppercase text-[10px]">
                    Kernel
                  </span>
                  <span>v{version}</span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="opacity-60 tracking-[0.14em] uppercase text-[10px]">
                    Type
                  </span>
                  <span>Fraunces · IBM Plex Mono</span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="opacity-60 tracking-[0.14em] uppercase text-[10px]">
                    Palette
                  </span>
                  <span className="inline-flex gap-1">
                    {['#F3ECE0', '#1A1613', '#C96442', '#B88532', '#6B8E23'].map((c) => (
                      <i
                        key={c}
                        aria-label={c}
                        className="block border border-[#1A161320]"
                        style={{
                          width: 14,
                          height: 14,
                          background: c,
                          display: 'inline-block',
                        }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom rule */}
        <div className="mt-16 pt-5 border-t border-[#1A161320] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase text-[#2E2620]/65">
          <span>
            © {year} · Fezcode / Ahmed Samil Bulbul
          </span>
          <span className="opacity-80">
            Terracotta · set on Plumb identity v1
          </span>
        </div>
      </div>
    </footer>
  );
};

export default TerracottaFooter;
