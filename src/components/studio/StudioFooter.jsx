import React from 'react';
import { Link } from 'react-router-dom';

export default function StudioFooter() {
  return (
    <footer className="std-footer">
      <Link to="/" className="std-logo">
        <span className="std-mark" aria-hidden="true" />
        fezcodex
      </Link>
      <p>Made with curiosity. © {new Date().getFullYear()} Fezcode.</p>
      <nav aria-label="Footer">
        <Link to="/settings">Settings</Link>
        <Link to="/design">Change theme</Link>
        <a href="/rss.xml">RSS</a>
        <a href="https://fezcode.studio">Fezcode Studio</a>
      </nav>
    </footer>
  );
}
