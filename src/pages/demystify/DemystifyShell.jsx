import React from 'react';
import { Link } from 'react-router-dom';
import useDemystifyTheme from './useDemystifyTheme';
import '../../styles/Demystify.css';

/**
 * Chrome shared by every /demystify page: the palette, the masthead, and the
 * footer toolbar. Site navigation is hidden under /demystify (see Layout.jsx),
 * so the breadcrumb here is the only way back out.
 */
const DemystifyShell = ({
  brand,
  tagline,
  backTo,
  backLabel,
  footerNote,
  toolbar,
  children,
}) => {
  const { themeLabel, cycleTheme } = useDemystifyTheme();

  return (
    <div className="dm-root">
      <div className="dm-container">
        <header className="dm-header">
          <div className="dm-masthead">
            {backTo && (
              <Link className="dm-uplink" to={backTo}>
                [← {backLabel}]
              </Link>
            )}
            <h1 className="dm-brand">{brand}</h1>
            {tagline && <p className="dm-tagline">{tagline}</p>}
          </div>
          <div className="dm-subbrand">
            TRUST ME BRO<sup>TM</sup>
          </div>
        </header>

        <main className="dm-main">{children}</main>

        <footer className="dm-footer">
          <div className="dm-footer-note">
            <span>DEMYSTIFY</span>
            <span className="dm-dot">•</span>
            <span>{footerNote || 'MINIMALIST ARCHIVE'}</span>
          </div>

          <div className="dm-toolbar">
            {toolbar}
            <button
              type="button"
              className="dm-toggle"
              onClick={cycleTheme}
              aria-label={`Change colour theme, currently ${themeLabel}`}
            >
              THEME [{themeLabel}]
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DemystifyShell;
