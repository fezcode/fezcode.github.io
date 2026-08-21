import React, { Suspense, useMemo, useState } from 'react';
import Seo from '../../components/Seo';
import { vocabulary } from '../../data/vocabulary';
import { useSidePanel } from '../../context/SidePanelContext';
import {
  LedgerFolio,
  LedgerNotice,
  LedgerRule,
} from '../../components/ledger';
import '../../styles/Ledger.css';

/**
 * Ledger view of the vocabulary — the GLOSSARY folio. Terms filed under
 * ruled letter headings with a running entry number; opening one retrieves
 * the definition into the side panel. The letter strip and search stay
 * pinned under the navbar so the whole book can be walked without scrolling
 * back up.
 */
const Retrieving = () => (
  <div className="ldg-root p-6">
    <LedgerNotice>RETRIEVING ENTRY…</LedgerNotice>
  </div>
);

const EntryRow = ({ entry, defIndex, onOpen }) => (
  <li>
    <button type="button" className="ldg-row-link w-full text-left" onClick={onOpen}>
      <span className="ldg-rank">{String(defIndex).padStart(3, '0')}</span>
      <span className="font-bold whitespace-nowrap">{entry.title}</span>
      <span
        className="ldg-muted hidden sm:inline"
        style={{ textTransform: 'none', letterSpacing: 0, fontSize: '0.78rem' }}
      >
        /{entry.slug}/
      </span>
      <span className="ldg-leader" aria-hidden="true" />
      <span className="ldg-muted hidden md:inline" style={{ fontSize: '0.76rem' }}>
        {entry.category || 'TERM'}
      </span>
      <span className="ldg-accent whitespace-nowrap">OPEN →</span>
    </button>
  </li>
);

const LedgerVocabPage = () => {
  const [query, setQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState('all');
  const { openSidePanel } = useSidePanel();

  const entries = useMemo(
    () =>
      Object.entries(vocabulary)
        .map(([slug, data]) => ({ slug, ...data }))
        .sort((a, b) => a.title.localeCompare(b.title)),
    [],
  );

  const filtered = useMemo(() => {
    let list = entries;
    if (activeLetter !== 'all') {
      list = list.filter(
        (e) => e.title.charAt(0).toUpperCase() === activeLetter,
      );
    }
    if (query) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q) ||
          (e.category || '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [entries, activeLetter, query]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach((e) => {
      const letter = e.title.charAt(0).toUpperCase();
      if (!g[letter]) g[letter] = [];
      g[letter].push(e);
    });
    return g;
  }, [filtered]);

  const allLetters = useMemo(() => {
    const s = new Set();
    entries.forEach((e) => s.add(e.title.charAt(0).toUpperCase()));
    return [...s].sort();
  }, [entries]);

  const visibleLetters = Object.keys(grouped).sort();

  const openVocab = (entry) => {
    const LazyComponent = React.lazy(entry.loader);
    openSidePanel(
      entry.title,
      <Suspense fallback={<Retrieving />}>
        <LazyComponent />
      </Suspense>,
      600,
    );
  };

  const scrollToLetter = (letter) => {
    setActiveLetter('all');
    requestAnimationFrame(() => {
      const el = document.getElementById(`letter-${letter}`);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 140;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  };

  let running = 0;

  return (
    <div className="ldg-root">
      <Seo
        title="Glossary | Fezcodex"
        description="The glossary folio — terms the codex keeps returning to, filed by letter."
      />
      <div className="ldg-page">
        <LedgerFolio
          folio="FOLIO NO. 07 — GLOSSARY"
          title="VOCAB"
          sub="TERMS THE CODEX KEEPS RETURNING TO"
        >
          <p className="ldg-stats mt-3">
            <span>
              <strong>{String(entries.length).padStart(3, '0')}</strong> ENTRIES
            </span>
            <span>
              <strong>{String(allLetters.length).padStart(2, '0')}</strong>{' '}
              LETTERS
            </span>
            <span>
              OPENS IN <strong>SIDE PANEL</strong>
            </span>
          </p>
        </LedgerFolio>

        {/* pinned finding aid */}
        <div
          className="sticky top-0 z-30 -mx-2 px-2 py-3"
          style={{
            backgroundColor: 'var(--ldg-veil)',
            backdropFilter: 'blur(6px)',
            borderBottom: '1px solid var(--ldg-rule)',
          }}
        >
          <input
            className="ldg-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH THE GLOSSARY…"
            aria-label="Search vocabulary"
          />
          <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
            <button
              type="button"
              className="ldg-chip"
              aria-pressed={activeLetter === 'all'}
              onClick={() => setActiveLetter('all')}
            >
              ALL
            </button>
            {allLetters.map((l) => (
              <button
                key={l}
                type="button"
                className="ldg-chip"
                onClick={() => scrollToLetter(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8">
          {visibleLetters.length === 0 && (
            <LedgerNotice>NO ENTRY FILED UNDER THAT QUERY</LedgerNotice>
          )}

          {visibleLetters.map((letter, idx) => (
            <section
              key={letter}
              id={`letter-${letter}`}
              className={`${idx === 0 ? '' : 'mt-10'} scroll-mt-40`}
            >
              <LedgerRule
                label={`${letter} · ${String(grouped[letter].length).padStart(
                  2,
                  '0',
                )} FILED`}
                className="mb-2"
              />
              <ol className="list-none m-0 p-0 flex flex-col gap-[2px]">
                {grouped[letter].map((entry) => {
                  running += 1;
                  return (
                    <EntryRow
                      key={entry.slug}
                      entry={entry}
                      defIndex={running}
                      onOpen={() => openVocab(entry)}
                    />
                  );
                })}
              </ol>
            </section>
          ))}
        </div>

        <footer className="mt-12">
          <LedgerRule className="mb-4" />
          <span className="ldg-label">
            GLOSSARY · {String(entries.length).padStart(3, '0')} DEFINITIONS ON
            RECORD · SORTED A→Z
          </span>
        </footer>
      </div>
    </div>
  );
};

export default LedgerVocabPage;
