import React from 'react';
import { Link } from 'react-router-dom';
import { MarquetryText, MarquetryBand, WOOD } from './marquetry';

const FooterLink = ({ to, href, children }) => {
  const label = (
    <MarquetryText text={children} size="small" fg={WOOD.cream} fit />
  );
  return href ? (
    <a className="mqt-btn" href={href} aria-label={children}>
      {label}
    </a>
  ) : (
    <Link className="mqt-btn" to={to} aria-label={children}>
      {label}
    </Link>
  );
};

const MarquetryFooter = () => (
  <footer className="mqt-footer mqt-chrome">
    <MarquetryBand
      pattern={[
        'peerie',
        'flowers',
        ['lice', { bg: WOOD.moss, fg: WOOD.cream }],
      ]}
    />
    <div className="mqt-footer-body">
      <div className="mqt-footer-text">
        <MarquetryText
          text="Independently built. Made piece by piece."
          size="small"
          fg={WOOD.cream}
        />
        <MarquetryText
          text={`© ${new Date().getFullYear()} Fezcode · Marquetry`}
          size="small"
          fg={WOOD.wheat}
          className="mt-2"
        />
      </div>
      <nav className="flex flex-wrap gap-3" aria-label="Footer">
        <FooterLink to="/settings">Settings</FooterLink>
        <FooterLink to="/design">Themes</FooterLink>
        <FooterLink href="/rss.xml">RSS ↗</FooterLink>
      </nav>
    </div>
    <MarquetryBand pattern="ribbing" colors={{ a: WOOD.moss, b: '#2f392e' }} />
  </footer>
);

export default MarquetryFooter;
