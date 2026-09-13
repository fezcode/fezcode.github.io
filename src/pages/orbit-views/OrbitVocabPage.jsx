import React, { Suspense, useMemo, useState } from 'react';
import Seo from '../../components/Seo';
import { vocabulary } from '../../data/vocabulary';
import { useSidePanel } from '../../context/SidePanelContext';
import { OrbitFolio, OrbitNotice, OrbitRule } from '../../components/orbit';
import '../../styles/Orbit.css';

const Retrieving = () => (
  <div className="orb-root p-6">
    <OrbitNotice>RETRIEVING ENTRY…</OrbitNotice>
  </div>
);

const EntryRow = ({ entry, defIndex, onOpen }) => (
  <li>
    <button
      type="button"
      className="orb-row-link w-full text-left"
      onClick={onOpen}
    >
      <span className="orb-rank">{String(defIndex).padStart(3, '0')}</span>
      <span className="font-bold whitespace-nowrap">{entry.title}</span>
      <span
        className="orb-muted hidden sm:inline"
        style={{ textTransform: 'none', letterSpacing: 0, fontSize: '0.78rem' }}
      >
        /{entry.slug}/
      </span>
      <span className="orb-leader" aria-hidden="true" />
      <span
        className="orb-muted hidden md:inline"
        style={{ fontSize: '0.76rem' }}
      >
        {entry.category || 'TERM'}
      </span>
      <span className="orb-accent whitespace-nowrap">OPEN →</span>
    </button>
  </li>
);

const OrbitVocabPage = () => {
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
    <div className="orb-root">
      <Seo
        title="Glossary | Fezcodex"
        description="Terms and ideas the codex keeps returning to, arranged from A to Z."
      />
      <div className="orb-page">
        <OrbitFolio
          folio="FOLIO NO. 07 — GLOSSARY"
          title="Vocabulary"
          sub="TERMS THE CODEX KEEPS RETURNING TO"
        >
          <p className="orb-stats mt-3">
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
        </OrbitFolio>

        {/* pinned finding aid */}
        <div
          className="sticky top-0 z-30 -mx-2 px-2 py-3"
          style={{
            backgroundColor: 'var(--orb-veil)',
            backdropFilter: 'blur(6px)',
            borderBottom: '1px solid var(--orb-rule)',
          }}
        >
          <input
            className="orb-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a word or idea…"
            aria-label="Search vocabulary"
          />
          <div className="mt-2 flex flex-wrap items-baseline gap-1.5">
            <button
              type="button"
              className="orb-chip"
              aria-pressed={activeLetter === 'all'}
              onClick={() => setActiveLetter('all')}
            >
              ALL
            </button>
            {allLetters.map((l) => (
              <button
                key={l}
                type="button"
                className="orb-chip"
                onClick={() => scrollToLetter(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8">
          {visibleLetters.length === 0 && (
            <OrbitNotice>No entries match this search.</OrbitNotice>
          )}

          {visibleLetters.map((letter, idx) => (
            <section
              key={letter}
              id={`letter-${letter}`}
              className={`${idx === 0 ? '' : 'mt-10'} scroll-mt-40`}
            >
              <OrbitRule
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
          <OrbitRule className="mb-4" />
          <span className="orb-label">
            GLOSSARY · {String(entries.length).padStart(3, '0')} DEFINITIONS ON
            RECORD · SORTED A→Z
          </span>
        </footer>
      </div>
    </div>
  );
};

export default OrbitVocabPage;
