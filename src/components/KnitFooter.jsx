import React from 'react';
import { Link } from 'react-router-dom';
import { KnitText, KnitBand, YARN } from './knit';

const FooterLink = ({ to, href, children }) => {
  const label = <KnitText text={children} size="small" fg={YARN.cream} fit />;
  return href ? (
    <a className="knt-btn" href={href} aria-label={children}>
      {label}
    </a>
  ) : (
    <Link className="knt-btn" to={to} aria-label={children}>
      {label}
    </Link>
  );
};

const KnitFooter = () => (
  <footer className="knt-footer knt-chrome">
    <KnitBand pattern={['peerie', 'flowers', ['lice', { bg: YARN.moss, fg: YARN.cream }]]} />
    <div className="knt-footer-body">
      <div className="knt-footer-text">
        <KnitText
          text="Independently built. Always on the needles."
          size="small"
          fg={YARN.cream}
        />
        <KnitText
          text={`© ${new Date().getFullYear()} Fezcode · Knit`}
          size="small"
          fg={YARN.wheat}
          className="mt-2"
        />
      </div>
      <nav className="flex flex-wrap gap-3" aria-label="Footer">
        <FooterLink to="/settings">Settings</FooterLink>
        <FooterLink to="/design">Themes</FooterLink>
        <FooterLink href="/rss.xml">RSS ↗</FooterLink>
      </nav>
    </div>
    <KnitBand pattern="ribbing" colors={{ a: YARN.moss, b: '#2f392e' }} />
  </footer>
);

export default KnitFooter;
