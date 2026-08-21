import React from 'react';

/**
 * Page masthead for a ledger folio: eyebrow (folio number / classification),
 * uppercase title, optional sub line, closed by a hairline. Every
 * ledger-views page opens with one so the archive reads as one book.
 */
const LedgerFolio = ({ folio, title, sub, aside, children }) => (
  <header className="mb-8">
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div className="min-w-0">
        {folio && <p className="ldg-eyebrow mb-1">{folio}</p>}
        <h1 className="ldg-title">{title}</h1>
        {sub && <p className="ldg-label mt-1">{sub}</p>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
    {children}
    <hr className="ldg-rule mt-4" />
  </header>
);

export default LedgerFolio;
