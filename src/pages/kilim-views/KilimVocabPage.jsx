import React, { Suspense, useMemo, useState } from 'react';
import Seo from '../../components/Seo';
import { vocabulary } from '../../data/vocabulary';
import { useSidePanel } from '../../context/SidePanelContext';
import {
  KilimText,
  KilimRug,
  KilimBand,
  KilimSideBand,
  KilimFringe,
  KilimNotice,
  WOOL,
} from '../../components/kilim';
import '../../styles/Kilim.css';
import './kilim-utility.css';

/*
 * The vocabulary as a weaver's glossary written on an ivory runner: a narrow
 * rug with fringe at both ends and sawtooth selvedges, the letters woven as
 * madder initials in its margin and each term a dictionary line beside them.
 */

const Retrieving = () => (
  <div className="klm-root klm-vocab-retrieving">
    <KilimNotice>Finding the entry…</KilimNotice>
  </div>
);

const KilimVocabPage = () => {
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

  return (
    <div className="klm-root">
      <Seo
        title="Glossary | Fezcodex"
        description="Terms and ideas the codex keeps returning to, arranged from A to Z."
      />
      <div className="klm-page">
        <KilimRug
          eyebrow="Terms the codex keeps returning to"
          title="Vocabulary"
          intro={`${entries.length} entries across ${allLetters.length} letters. Each one opens in the side panel.`}
          seed="kilim-vocabulary"
        />

        <div className="klm-vocab-tools klm-wool-walnut">
          <input
            className="klm-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a word or idea…"
            aria-label="Search vocabulary"
          />
          <div className="klm-vocab-letters">
            <button
              type="button"
              className="klm-chip"
              aria-pressed={activeLetter === 'all'}
              onClick={() => setActiveLetter('all')}
            >
              All
            </button>
            {allLetters.map((l) => (
              <button
                key={l}
                type="button"
                className="klm-chip klm-vocab-letter-chip"
                onClick={() => scrollToLetter(l)}
                aria-label={`Jump to ${l}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="klm-vocab-loom">
          <KilimFringe className="klm-vocab-fringe" />
          <div className="klm-vocab-runner">
            <KilimSideBand className="klm-vocab-selvedge-left" />
            <KilimSideBand className="klm-vocab-selvedge-right" />
            <KilimBand pattern="end" />
            <div className="klm-vocab-weft">
              {visibleLetters.length === 0 && (
                <KilimNotice className="klm-vocab-empty">
                  No entries match this search.
                </KilimNotice>
              )}
              {visibleLetters.map((letter) => (
                <section
                  key={letter}
                  id={`letter-${letter}`}
                  className="klm-vocab-letter"
                >
                  <div className="klm-vocab-initial">
                    <KilimText
                      as="h2"
                      text={letter}
                      scale={3}
                      fg={WOOL.madder}
                      fit
                    />
                    <span className="klm-vocab-count">
                      {grouped[letter].length} saved
                    </span>
                  </div>
                  <ol className="klm-vocab-list">
                    {grouped[letter].map((entry) => (
                      <li key={entry.slug}>
                        <button
                          type="button"
                          className="klm-vocab-entry"
                          onClick={() => openVocab(entry)}
                          aria-label={`Open ${entry.title}`}
                        >
                          <span className="klm-vocab-term">{entry.title}</span>
                          <span className="klm-vocab-pron">/{entry.slug}/</span>
                          <span className="klm-vocab-leader" aria-hidden="true" />
                          <span className="klm-vocab-cat">
                            {entry.category || 'term'}
                          </span>
                          <span className="klm-vocab-arrow" aria-hidden="true">
                            →
                          </span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
            <KilimBand pattern="end" />
          </div>
          <KilimFringe flip className="klm-vocab-fringe" />
        </div>

        <p className="klm-label klm-vocab-foot">
          Glossary · {entries.length} definitions on record · sorted A→Z
        </p>
      </div>
    </div>
  );
};

export default KilimVocabPage;
