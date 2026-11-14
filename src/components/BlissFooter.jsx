import React from 'react';
import { Link } from 'react-router-dom';
import { BlissWindow } from './bliss';

/** The page's closing window: a short sign-off and a few links. */
const BlissFooter = () => (
  <footer className="bl-footer bl-chrome">
    <BlissWindow
      as="div"
      title="About Fezcodex"
      icon="InfoIcon"
      tone="blue"
      headingLevel={null}
      inactive
      status={
        <>
          <span>Done</span>
          <span>© {new Date().getFullYear()} Fezcode · Bliss</span>
        </>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-sm">
          Independently built. Experimental software, field notes, and small
          instruments for a curious life.
        </p>
        <nav className="flex flex-wrap gap-2" aria-label="Footer">
          <Link className="bl-btn bl-btn-sm" to="/settings">
            Settings
          </Link>
          <Link className="bl-btn bl-btn-sm" to="/design">
            Themes
          </Link>
          <a className="bl-btn bl-btn-sm" href="/rss.xml">
            RSS
          </a>
        </nav>
      </div>
    </BlissWindow>
  </footer>
);

export default BlissFooter;
