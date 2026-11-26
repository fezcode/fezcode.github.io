import React, { Suspense, useMemo, useState } from 'react';
import Seo from '../../components/Seo';
import { vocabulary } from '../../data/vocabulary';
import { useSidePanel } from '../../context/SidePanelContext';
import { StudioFolio, StudioNotice, StudioRule } from '../../components/studio';
import '../../styles/Studio.css';

import { scrollToElement } from '../../utils/scrollToElement';
const Retrieving = () => (
  <div className="std-root p-6">
    <StudioNotice>RETRIEVING ENTRY…</StudioNotice>
  </div>
);

const EntryRow = ({ entry, defIndex, onOpen }) => (
  <li>
    <button
      type="button"
      className="std-row-link w-full text-left"
      onClick={onOpen}
    >
      <span className="std-rank">{String(defIndex).padStart(3, '0')}</span>
      <span className="font-bold whitespace-nowrap">{entry.title}</span>
      <span
        className="std-muted hidden sm:inline"
        style={{ textTransform: 'none', letterSpacing: 0, fontSize: '0.78rem' }}
      >
        /{entry.slug}/
      </span>
      <span className="std-leader" aria-hidden="true" />
      <span
        className="std-muted hidden md:inline"
        style={{ fontSize: '0.76rem' }}
      >
        {entry.category || 'TERM'}
      </span>
      <span className="std-accent whitespace-nowrap">OPEN →</span>
    </button>
  </li>
);

const StudioVocabPage = () => {
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
        scrollToElement(el, 140);
      }
    });
  };

  let running = 0;

  return (
    <div className="std-root">
      <Seo
        title="Glossary | Fezcodex"
        description="Terms and ideas the codex keeps returning to, arranged from A to Z."
      />
      <div className="std-page">
        <StudioFolio
          folio="FOLIO NO. 07 — GLOSSARY"
          title="Vocabulary"
          sub="TERMS THE CODEX KEEPS RETURNING TO"
        >
          <p className="std-stats mt-3">
            <span>
              <strong>{String(entries.length).padStart(3, '0')}</strong> ENTRIES
            </span>
            <span>
              <strong>{String(allLetters.length).padStart(2, '0')}</strong>{' '}
              LETTERS
            </span>
            <span>
              OPENS IN <strong>Side panel</strong>
            </span>
          </p>
        </StudioFolio>

        {/* pinned finding aid */}
        <div
          className="sticky top-0 z-30 -mx-2 px-2 py-3"
          style={{
            backgroundColor: 'var(--std-veil)',
            backdropFilter: 'blur(6px)',
            borderBottom: '1px solid var(--std-rule)',
          }}
        >
          <input
            className="std-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a word or idea…"
            aria-label="Search vocabulary"
          />
          <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
            <button
              type="button"
              className="std-chip"
              aria-pressed={activeLetter === 'all'}
              onClick={() => setActiveLetter('all')}
            >
              ALL
            </button>
            {allLetters.map((l) => (
              <button
                key={l}
                type="button"
                className="std-chip"
                onClick={() => scrollToLetter(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8">
          {visibleLetters.length === 0 && (
            <StudioNotice>No entries match this search.</StudioNotice>
          )}

          {visibleLetters.map((letter, idx) => (
            <section
              key={letter}
              id={`letter-${letter}`}
              className={`${idx === 0 ? '' : 'mt-10'} scroll-mt-40`}
            >
              <StudioRule
                label={`${letter} · ${String(grouped[letter].length).padStart(
                  2,
                  '0',
                )} SAVED`}
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
          <StudioRule className="mb-4" />
          <span className="std-label">
            GLOSSARY · {String(entries.length).padStart(3, '0')} DEFINITIONS ON
            RECORD · SORTED A→Z
          </span>
        </footer>
      </div>
    </div>
  );
};

export default StudioVocabPage;
