import React from 'react';
import { Link } from 'react-router-dom';

const OrbitFooter = () => (
  <footer className="orb-footer orb-chrome">
    <div>
      <p className="orb-label">Independently built. Always in progress.</p>
      <p className="orb-label mt-1">
        © {new Date().getFullYear()} Fezcode · Orbit
      </p>
    </div>
    <nav className="flex flex-wrap gap-5" aria-label="Footer">
      <Link className="orb-link" to="/settings">
        Settings
      </Link>
      <Link className="orb-link" to="/design">
        Themes
      </Link>
      <a className="orb-link" href="/rss.xml">
        RSS ↗
      </a>
    </nav>
  </footer>
);

export default OrbitFooter;
