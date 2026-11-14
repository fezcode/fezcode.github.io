import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Wordup.css';
import { getWordupCopy } from './wordupCopy';
export const wordLanguage = (language) =>
  language === 'tr' ? 'Türkçe' : 'English';
export const wordNumber = (number) => String(number).padStart(3, '0');
export default function WordupShell({
  children,
  detail = false,
  language = 'en',
}) {
  const copy = getWordupCopy(language);
  return (
    <div
      className={'wordup wf-shell ' + (detail ? 'wf-shell--entry' : '')}
      lang={copy.language}
    >
      <a href="#wordup-content" className="wf-skip">
        {copy.skip}
      </a>
      <header className="wf-header">
        <Link to="/wordup" className="wf-brand">
          <svg viewBox="0 0 36 36" aria-hidden="true">
            <path
              d="M8 10c0-4 8-5 10 0l8 16c2 4 8 1 6-3L22 5c-2-4-8-3-8 1v23c0 4-8 4-8 0V15c0-5 8-5 8 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </svg>
          <span>
            wordup<span className="wf-brand-dot">.</span>
          </span>
        </Link>
        <span className="wf-header-note">{copy.headerNote}</span>
        <Link to="/" className="wf-back-home">
          fezcode <span aria-hidden="true">↗</span>
        </Link>
      </header>
      <div id="wordup-content" tabIndex={-1} className="wf-main">
        {children}
      </div>
      <footer className="wf-footer">
        <span>{copy.footerNote}</span>
        <span>
          TR + EN <i aria-hidden="true" /> {copy.footerCredit}
        </span>
      </footer>
    </div>
  );
}
