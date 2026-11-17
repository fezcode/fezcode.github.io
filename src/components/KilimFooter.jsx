import React from 'react';
import { Link } from 'react-router-dom';
import { KilimBand, KilimFringe } from './kilim';
import '../styles/kilim-chrome.css';

const FooterLink = ({ to, href, children }) =>
  href ? (
    <a className="klm-btn klm-btn-ivory klm-btn-small" href={href}>
      {children}
    </a>
  ) : (
    <Link className="klm-btn klm-btn-ivory klm-btn-small" to={to}>
      {children}
    </Link>
  );

/** The bottom end of the rug: a chain border, a plain-woven end, the fringe. */
const KilimFooter = () => (
  <footer className="klm-footer klm-chrome">
    <KilimBand pattern="chain" />
    <div className="klm-footer-body klm-wool-walnut">
      <div className="klm-footer-text">
        <p className="klm-footer-motto">Independently built. Woven pass by pass.</p>
        <p className="klm-footer-meta">
          © {new Date().getFullYear()} Fezcode · Kilim
        </p>
      </div>
      <nav className="klm-footer-links" aria-label="Footer">
        <FooterLink to="/settings">Settings</FooterLink>
        <FooterLink to="/design">Themes</FooterLink>
        <FooterLink href="/rss.xml">RSS ↗</FooterLink>
      </nav>
    </div>
    <KilimBand pattern="end" />
    <KilimFringe flip />
  </footer>
);

export default KilimFooter;
