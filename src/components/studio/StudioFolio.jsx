import React from 'react';

const sentenceCase = (text) =>
  typeof text === 'string' && text === text.toUpperCase()
    ? text.charAt(0) + text.slice(1).toLowerCase()
    : text;

const StudioFolio = ({ folio, title, sub, aside, children }) => (
  <header className="mb-8">
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div className="min-w-0">
        {folio && <p className="std-eyebrow mb-4">Fezcodex Studio</p>}
        <h1 className="std-title">{sentenceCase(title)}</h1>
        {sub && <p className="std-intro">{sentenceCase(sub)}</p>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
    {children}
    <hr className="std-rule mt-4" />
  </header>
);

export default StudioFolio;
