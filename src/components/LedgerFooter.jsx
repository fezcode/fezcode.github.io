import React from 'react';
import { Link } from 'react-router-dom';
import { version } from '../version';
import { useAboutData } from '../hooks/useAboutData';
import {
  LedgerLeader,
  LedgerRegister,
  LedgerRule,
  LedgerStamp,
} from './ledger';
import '../styles/Ledger.css';

/**
 * Ledger theme footer — the book's colophon page. Three ruled columns:
 * the imprint (wordmark, tagline, stamp), the directory written with dotted
 * leaders and entry numbers, and the account (connect links + meta figures).
 * The register cycler sits in the closing line, where a ledger records how
 * the balance is carried forward.
 */
const LedgerFooter = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const aboutData = useAboutData();
  const year = new Date().getFullYear();

  const DIRECTORY = [
    { label: 'PROJECTS', to: '/projects' },
    { label: 'BLOG', to: '/blog' },
    { label: 'APPS', to: '/apps' },
    { label: 'LOGS', to: '/logs' },
    { label: 'VOCAB', to: '/vocab' },
    { label: 'ABOUT', to: '/about' },
    { label: 'SETTINGS', to: '/settings' },
  ];

  const connectLinks = (aboutData.profile.links || []).filter(
    (l) => l.id !== 'email' && l.id !== 'website',
  );

  return (
    <footer className="ldg-chrome mt-auto" style={{ borderTop: '1px solid var(--ldg-rule)' }}>
      <div className="mx-auto max-w-[1280px] px-5 md:px-10 pt-12 pb-8">
        {/* imprint line */}
        <div className="flex flex-wrap items-baseline justify-between gap-3 pb-4">
          <span className="ldg-eyebrow">COLOPHON · v{version}</span>
          <span className="ldg-label hidden md:inline">
            RANKED · ANNOTATED · CARRIED FORWARD
          </span>
          <span className="ldg-label">FILED {year}</span>
        </div>
        <LedgerRule />

        {/* main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 pt-10">
          {/* imprint */}
          <div className="md:col-span-4 flex flex-col gap-5 items-start">
            <Link to="/" onClick={scrollToTop} className="no-underline">
              <span
                className="font-bold uppercase"
                style={{
                  color: 'var(--ldg-highlight)',
                  letterSpacing: '2px',
                  fontSize: '1.25rem',
                }}
              >
                FEZCODEX
              </span>
              <span className="ldg-eyebrow block mt-1">
                THE WHOLE CODEX, KEPT IN INK
              </span>
            </Link>
            <p className="ldg-intro" style={{ fontSize: '0.82rem' }}>
              {aboutData.profile.tagline ||
                'Experimental software, field notes, and small instruments — every entry ranked, annotated, and filed.'}
            </p>
            <LedgerStamp />
          </div>

          {/* directory */}
          <div className="md:col-span-4">
            <LedgerRule label="DIRECTORY" className="mb-4" />
            <ol className="list-none p-0 m-0 flex flex-col gap-2">
              {DIRECTORY.map((link, i) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={scrollToTop}
                    className="ldg-leader-row no-underline group"
                  >
                    <span className="ldg-rank">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="uppercase font-bold group-hover:text-[var(--ldg-accent)]"
                      style={{ fontSize: '0.85rem', letterSpacing: '1px' }}
                    >
                      {link.label}
                    </span>
                    <span className="ldg-leader" aria-hidden="true" />
                    <span className="ldg-accent" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          {/* account */}
          <div className="md:col-span-4 flex flex-col gap-8">
            <div>
              <LedgerRule label="CONNECT" className="mb-4" />
              <div className="flex flex-col gap-2">
                {connectLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ldg-leader-row no-underline group"
                  >
                    <span
                      className="uppercase font-bold group-hover:text-[var(--ldg-accent)]"
                      style={{ fontSize: '0.85rem', letterSpacing: '1px' }}
                    >
                      {link.label}
                    </span>
                    <span className="ldg-leader" aria-hidden="true" />
                    <span className="ldg-accent" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <LedgerRule label="THE ACCOUNT" className="mb-4" />
              <div className="flex flex-col gap-2" style={{ fontSize: '0.8rem' }}>
                <LedgerLeader label="KERNEL" value={`v${version}`} />
                <LedgerLeader label="TYPE" value="JETBRAINS MONO" />
                <LedgerLeader label="SHORTCUT" value="⌘K" />
                <div className="ldg-leader-row">
                  <span className="ldg-label">REGISTER</span>
                  <span className="ldg-leader" aria-hidden="true" />
                  <LedgerRegister />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* closing line */}
        <LedgerRule className="mt-12" />
        <div className="pt-4 flex flex-col md:flex-row items-start md:items-baseline justify-between gap-2">
          <span className="ldg-label">
            © {year} · FEZCODE / AHMED SAMIL BULBUL
          </span>
          <span className="ldg-label">
            LEDGER · ENTRIES ARE NEVER ERASED, ONLY SUPERSEDED
          </span>
        </div>
      </div>
    </footer>
  );
};

export default LedgerFooter;
