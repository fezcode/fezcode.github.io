import React from 'react';

const sentenceCase = (text) =>
  typeof text === 'string' && text === text.toUpperCase()
    ? text.charAt(0) + text.slice(1).toLowerCase()
    : text;

const OrbitFolio = ({ folio, title, sub, aside, children }) => (
  <header className="mb-8">
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div className="min-w-0">
        {folio && <p className="orb-eyebrow mb-4">FEZCODEX / ORBIT</p>}
        <h1 className="orb-title">{sentenceCase(title)}</h1>
        {sub && <p className="orb-intro">{sentenceCase(sub)}</p>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
    {children}
    <hr className="orb-rule mt-4" />
  </header>
);

export default OrbitFolio;
